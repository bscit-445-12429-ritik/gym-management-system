const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Serve static files (HTML, CSS, JS)

let db;

// Initialize SQLite database
(async () => {
    try {
        db = await open({
            filename: 'database.sqlite',
            driver: sqlite3.Database
        });
        
        console.log('Connected to SQLite database.');

        await db.exec(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL,
                joinDate TEXT NOT NULL
            );
            
            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                subject TEXT NOT NULL,
                message TEXT NOT NULL,
                date TEXT NOT NULL
            );
            
            CREATE TABLE IF NOT EXISTS transactions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId TEXT NOT NULL,
                userEmail TEXT NOT NULL,
                planName TEXT NOT NULL,
                amount TEXT NOT NULL,
                paymentMethod TEXT NOT NULL,
                status TEXT NOT NULL,
                date TEXT NOT NULL
            );
        `);
        console.log('Database tables verified.');
    } catch (err) {
        console.error('Database connection failed:', err);
    }
})();

// Signup Endpoint
app.post('/api/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        const existingUser = await db.get('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered. Please login.' });
        }

        const joinDate = new Date().toLocaleDateString();
        const result = await db.run('INSERT INTO users (name, email, password, joinDate) VALUES (?, ?, ?, ?)', [name, email, password, joinDate]);
        
        res.status(201).json({ 
            message: 'Account created successfully!', 
            user: { id: result.lastID, name, email, joinDate } 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Database error occurred.' });
    }
});

// Login Endpoint
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await db.get('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
        
        if (user) {
            res.status(200).json({ 
                message: 'Login successful!', 
                user: { id: user.id, name: user.name, email: user.email, joinDate: user.joinDate } 
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password!' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Database error occurred.' });
    }
});

// Contact Form Endpoint
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        const date = new Date().toLocaleString();
        
        await db.run('INSERT INTO messages (name, email, subject, message, date) VALUES (?, ?, ?, ?, ?)', [name, email, subject, message, date]);
        
        res.status(201).json({ message: 'Message sent successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to send message.' });
    }
});

// Payment Transaction Endpoint
app.post('/api/payment', async (req, res) => {
    try {
        const { userId, userEmail, planName, amount, paymentMethod } = req.body;
        const date = new Date().toLocaleString();
        const status = 'Success';
        
        const result = await db.run('INSERT INTO transactions (userId, userEmail, planName, amount, paymentMethod, status, date) VALUES (?, ?, ?, ?, ?, ?, ?)', [userId, userEmail, planName, amount, paymentMethod, status, date]);
        
        res.status(201).json({ 
            message: 'Payment successful and recorded!',
            transactionId: result.lastID.toString().padStart(8, '0')
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to record transaction.' });
    }
});

// Get User Transactions Endpoint
app.get('/api/transactions/:email', async (req, res) => {
    try {
        const email = req.params.email;
        const transactions = await db.all('SELECT * FROM transactions WHERE userEmail = ? ORDER BY id DESC', [email]);
        
        const formattedTransactions = transactions.map(t => ({
            id: t.id.toString(),
            planName: t.planName,
            amount: t.amount,
            paymentMethod: t.paymentMethod,
            status: t.status,
            date: t.date
        }));
        
        res.status(200).json(formattedTransactions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Database error occurred.' });
    }
});

// ============================================
// ADMIN ENDPOINTS
// ============================================
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'gymowner123';
const ADMIN_TOKEN = 'secret-admin-token-777'; // Simple static token for demo purposes

// Admin Middleware
function requireAdmin(req, res, next) {
    const token = req.headers['authorization'];
    if (token === ADMIN_TOKEN) {
        next();
    } else {
        res.status(403).json({ message: 'Forbidden. Invalid admin token.' });
    }
}

// Admin Login
app.post('/api/admin/login', (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
        res.status(200).json({ token: ADMIN_TOKEN });
    } else {
        res.status(401).json({ message: 'Invalid admin password' });
    }
});

// Admin Stats
app.get('/api/admin/stats', requireAdmin, async (req, res) => {
    try {
        const usersCount = (await db.get('SELECT COUNT(*) as count FROM users')).count;
        const msgCount = (await db.get('SELECT COUNT(*) as count FROM messages')).count;
        const txCount = (await db.get('SELECT COUNT(*) as count FROM transactions')).count;
        
        // Calculate revenue
        const transactions = await db.all('SELECT amount FROM transactions');
        let revenue = 0;
        transactions.forEach(t => {
            const val = parseFloat(t.amount.replace(/[^0-9.-]+/g,"")); // Remove $ sign
            if (!isNaN(val)) revenue += val;
        });

        res.json({
            users: usersCount,
            revenue: '₹' + revenue.toFixed(2),
            transactions: txCount,
            messages: msgCount
        });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching stats' });
    }
});

// Admin Get All Users
app.get('/api/admin/users', requireAdmin, async (req, res) => {
    try {
        const users = await db.all('SELECT * FROM users ORDER BY id DESC');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching users' });
    }
});

// Admin Get All Transactions
app.get('/api/admin/transactions', requireAdmin, async (req, res) => {
    try {
        const transactions = await db.all('SELECT * FROM transactions ORDER BY id DESC');
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching transactions' });
    }
});

// Admin Get All Messages
app.get('/api/admin/messages', requireAdmin, async (req, res) => {
    try {
        const messages = await db.all('SELECT * FROM messages ORDER BY id DESC');
        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching messages' });
    }
});

// Start Server
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running! Open your browser and go to: http://localhost:${PORT}`);
    });
}

module.exports = app;