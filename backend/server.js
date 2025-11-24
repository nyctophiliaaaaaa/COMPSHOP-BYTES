
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();


app.use(express.json());
app.use(cors());


const db = mysql.createConnection({
    host: '127.0.0.1', 
    port: 3306,        
    user: 'root',
    password: '',
    database: 'compshop_db'
});

db.connect((err) => {
    if (err) {
        console.log('❌ Database Connection Failed:', err);
    } else {
        console.log('✅ Connected to MySQL Database');
    }
});

// ============================================
// THE API ENDPOINTS
// ============================================


app.post('/api/auth/register', (req, res) => {
    const { username, email, password } = req.body;
   
    console.log("Register attempt:", username, email);
    res.json({ 
        message: "User registered successfully!", 
        user: { username, email } 
    });
});


app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    
    console.log("Login attempt:", username);
    res.json({ 
        message: "Login successful!",
        token: "fake-jwt-token-for-testing" 
    });
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
