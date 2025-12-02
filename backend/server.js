require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs'); // <--- IMPORT BCRYPT

const app = express();

// MIDDLEWARE
app.use(express.json());
app.use(cors());

// CONNECT TO SUPABASE
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
console.log("⚡ Connecting to Supabase...");

// ============================================
// 🔐 SECURE AUTH ROUTES
// ============================================

// 1. REGISTER (Sign Up) - Now Hashes Password
app.post('/api/auth/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // HASH THE PASSWORD (Salt = 10 rounds)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save the HASH, not the plain text
        const { data, error } = await supabase
            .from('users')
            .insert([{ 
                username: username, 
                email: email, 
                password_hash: hashedPassword, // <--- SECURE
                role_id: 3 // Default to Customer
            }])
            .select();

        if (error) throw error;
        
        res.json({ message: "Registration successful!", user: data });

    } catch (error) {
        console.error("Signup Error:", error.message);
        res.status(400).json({ error: error.message });
    }
});

// 2. LOGIN - Now Compares Hashes
app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Fetch user by username
        const { data, error } = await supabase
            .from('users')
            .select(`
                user_id, username, password_hash, email, role_id,
                user_roles ( role_name )
            `)
            .eq('username', username)
            .single();

        if (error || !data) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // COMPARE typed password with stored HASH
        const validPassword = await bcrypt.compare(password, data.password_hash);

        if (!validPassword) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Extract Role
        const userRole = data.user_roles ? data.user_roles.role_name : 'Customer';

        res.json({ 
            message: "Login successful", 
            user: { 
                id: data.user_id, 
                username: data.username, 
                role: userRole 
            } 
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============================================
// 🔑 PASSWORD RESET FLOW (Updated)
// ============================================

// 3. REQUEST RESET CODE
app.post('/api/auth/forgot-password', async (req, res) => {
    const { email } = req.body;
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const { error } = await supabase
        .from('users')
        .update({ reset_code: code })
        .eq('email', email);

    if (error) return res.status(500).json({ error: error.message });

    console.log(`📧 EMAIL SIMULATION TO: ${email} | 🔑 CODE: ${code}`);
    res.json({ message: "Code sent" });
});

// 4. VERIFY CODE
app.post('/api/auth/verify-code', async (req, res) => {
    const { email, code } = req.body;

    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('reset_code', code)
        .single();

    if (error || !data) return res.status(400).json({ message: "Invalid code" });

    res.json({ message: "Code verified" });
});

// 5. SET NEW PASSWORD - Now Hashes!
app.post('/api/auth/reset-password', async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        const { error } = await supabase
            .from('users')
            .update({ 
                password_hash: hashedPassword, // <--- SECURE UPDATE
                reset_code: null 
            })
            .eq('email', email);

        if (error) throw error;
        res.json({ message: "Password updated successfully" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============================================
// 🍔 MENU & ORDER ROUTES (Unchanged)
// ============================================

app.get('/api/menu', async (req, res) => {
    const { data, error } = await supabase.from('menu_items').select('*').order('item_id', { ascending: true });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

app.post('/api/menu', async (req, res) => {
    const { name, price, category_id, image_url } = req.body;
    const { data, error } = await supabase.from('menu_items').insert([{ name, price, category_id, image_url }]).select();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

app.post('/api/orders', async (req, res) => {
    const { user_id, total_amount } = req.body;
    const { data, error } = await supabase.from('orders').insert([{ user_id, total_amount }]).select();
    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: "Order success", order: data });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Secure Server running on http://localhost:${PORT}`);
});