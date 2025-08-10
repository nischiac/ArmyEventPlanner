const express = require('express');
const router = express.Router();
const db = require('../db');

// Create new event
router.post('/create', (req, res) => {
  const { title, description, date, location, created_by } = req.body;

  const query = `INSERT INTO events (title, description, date, location, created_by)
                 VALUES (?, ?, ?, ?, ?)`;

  db.query(query, [title, description, date, location, created_by], (err, result) => {
    if (err) return res.status(500).json({ message: 'Insert error', error: err.sqlMessage });
    res.status(200).json({ message: 'Event created successfully' });
  });
});

// Get all events
router.get('/', (req, res) => {
  db.query('SELECT * FROM events', (err, results) => {
    if (err) return res.status(500).json({ message: 'Fetch error', error: err.sqlMessage });
    res.status(200).json(results);
  });
});

// Update an event
router.put('/update/:id', (req, res) => {
  const { title, description, date, location } = req.body;
  const { id } = req.params;

  const query = `UPDATE events SET title=?, description=?, date=?, location=? WHERE id=?`;

  db.query(query, [title, description, date, location, id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Update error', error: err.sqlMessage });
    res.status(200).json({ message: 'Event updated successfully' });
  });
});

// Delete an event
router.delete('/delete/:id', (req, res) => {
  const { id } = req.params;

  const query = `DELETE FROM events WHERE id=?`;

  db.query(query, [id], (err, result) => {
    if (err)
      console.error('Delete error:', err);  
      return res.status(500).json({ message: 'Delete error', error: err.sqlMessage });
    res.status(200).json({ message: 'Event deleted successfully' });
  });
});

// Cadet joins an event
router.post('/join', (req, res) => {
  const { cadet_name, cadet_email, event_id } = req.body;

  const query = `INSERT INTO registrations (cadet_name, cadet_email, event_id) VALUES (?, ?, ?)`;

  db.query(query, [cadet_name, cadet_email, event_id], (err, result) => {
    if (err) {
      console.error('Join Error:', err);
      return res.status(500).json({ message: 'Join failed', error: err });
    }
    res.status(200).json({ message: 'Cadet registered for the event successfully' });
  });
});

// Get all cadets registered for a specific event
router.get('/registrations/:eventId', (req, res) => {
  const { eventId } = req.params;

  const query = `SELECT * FROM registrations WHERE event_id = ?`;

  db.query(query, [eventId], (err, result) => {
    if (err) {
      console.error('Fetch cadets error:', err);
      return res.status(500).json({ message: 'Failed to fetch cadets', error: err });
    }
    res.status(200).json(result);
  });
});


module.exports = router;
