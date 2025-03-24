// src/components/FlowFilter.js
import React from 'react';
import '../../styles/notification_accordion.css'

const FlowFilter = ({ selectedFlow, setSelectedFlow }) => {
  const flows = ['retail', 'zoom', 'driver'];
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  return (
    <div className="notification-flow-filter-container">
      {flows.map((flow) => (
        <label key={flow} className="notification-flow-filter-label">
          <input
            type="radio"
            value={flow}
            checked={selectedFlow === flow}
            onChange={(e) => setSelectedFlow(e.target.value)}
            className='radioButtonSpace'
          />
          {capitalizeFirstLetter(flow)}
        </label>
      ))}
    </div>
  );
};

export default FlowFilter;