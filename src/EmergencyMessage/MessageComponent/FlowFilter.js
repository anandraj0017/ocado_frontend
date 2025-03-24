// src/components/FlowFilter.js
import React from 'react';
import '../../styles/message_accordion.css'

const FlowFilter = ({ selectedFlow, setSelectedFlow }) => {
  const flows = ['master', 'retail', 'zoom', 'driver'];
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  return (
    <div className="message-flowfilter-container">
    {flows.map((flow) => (
      <label key={flow} className="message-flowfilter-label">
        <input
          type="radio"
          value={flow}
          checked={selectedFlow === flow}
          onChange={(e) => setSelectedFlow(e.target.value)}
          className="message-flowfilter-radioButton"
        />
        {capitalizeFirstLetter(flow)}
      </label>
    ))}
  </div>
  );
};

export default FlowFilter;