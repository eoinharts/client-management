import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import TherapistPage from './pages/TherapistPage';
import ClientPage from './pages/ClientPage';
import SessionPage from './pages/SessionPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="container">
        <nav className="nav-links">
          <Link to="/">Home</Link> |{' '}
          <Link to="/therapists">Therapists</Link> |{' '}
          <Link to="/clients">Clients</Link> |{' '}
          <Link to="/sessions">Sessions</Link>
        </nav>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/therapists" element={<TherapistPage />} />
          <Route path="/clients" element={<ClientPage />} />
          <Route path="/sessions" element={<SessionPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
