const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); // Add this line

const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS for all routes

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

// Add a new endpoint to fetch users
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