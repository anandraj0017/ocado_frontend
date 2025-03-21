// src/components/CreateButton.js
import React, { useState } from 'react';

const CreateButton = ({ onCreate }) => {
  const [message, setMessage] = useState('');
  const [flow, setFlow] = useState('zoom');
  const [predefined, setPredefined] = useState(false);

  const handleSubmit = async () => {
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, flow, predefined }),
    });
    const data = await response.json();
    console.log(data);
    onCreate(); // Call the onCreate function to refresh the data
  };

  return (
    <div>
      <input type="text" placeholder="Message" value={message} onChange={(e) => setMessage(e.target.value)} />
      <select value={flow} onChange={(e) => setFlow(e.target.value)}>
        <option value="zoom">Zoom</option>
        <option value="retail">Retail</option>
        <option value="driver">Driver</option>
        <option value="master">Master</option>
      </select>
      <label>
        Predefined:
        <input type="checkbox" checked={predefined} onChange={(e) => setPredefined(e.target.checked)} />
      </label>
      <button onClick={handleSubmit}>Create</button>
    </div>
  );
};

export default CreateButton;