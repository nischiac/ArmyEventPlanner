// AddEvent.js
import React, { useState } from 'react';

const AddEvent = () => {
  const [event, setEvent] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    created_by: '' // temporary - later will be from login
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setEvent({ ...event, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('http://localhost:5000/api/events/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });

    const data = await res.json();
    if (res.status === 200) {
      setMessage('Event created successfully!');
      setEvent({ title: '', description: '', date: '', location: '', created_by: '' });
    } else {
      setMessage('Error: ' + data.message);
    }
  };

  return (
    <div>
      <h2>Create New Event</h2>
      <form onSubmit={handleSubmit}>
        <input name="title" value={event.title} onChange={handleChange} placeholder="Title" required /><br />
        <textarea name="description" value={event.description} onChange={handleChange} placeholder="Description" /><br />
        <input type="date" name="date" value={event.date} onChange={handleChange} required /><br />
        <input name="location" value={event.location} onChange={handleChange} placeholder="Location" required /><br />
        <input name="created_by" value={event.created_by} onChange={handleChange} placeholder="Created By (User ID)" required /><br />
        <button type="submit">Create Event</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddEvent;
