import React, { useState, useEffect, useCallback } from 'react';
import CreateModal from './CreateModal';
import Accordion from './Accordion';

// Debounce function
// const debounce = (func, wait) => {
//   let timeout;
//   return function(...args) {
//     clearTimeout(timeout);
//     timeout = setTimeout(() => func.apply(this, args), wait);
//   };
// };

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [selectedFlow, setSelectedFlow] = useState('master');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // const fetchData = useCallback(debounce(async () => {
  //   const response = await fetch(`${process.env.REACT_APP_BASE_URL}/getAllmessages`);
  //   const result = await response.json();
  //   console.log("DATA response::", JSON.stringify(result));
  //   setData(result);
  // }, 300), []);
  const fetchData = async () => {
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/getAllmessages`);
    const result = await response.json();
    console.log("DATA response::",JSON.stringify(result));
    setData(result);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className='App'>
      <div className="em-container">
        <h2 className="em-heading">Emergency Message</h2>
        <button onClick={openModal} className="em-button">Create</button>
      </div>
      <CreateModal isOpen={isModalOpen} onRequestClose={closeModal} onCreate={fetchData} />
      <Accordion
        title="Active Emergency Messages"
        data={data}
        filter={(item) => item.isActive}
        fetchData={fetchData}
      />
      <br/>
      <Accordion
        title="Configure Emergency Messages"
        data={data}
        filter={(item) => item.flow === selectedFlow}
        selectedFlow={selectedFlow}
        setSelectedFlow={setSelectedFlow}
        fetchData={fetchData}
      />
    </div>
  );
};

export default Dashboard;