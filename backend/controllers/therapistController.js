const db = require('../db');

exports.getAllTherapists = (req, res) => {
  db.query('SELECT * FROM therapists', (err, results) => {
    if (err) {
      console.error("Error fetching therapists:", err);
      return res.status(500).json({ error: err.message || "Unknown error" });
    }
    res.json(results);
  });
};

exports.createTherapist = (req, res) => {
  const { title, name, email, location, yearsOfPractice, availability } = req.body;
  const sql = 'INSERT INTO therapists (title, name, email, location, yearsOfPractice, availability) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(sql, [title, name, email, location, yearsOfPractice, availability], (err, result) => {
    if (err) {
      console.error("Error creating therapist:", err);
      return res.status(500).json({ error: err.message });
    }
    const newTherapist = { id: result.insertId, title, name, email, location, yearsOfPractice, availability };
    res.status(201).json(newTherapist);
  });
};

exports.updateTherapist = (req, res) => {
  const { id } = req.params;
  const { title, name, email, location, yearsOfPractice, availability } = req.body;
  const sql = 'UPDATE therapists SET title = ?, name = ?, email = ?, location = ?, yearsOfPractice = ?, availability = ? WHERE id = ?';
  db.query(sql, [title, name, email, location, yearsOfPractice, availability, id], (err) => {
    if (err) {
      console.error("Error updating therapist:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Therapist updated' });
  });
};

exports.deleteTherapist = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM therapists WHERE id = ?', [id], (err) => {
    if (err) {
      console.error("Error deleting therapist:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Therapist deleted' });
  });
};
