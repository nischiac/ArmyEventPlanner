import React, { useEffect, useState } from 'react';
import ViewEvents from './ViewEvents';
import AddEvent from './AddEvent';
import '../styles/Dashboard.css';

function Dashboard() {
  const [role, setRole] = useState('');

  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    if (storedRole) {
      setRole(storedRole);
    } else {
      window.location.href = '/login';
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="dashboard-container">
      <div
        className="overlay"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL + '/images/army-banner.jpg'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backgroundBlendMode: 'darken',
        }}
      >
        <h2 className="dashboard-header">Welcome to Dashboard</h2>
        <p className="role-info">Role: {role}</p>

        {role === 'Army Officer' && (
  <div className="add-event-section">
    <AddEvent />
  </div>
)}

<div className="view-events-section">
  <ViewEvents />
</div>


        <button onClick={handleLogout} style={{ marginTop: '20px' }}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
