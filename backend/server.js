require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const app = express();

app.use(express.json());
app.use(cors());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
console.log("⚡ Connecting to Supabase...");


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

app.post('/api/auth/forgot-password', async (req, res) => {
    const { email } = req.body;
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const { error } = await supabase.from('users').update({ reset_code: code }).eq('email', email);
    if (error) return res.status(500).json({ error: error.message });
    console.log(`📧 EMAIL SIMULATION TO: ${email} | 🔑 CODE: ${code}`);
    res.json({ message: "Code sent" });
});

app.post('/api/auth/verify-code', async (req, res) => {
    const { email, code } = req.body;
    const { data, error } = await supabase.from('users').select('*').eq('email', email).eq('reset_code', code).single();
    if (error || !data) return res.status(400).json({ message: "Invalid code" });
    res.json({ message: "Code verified" });
});

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


app.get('/api/categories', async (req, res) => {
    const { data, error } = await supabase.from('categories').select('*').order('category_id', { ascending: true });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

app.get('/api/menu', async (req, res) => {
    const { data, error } = await supabase.from('menu_items').select('*').order('item_id', { ascending: true });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

app.post('/api/menu', async (req, res) => {
    const { name, price, category_id, image_url, stock } = req.body;
    const { data, error } = await supabase.from('menu_items').insert([{ name, price, category_id, image_url, stock: stock || 50 }]).select();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

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


app.post('/api/orders', async (req, res) => {
    const { user_id, total_amount, payment_method, payment_reference, items, station_number } = req.body;

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

    if (items && items.length > 0) {
        const deductionPromises = items.map(async (item) => {
            const { item_id, quantity } = item;
            
            if (!item_id) {
                console.warn(`Inventory deduction skipped for item: item_id is missing.`);
                return;
            }
            
            const { data: current, error: fErr } = await supabase
                .from('menu_items')
                .select('stock')
                .eq('item_id', item_id)
                .single();

            if (fErr || !current) {
                console.error(`Inventory deduction failed for item ID ${item_id}: Item not found or fetch error.`);
                return; 
            }

            const newStock = current.stock - quantity;
            
            await supabase
                .from('menu_items')
                .update({ stock: newStock })
                .eq('item_id', item_id);
        });

        await Promise.all(deductionPromises);
    }

    res.json({ message: "Order success (Inventory deducted)", order: orderData });
});

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

app.get('/api/orders', async (req, res) => {
    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});


app.get('/api/staff/orders/:status', async (req, res) => {
    const { status } = req.params;

    const { data, error } = await supabase
        .from('orders')
        .select(`
            *,
            users ( username ),
            order_items ( name, quantity, notes, price )  
        `)
        .eq('status', status)
        .order('created_at', { ascending: true });

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

app.patch('/api/staff/orders/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status, payment_status, payment_reference } = req.body;

    const updates = { status };
    if (payment_status) updates.payment_status = payment_status;
    
    if (payment_reference) {
        updates.payment_reference = payment_reference;
    }

    const { data, error } = await supabase.from('orders').update(updates).eq('order_id', id).select();
    if (error) {
        console.error("❌ DB Error:", error.message);
        return res.status(500).json({ error: error.message });
    }
    
    res.json({ message: "Status updated", order: data });
});

app.get('/api/admin/users', async (req, res) => {
    
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

app.delete('/api/admin/users/:id', async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase.from('users').delete().eq('user_id', id);
    
    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: "User deleted successfully" });
});


app.post('/api/reviews', async (req, res) => {
    
    const { user_id, order_id, username, rating, comment } = req.body;

    
    if (!rating || !comment) {
        return res.status(400).json({ error: "Rating and comment are required." });
    }

    try {
        const { data, error } = await supabase
            .from('reviews')
            .insert([{ 
                
                user_id: user_id || null, 
                order_id: order_id || null, 
                username: username || 'Anonymous User', 
                rating, 
                comment 
            }])
            .select();

        if (error) {
            console.error('Supabase Review Insertion Error:', error); 
            throw error;
        }

        res.json({ message: "Review submitted", review: data });
    } catch (e) {
        
        console.error('SERVER CRASH / REVIEW ERROR:', e); 
        res.status(500).json({ error: "Review failed due to a server error." });
    }
});


app.get('/api/reviews', async (req, res) => {
    const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5); 

    if (error) {
        console.error('Supabase Review Fetch Error:', error);
        return res.status(500).json({ error: error.message });
    }
    res.json(data);
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});