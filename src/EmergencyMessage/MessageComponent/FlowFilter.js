// src/components/FlowFilter.js
import React from 'react';

const FlowFilter = ({ selectedFlow, setSelectedFlow }) => {
  const flows = ['master', 'retail', 'zoom', 'driver'];
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  return (
    <div style={{marginTop:"-35px",marginLeft:"10px"}}>
      {flows.map((flow) => (
        <label key={flow} style={{color:"white",marginRight:"5px",marginTop:"5px"}}>
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