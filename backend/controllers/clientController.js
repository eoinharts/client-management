const db = require('../db');

exports.getAllClients = (req, res) => {
  db.query('SELECT * FROM clients', (err, results) => {
    if (err) {
      console.error("Error fetching clients:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};

exports.createClient = (req, res) => {
  const { name, email, phone, regularity } = req.body;
  const sql = 'INSERT INTO clients (name, email, phone, regularity) VALUES (?, ?, ?, ?)';
  db.query(sql, [name, email, phone, regularity], (err, result) => {
    if (err) {
      console.error("Error creating client:", err);
      return res.status(500).json({ error: err.message });
    }
    const newClient = { id: result.insertId, name, email, phone, regularity };
    res.status(201).json(newClient);
  });
};

exports.updateClient = (req, res) => {
  const { id } = req.params;
  const { name, email, phone, regularity } = req.body;
  const sql = 'UPDATE clients SET name = ?, email = ?, phone = ?, regularity = ? WHERE id = ?';
  db.query(sql, [name, email, phone, regularity, id], (err) => {
    if (err) {
      console.error("Error updating client:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Client updated' });
  });
};

exports.deleteClient = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM clients WHERE id = ?', [id], (err) => {
    if (err) {
      console.error("Error deleting client:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Client deleted' });
  });
};
