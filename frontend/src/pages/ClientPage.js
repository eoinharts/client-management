import React, { useState, useEffect } from 'react';
import '../App.css';

function ClientPage() {
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    regularity: '',
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/clients')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log('Clients data received:', data);
        setClients(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error('Fetch error (clients):', err);
        setClients([]);
      });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      fetch(`http://localhost:5000/api/clients/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
        .then(() => {
          setClients(clients.map(client => client.id === editingId ? { ...client, ...formData } : client));
          setEditingId(null);
          setFormData({ name: '', email: '', phone: '', regularity: '' });
        })
        .catch(err => console.error('Update error:', err));
    } else {
      fetch('http://localhost:5000/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
        .then(res => res.json())
        .then(newClient => {
          setClients([...clients, newClient]);
          setFormData({ name: '', email: '', phone: '', regularity: '' });
        })
        .catch(err => console.error('Create error:', err));
    }
  };

  const handleEdit = (client) => {
    setEditingId(client.id);
    setFormData(client);
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:5000/api/clients/${id}`, {
      method: 'DELETE',
    })
      .then(() => setClients(clients.filter(client => client.id !== id)))
      .catch(err => console.error('Delete error:', err));
  };

  return (
    <div className="container">
      <h2 className="page-title">Clients</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Regularity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map(client => (
            <tr key={client.id}>
              <td>{client.id}</td>
              <td>{client.name}</td>
              <td>{client.email}</td>
              <td>{client.phone}</td>
              <td>{client.regularity}</td>
              <td>
                <button className="action-btn edit" onClick={() => handleEdit(client)}>Edit</button>
                <button className="action-btn delete" onClick={() => handleDelete(client.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="form-title">{editingId ? 'Edit Client' : 'Add New Client'}</h3>
      <form className="data-form" onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
        <select name="regularity" value={formData.regularity} onChange={handleChange} required>
          <option value="">Select Regularity</option>
          <option value="WEEKLY">WEEKLY</option>
          <option value="MONTHLY">MONTHLY</option>
        </select>
        <button type="submit">{editingId ? 'Update' : 'Add'}</button>
      </form>
    </div>
  );
}

export default ClientPage;
