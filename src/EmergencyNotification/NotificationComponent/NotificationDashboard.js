// src/components/NotificationDashboard.js
import React, { useState, useEffect,useCallback } from 'react';
import CreateModal from './CreateModal';
import UploadModal from './UploadModal';
import Accordion from './Accordion';
// import FlowFilter from './FlowFilter';

// const debounce = (func, wait) => {
//   let timeout;
//   return function(...args) {
//     clearTimeout(timeout);
//     timeout = setTimeout(() => func.apply(this, args), wait);
//   };
// };
const NotificationDashboard = () => {
  const [notifications, setNotifications] = useState([]);
  const [selectedFlow, setSelectedFlow] = useState('retail');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const fetchNotifications = async () => {
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/get_notification`);
   
    const result = await response.json();
    setNotifications(result);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const openCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const openUploadModal = () => {
    setIsUploadModalOpen(true);
  };

  const closeUploadModal = () => {
    setIsUploadModalOpen(false);
  };

  return (
    <div className='App'>
      <div className="em-container">
      <h2 className="em-heading">Emergency Notification</h2>
      <div className="header-buttons" style={{ display: "flex", gap: "10px" }}>
      <button onClick={openCreateModal} className="em-button">Create New Global Notification</button>
      <button onClick={openUploadModal} className="em-button">Upload Notification</button>
      </div>
      </div>
      <CreateModal isOpen={isCreateModalOpen} onRequestClose={closeCreateModal} onCreate={fetchNotifications} />
      <UploadModal isOpen={isUploadModalOpen} onRequestClose={closeUploadModal} onUpload={fetchNotifications} />
      <Accordion
        title="Active Emergency Notifications"
        data={notifications}
        filter={(item) => item.isActive}
        onUpdate={fetchNotifications} // Pass the fetch function to Accordion
      />
      <br/>
      {/* <FlowFilter selectedFlow={selectedFlow} setSelectedFlow={setSelectedFlow} /> */}
      <Accordion
        title="Configure Emergency Notifications"
        data={notifications}
        filter={(item) => item.flow === selectedFlow}
        selectedFlow={selectedFlow}
        setSelectedFlow={setSelectedFlow}
        onUpdate={fetchNotifications} // Pass the fetch function to Accordion
      />
    </div>
  );
};

export default NotificationDashboard;