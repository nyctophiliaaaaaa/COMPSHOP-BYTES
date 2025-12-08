require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const app = express();

// MIDDLEWARE
app.use(express.json());
app.use(cors());

// CONNECT TO SUPABASE
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
console.log("⚡ Connecting to Supabase...");

// ============================================
// 🔐 AUTH ROUTES (Login/Register/Reset)
// ============================================

// 1. REGISTER
app.post('/api/auth/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const { data, error } = await supabase
            .from('users')
            .insert([{ username, email, password_hash: hashedPassword, role_id: 3 }])
            .select();
        if (error) throw error;
        res.json({ message: "Registration successful!", user: data });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// 2. LOGIN
app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const { data, error } = await supabase
            .from('users')
            .select(`user_id, username, password_hash, email, role_id, user_roles ( role_name )`)
            .eq('username', username)
            .single();

        if (error || !data) return res.status(401).json({ message: "Invalid credentials" });

        const validPassword = await bcrypt.compare(password, data.password_hash);
        if (!validPassword) return res.status(401).json({ message: "Invalid credentials" });

        const userRole = data.user_roles ? data.user_roles.role_name : 'Customer';
        res.json({ message: "Login successful", user: { id: data.user_id, username: data.username, role: userRole } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 3. FORGOT PASSWORD
app.post('/api/auth/forgot-password', async (req, res) => {
    const { email } = req.body;
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const { error } = await supabase.from('users').update({ reset_code: code }).eq('email', email);
    if (error) return res.status(500).json({ error: error.message });
    console.log(`📧 EMAIL SIMULATION TO: ${email} | 🔑 CODE: ${code}`);
    res.json({ message: "Code sent" });
});

// 4. VERIFY CODE
app.post('/api/auth/verify-code', async (req, res) => {
    const { email, code } = req.body;
    const { data, error } = await supabase.from('users').select('*').eq('email', email).eq('reset_code', code).single();
    if (error || !data) return res.status(400).json({ message: "Invalid code" });
    res.json({ message: "Code verified" });
});

// 5. RESET PASSWORD
app.post('/api/auth/reset-password', async (req, res) => {
    const { email, newPassword } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        const { error } = await supabase.from('users').update({ password_hash: hashedPassword, reset_code: null }).eq('email', email);
        if (error) throw error;
        res.json({ message: "Password updated" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============================================
// 📦 MENU & INVENTORY ROUTES
// ============================================

// 6. GET CATEGORIES
app.get('/api/categories', async (req, res) => {
    const { data, error } = await supabase.from('categories').select('*').order('category_id', { ascending: true });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// 7. GET MENU ITEMS
app.get('/api/menu', async (req, res) => {
    const { data, error } = await supabase.from('menu_items').select('*').order('item_id', { ascending: true });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// 8. ADD NEW ITEM (Admin)
app.post('/api/menu', async (req, res) => {
    const { name, price, category_id, image_url, stock } = req.body;
    const { data, error } = await supabase.from('menu_items').insert([{ name, price, category_id, image_url, stock: stock || 50 }]).select();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// 9. UPDATE STOCK (Admin)
app.patch('/api/menu/:id/stock', async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;
    
    const { data: current, error: fErr } = await supabase.from('menu_items').select('stock').eq('item_id', id).single();
    if (fErr) return res.status(500).json({ error: fErr.message });

    const newStock = (current.stock || 0) + quantity;
    if (newStock < 0) return res.status(400).json({ error: "Stock cannot be negative" });

    const { data, error } = await supabase.from('menu_items').update({ stock: newStock }).eq('item_id', id).select();
    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: "Stock updated", item: data[0] });
});

// ============================================
// 🛒 CUSTOMER ORDER ROUTES
// ============================================

// 10. PLACE ORDER (Updated to deduct inventory)
app.post('/api/orders', async (req, res) => {
    const { user_id, total_amount, payment_method, payment_reference, items, station_number } = req.body;

    // A. Create Order
    const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([{ 
            user_id, 
            total_amount, 
            payment_method, 
            payment_reference,
            station_number, 
            status: 'Pending',
            payment_status: payment_method === 'Cash' ? 'Unpaid' : 'Pending Verification' 
        }])
        .select()
        .single();

    if (orderError) return res.status(500).json({ error: orderError.message });

    // B. Save Items
    if (items && items.length > 0) {
        const itemsToInsert = items.map(item => ({
            order_id: orderData.order_id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            notes: item.notes || ''
        }));
        await supabase.from('order_items').insert(itemsToInsert);
    }

    // C. CRITICAL NEW STEP: DEDUCT INVENTORY
    if (items && items.length > 0) {
        // Use Promise.all to deduct stock for all items concurrently
        const deductionPromises = items.map(async (item) => {
            // NOTE: Requires 'item_id' to be present in the 'items' array sent from the frontend
            const { item_id, quantity } = item;
            
            if (!item_id) {
                console.warn(`Inventory deduction skipped for item: item_id is missing.`);
                return;
            }
            
            // 1. Fetch current stock
            const { data: current, error: fErr } = await supabase
                .from('menu_items')
                .select('stock')
                .eq('item_id', item_id)
                .single();

            if (fErr || !current) {
                console.error(`Inventory deduction failed for item ID ${item_id}: Item not found or fetch error.`);
                // In a production system, you would ROLLBACK the entire order here.
                return; 
            }

            const newStock = current.stock - quantity;
            
            // 2. Update stock
            await supabase
                .from('menu_items')
                .update({ stock: newStock })
                .eq('item_id', item_id);
        });

        // Wait for all deductions to complete before responding
        await Promise.all(deductionPromises);
    }

    res.json({ message: "Order success (Inventory deducted)", order: orderData });
});

// 11. GET ALL ACTIVE ORDERS FOR USER
app.get('/api/orders/user/:user_id/active', async (req, res) => {
    const { user_id } = req.params;

    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user_id)
        .neq('status', 'Completed') 
        .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// [NEW] 11.5. GET ALL ORDERS (Transaction History/Reports)
app.get('/api/orders', async (req, res) => {
    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// ============================================
// 👨‍🍳 STAFF DASHBOARD ROUTES
// ============================================

// 12. GET ORDERS BY STATUS (With Items & User)
app.get('/api/staff/orders/:status', async (req, res) => {
    const { status } = req.params;

    const { data, error } = await supabase
        .from('orders')
        .select(`
            *,
            users ( username ),
            order_items ( name, quantity, notes )
        `)
        .eq('status', status)
        .order('created_at', { ascending: true });

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// 13. UPDATE ORDER STATUS
app.patch('/api/staff/orders/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status, payment_status } = req.body;

    const updates = { status };
    if (payment_status) updates.payment_status = payment_status;

    const { data, error } = await supabase.from('orders').update(updates).eq('order_id', id).select();
    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: "Status updated", order: data });
});

// ============================================
// 👮‍♂️ ADMIN ROUTES
// ============================================

// 14. GET ALL USERS
app.get('/api/admin/users', async (req, res) => {
    // Select from users and join with user_roles to get role_name
    const { data, error } = await supabase
        .from('users')
        .select(`
            *,
            user_roles ( role_name )
        `)
        .order('user_id', { ascending: true });

    if (error) {
        console.error("Supabase Error:", error);
        return res.status(500).json({ error: error.message });
    }
    res.json(data);
});

// [NEW] 15. DELETE USER
app.delete('/api/admin/users/:id', async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase.from('users').delete().eq('user_id', id);
    
    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: "User deleted successfully" });
});

// ============================================
// ⭐ REVIEWS ROUTES (Updated for Robustness)
// ============================================

// 16. SUBMIT REVIEW (Customer)
app.post('/api/reviews', async (req, res) => {
    // Safely extract all possible fields, allowing null/undefined for optional fields
    const { user_id, order_id, username, rating, comment } = req.body;

    // Basic server-side validation (optional, but good practice)
    if (!rating || !comment) {
        return res.status(400).json({ error: "Rating and comment are required." });
    }

    try {
        const { data, error } = await supabase
            .from('reviews')
            .insert([{ 
                // Ensure null values are sent correctly if not provided by client
                user_id: user_id || null, 
                order_id: order_id || null, 
                username: username || 'Anonymous User', 
                rating, 
                comment 
            }])
            .select();

        if (error) {
            console.error('Supabase Review Insertion Error:', error); // Log the DB error if it happens
            throw error;
        }

        res.json({ message: "Review submitted", review: data });
    } catch (e) {
        // This catches the server crash (500 error)
        console.error('SERVER CRASH / REVIEW ERROR:', e); 
        res.status(500).json({ error: "Review failed due to a server error." });
    }
});

// [NEW] 17. GET LATEST REVIEWS (Admin Reports)
app.get('/api/reviews', async (req, res) => {
    // Note: The frontend AdminDashboard-Reports.vue fetches this endpoint
    // We limit it to the latest 5 reviews for the dashboard panel
    const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5); // Adjust limit as needed, or add pagination/filtering if necessary

    if (error) {
        console.error('Supabase Review Fetch Error:', error);
        return res.status(500).json({ error: error.message });
    }
    res.json(data);
});


// START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});