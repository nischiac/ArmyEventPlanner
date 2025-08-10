import React, { useEffect, useState } from 'react';

const formatDateForInput = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

const ViewEvents = () => {
  const [events, setEvents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', date: '', location: '' });
  const [cadets, setCadets] = useState([]);
  const [showCadetsFor, setShowCadetsFor] = useState(null);

  const fetchEvents = () => {
    fetch('http://localhost:5000/api/events')
      .then(res => res.json())
      .then(data => {
      console.log("Fetched Events:", data); // 👈 Add this line
      setEvents(data);
    });
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const deleteEvent = async (id) => {
    await fetch(`http://localhost:5000/api/events/delete/${id}`, {
      method: 'DELETE',
    });
    fetchEvents();
  };

  const startEditing = (event) => {
  setEditingId(event.id);
  setEditForm({
    title: event.title,
    description: event.description,
    date: formatDateForInput(event.date),
    location: event.location
  });
};

  const saveEdit = async (id) => {
    await fetch(`http://localhost:5000/api/events/update/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
  ...editForm,
  date: editForm.date.split('T')[0], // Fixes ISO format issue
}),
    });
    setEditingId(null);
    fetchEvents();
  };

  const handleChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const fetchCadets = async (eventId) => {
    const res = await fetch(`http://localhost:5000/api/events/registrations/${eventId}`);
    const data = await res.json();
    setCadets(data);
    setShowCadetsFor(eventId);
  };

  const joinEvent = async (eventId) => {
    const cadet_name = prompt("Enter your name:");
    const cadet_email = prompt("Enter your email:");

    if (!cadet_name || !cadet_email) {
      alert("Name and email are required!");
      return;
    }

    const res = await fetch('http://localhost:5000/api/events/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cadet_name, cadet_email, event_id: eventId }),
    });

    const data = await res.json();
    alert(data.message || "Registered!");
  };

  return (
    <div>
      <h2>All Events</h2>
      {events.length === 0 ? (
        <p>No events available.</p>
      ) : (
        <ul>
          {events.map(event => (
            <li key={event.id}>
              {editingId === event.id ? (
                <div>
                  <input name="title" value={editForm.title} onChange={handleChange} />
                  <input name="description" value={editForm.description} onChange={handleChange} />
                  <input type="date" name="date" value={editForm.date} onChange={handleChange} />
                  <input name="location" value={editForm.location} onChange={handleChange} />
                  <button onClick={() => saveEdit(event.id)}>Save</button>
                  <button onClick={() => setEditingId(null)}>Cancel</button>
                </div>
              ) : (
                <div>
                  <strong>{event.title}</strong><br />
                  Date: {event.date}<br />
                  Location: {event.location}<br />
                  Description: {event.description}<br />
                  <button onClick={() => startEditing(event)}>Edit</button>
                  <button onClick={() => deleteEvent(event.id)}>Delete</button>
                  <button onClick={() => joinEvent(event.id)}>Join Event</button>
                  <button onClick={() => fetchCadets(event.id)}>View Cadets</button>

                  {showCadetsFor === event.id && (
                    <div style={{ marginTop: '10px' }}>
                      <h4>Registered Cadets:</h4>
                      {cadets.length === 0 ? (
                        <p>No cadets have joined yet.</p>
                      ) : (
                        <ul>
                          {cadets.map(cadet => (
                            <li key={cadet.id}>
                              {cadet.cadet_name} ({cadet.cadet_email})
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              )}
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ViewEvents;
