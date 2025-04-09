import React, { useState, useEffect } from 'react';
import '../App.css'; // Make sure this file exists and holds your global styles

function SessionPage() {
  const [sessions, setSessions] = useState([]);
  const [therapists, setTherapists] = useState([]);
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({
    therapistId: '',
    clientId: '',
    notes: '',
    date: '',
    length: '',
  });
  const [editingId, setEditingId] = useState(null);

  // Automatically fetch sessions when the component mounts (Read Operation)
  useEffect(() => {
    fetch('http://localhost:5000/api/sessions')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log('Sessions data received:', data);
        setSessions(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error('Fetch error (sessions):', err);
        setSessions([]);
      });
  }, []);

  // Fetch therapists to populate dropdown and for display
  useEffect(() => {
    fetch('http://localhost:5000/api/therapists')
      .then((res) => res.json())
      .then((data) => {
        console.log('Therapists data received:', data);
        setTherapists(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error('Fetch error (therapists):', err);
        setTherapists([]);
      });
  }, []);

  // Fetch clients to populate dropdown and for display
  useEffect(() => {
    fetch('http://localhost:5000/api/clients')
      .then((res) => res.json())
      .then((data) => {
        console.log('Clients data received:', data);
        setClients(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error('Fetch error (clients):', err);
        setClients([]);
      });
  }, []);

  // Helper functions to look up names by id
  const getTherapistName = (id) => {
    const therapist = therapists.find((t) => t.id === id);
    return therapist ? therapist.name : id;
  };

  const getClientName = (id) => {
    const client = clients.find((c) => c.id === id);
    return client ? client.name : id;
  };

  // Simple date formatting (you can adjust to your preferred format)
  const formatDate = (rawDate) => {
    if (!rawDate) return '';
    return new Date(rawDate).toLocaleDateString();
  };

  // Handle form field changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission for create/update
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      // Update existing session
      fetch(`http://localhost:5000/api/sessions/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
        .then(() => {
          setSessions((prev) =>
            prev.map((session) =>
              session.id === editingId ? { ...session, ...formData } : session
            )
          );
          setEditingId(null);
          setFormData({
            therapistId: '',
            clientId: '',
            notes: '',
            date: '',
            length: '',
          });
        })
        .catch((err) => console.error('Update session error:', err));
    } else {
      // Create new session
      fetch('http://localhost:5000/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
        .then((res) => res.json())
        .then((newSession) => {
          setSessions((prev) => [...prev, newSession]);
          setFormData({
            therapistId: '',
            clientId: '',
            notes: '',
            date: '',
            length: '',
          });
        })
        .catch((err) => console.error('Create session error:', err));
    }
  };

  // Edit handler
  const handleEdit = (session) => {
    setEditingId(session.id);
    setFormData(session);
  };

  // Delete handler
  const handleDelete = (id) => {
    fetch(`http://localhost:5000/api/sessions/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setSessions((prev) => prev.filter((session) => session.id !== id));
      })
      .catch((err) => console.error('Delete session error:', err));
  };

  return (
    <div className="container">
      <h2 className="page-title">Sessions</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Therapist</th>
            <th>Client</th>
            <th>Notes</th>
            <th>Date</th>
            <th>Length (mins)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((session) => (
            <tr key={session.id}>
              <td>{session.id}</td>
              <td>{getTherapistName(session.therapistId)}</td>
              <td>{getClientName(session.clientId)}</td>
              <td>{session.notes}</td>
              <td>{formatDate(session.date)}</td>
              <td>{session.length}</td>
              <td>
                <button className="action-btn edit" onClick={() => handleEdit(session)}>
                  Edit
                </button>
                <button className="action-btn delete" onClick={() => handleDelete(session.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="form-title">{editingId ? 'Edit Session' : 'Add New Session'}</h3>
      <form className="data-form" onSubmit={handleSubmit}>
        <select
          name="therapistId"
          value={formData.therapistId}
          onChange={handleChange}
          required
        >
          <option value="">Select Therapist</option>
          {therapists.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
        <select
          name="clientId"
          value={formData.clientId}
          onChange={handleChange}
          required
        >
          <option value="">Select Client</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          name="notes"
          placeholder="Notes"
          value={formData.notes}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="date"
          placeholder="Date"
          value={formData.date}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="length"
          placeholder="Length (in minutes)"
          value={formData.length}
          onChange={handleChange}
          required
        />
        <button type="submit">{editingId ? 'Update' : 'Add'}</button>
      </form>
    </div>
  );
}

export default SessionPage;
