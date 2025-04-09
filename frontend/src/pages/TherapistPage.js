import React, { useState, useEffect } from 'react';
import '../App.css';

function TherapistPage() {
  const [therapists, setTherapists] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    name: '',
    email: '',
    location: '',
    yearsOfPractice: '',
    availability: '',
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/therapists')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log('Therapists data received:', data);
        setTherapists(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error('Fetch error:', err);
        setTherapists([]);
      });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      fetch(`http://localhost:5000/api/therapists/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
        .then(() => {
          setTherapists(therapists.map(th => th.id === editingId ? { ...th, ...formData } : th));
          setEditingId(null);
          setFormData({ title: '', name: '', email: '', location: '', yearsOfPractice: '', availability: '' });
        })
        .catch(err => console.error('Update error:', err));
    } else {
      fetch('http://localhost:5000/api/therapists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
        .then(res => res.json())
        .then(newTherapist => {
          setTherapists([...therapists, newTherapist]);
          setFormData({ title: '', name: '', email: '', location: '', yearsOfPractice: '', availability: '' });
        })
        .catch(err => console.error('Create error:', err));
    }
  };

  const handleEdit = (therapist) => {
    setEditingId(therapist.id);
    setFormData(therapist);
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:5000/api/therapists/${id}`, {
      method: 'DELETE',
    })
      .then(() => setTherapists(therapists.filter(th => th.id !== id)))
      .catch(err => console.error('Delete error:', err));
  };

  return (
    <div className="container">
      <h2 className="page-title">Therapists</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Name</th>
            <th>Email</th>
            <th>Location</th>
            <th>Years of Practice</th>
            <th>Availability</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {therapists.map(therapist => (
            <tr key={therapist.id}>
              <td>{therapist.id}</td>
              <td>{therapist.title}</td>
              <td>{therapist.name}</td>
              <td>{therapist.email}</td>
              <td>{therapist.location}</td>
              <td>{therapist.yearsOfPractice}</td>
              <td>{therapist.availability}</td>
              <td>
                <button className="action-btn edit" onClick={() => handleEdit(therapist)}>Edit</button>
                <button className="action-btn delete" onClick={() => handleDelete(therapist.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="form-title">{editingId ? 'Edit Therapist' : 'Add New Therapist'}</h3>
      <form className="data-form" onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />
        <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input name="location" placeholder="Location" value={formData.location} onChange={handleChange} required />
        <input
          name="yearsOfPractice"
          placeholder="Years of Practice"
          value={formData.yearsOfPractice}
          onChange={handleChange}
          required
        />
        <select name="availability" value={formData.availability} onChange={handleChange} required>
          <option value="">Select Availability</option>
          <option value="TAKING CLIENTS">TAKING CLIENTS</option>
          <option value="NOT TAKING CLIENTS">NOT TAKING CLIENTS</option>
        </select>
        <button type="submit">{editingId ? 'Update' : 'Add'}</button>
      </form>
    </div>
  );
}

export default TherapistPage;
