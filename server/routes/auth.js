const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');

// 👉 POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'DB error', err });

    if (results.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role || 'officer'],
      (err, result) => {
        if (err) {
  console.error('Insert error:', err); // log full error in terminal
  return res.status(500).json({ message: 'Insert error', error: err.sqlMessage });
}

        res.status(201).json({ message: 'User registered successfully' });
      }
    );
  });
});


// 👉 POST /api/auth/login
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    console.log("Login attempt:", email);
  
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
      if (err) 
        {
          console.log("DB error:", err);
          return res.status(500).json({ message: 'DB error', err });
        }
  
      if (results.length === 0) {
        console.log("User not found");
        return res.status(404).json({ message: 'User not found' });
      }
  
      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password);
      console.log("Password match:", isMatch);
  
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      res.status(200).json({ message: 'Login successful', user: { id: user.id, name: user.name, role: user.role } });
    });
  });

  module.exports = router;
  