const db = require('../db');

exports.getAllSessions = (req, res) => {
  db.query('SELECT * FROM sessions', (err, results) => {
    if (err) {
      console.error("Error fetching sessions:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};

exports.createSession = (req, res) => {
  const { therapistId, clientId, notes, date, length } = req.body;
  const sql = 'INSERT INTO sessions (therapistId, clientId, notes, date, length) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [therapistId, clientId, notes, date, length], (err, result) => {
    if (err) {
      console.error("Error creating session:", err);
      return res.status(500).json({ error: err.message });
    }
    const newSession = { id: result.insertId, therapistId, clientId, notes, date, length };
    res.status(201).json(newSession);
  });
};

exports.updateSession = (req, res) => {
  const { id } = req.params;
  const { therapistId, clientId, notes, date, length } = req.body;
  const sql = 'UPDATE sessions SET therapistId = ?, clientId = ?, notes = ?, date = ?, length = ? WHERE id = ?';
  db.query(sql, [therapistId, clientId, notes, date, length, id], (err) => {
    if (err) {
      console.error("Error updating session:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Session updated' });
  });
};

exports.deleteSession = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM sessions WHERE id = ?', [id], (err) => {
    if (err) {
      console.error("Error deleting session:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Session deleted' });
  });
};
