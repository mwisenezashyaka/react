const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt'); // Add this for password hashing

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'eav',
    port: 3306
});

db.connect((err) => {
    if (err) {
        console.log("error connecting to database:", err);
    } else {
        console.log("connected successful!");
    }
});

app.get('/', (req, res) => {
    res.send("welcome to our eav");
});

// Existing add-user endpoint (you might want to update this too)
app.post('/add-user', (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ message: 'Name and email are required.' });
    }

    const insertQuery = 'INSERT INTO user (name, email) VALUES (?, ?)';
    db.execute(insertQuery, [name, email], (err, results) => {
        if (err) {
            console.error('Error inserting user:', err);
            return res.status(500).json({ message: 'Error inserting user.' });
        }
        res.json({ 
            message: 'User added successfully!', 
            userId: results.insertId,
            name,
            email
        });
    });
});

// New registration endpoint
app.post('/register', async (req, res) => {
    const { fullname, email, password, confirmPassword } = req.body;

    // Validate input
    if (!fullname || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match.' });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    try {
        // Check if user already exists
        const [existingUser] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Email already in use.' });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert new user
        const [result] = await db.promise().query(
            'INSERT INTO users (fullname, email, password) VALUES (?, ?, ?)',
            [fullname, email, hashedPassword]
        );

        res.status(201).json({ 
            message: 'User registered successfully!',
            userId: result.insertId,
            fullname,
            email
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Error registering user.' });
    }
});

// Existing users endpoint
app.get('/users', (req, res) => {
    const selectQuery = 'SELECT * FROM user';
    db.execute(selectQuery, (err, results) => {
        if (err) {
            console.error('Error fetching users:', err);
            return res.status(500).json({ message: 'Error fetching users.' });
        }
        res.json(results);
    });
});

app.listen(5000, () => {
    console.log("server is okay drigo running on port 5000...");
});