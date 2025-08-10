import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import AddEvent from './pages/AddEvent';
import ViewEvents from './pages/ViewEvents';
import Dashboard from './pages/Dashboard';

function App() {
  const userRole = localStorage.getItem('userRole');

  return (
    <Router>
      <div>
        <h1>Army Event and Camp Planner</h1>

        <nav>
          {!userRole ? (
            <>
              <Link to="/register"><button>Register</button></Link>
              <Link to="/login"><button>Login</button></Link>
            </>
          ) : (
            <>
              <Link to="/dashboard"><button>Dashboard</button></Link>
              {/* Show these only if Army Officer */}
              {userRole === 'Army Officer' && (
                <Link to="/add-event"><button>Add Event</button></Link>
              )}
              <Link to="/view-events"><button>View Events</button></Link>
              <button onClick={() => {
                localStorage.clear();
                window.location.href = '/login';
              }} style={{ marginLeft: '10px' }}>Logout</button>
            </>
          )}
        </nav>

        <div style={{ marginTop: '20px' }}>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/add-event" element={<AddEvent />} />
            <Route path="/view-events" element={<ViewEvents />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/" element={userRole ? <Dashboard /> : <Login />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
