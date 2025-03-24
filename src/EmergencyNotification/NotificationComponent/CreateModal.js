import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import SuccessModal from './SuccessModal';
import '../../styles/notification_accordion.css'

Modal.setAppElement('#root');

const CreateModal = ({ isOpen, onRequestClose, onCreate }) => {
  const [message, setMessage] = useState('');
  const [flow, setFlow] = useState('');
  const [predefined, setPredefined] = useState(false);
  const [error, setError] = useState('');
  const updatedBy = localStorage.getItem('username');
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [createdMessage, setCreatedMessage] = useState('');

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
  };

  useEffect(() => {
    if (!isOpen) {
      resetForm(); // Reset the form fields when the modal is closed
    }
  }, [isOpen]);

  const resetForm = () => {
    setMessage('');
    setFlow('');
    setPredefined(false);
    setError('');
  };

  const handleSubmit = async () => {
    if (!message.trim() || !flow) {
      setError('All fields are required.');
      return;
    }

    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/create_notification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, flow, isGlobal: true, updatedBy }),
    });
    const data = await response.json();
    console.log(data);
    onCreate(); // Call the onCreate function to refresh the data
    resetForm();
    onRequestClose(); // Close the modal
    setIsSuccessModalOpen(true); // Open the success modal
    setCreatedMessage(data.emergency.data.message);
  };

  const handleMessageChange = (e) => {
    const input = e.target.value;
    if (input.length <= 1000) {
      setMessage(input);
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        style={{
          overlay: { zIndex: 1000 },
          content: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            height: 'fit-content',
            border: '1px solid rgb(204, 204, 204)',
            borderRadius: '10px',
            overflow: 'hidden',
            outline: 'none',
            padding: '0px',
            width: '50%',
            maxWidth: '500px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
          },
        }}
        contentLabel="Create Notification"
      >
       <h4 className="notification-create-modal-header">
  Create New Global Notification
</h4>
<form className="notification-create-modal-form">
  <div className="notification-create-modal-textarea-container">
    <textarea
      placeholder="Notification"
      value={message}
      onChange={handleMessageChange}
      rows="2"
      className="notification-create-modal-textarea"
    />
    <span className="notification-create-modal-required">*</span>
    <div className="notification-create-modal-charCount">
      {message.length}/1000
    </div>
  </div>
  <div className="notification-create-modal-select-container">
    <div className="notification-create-modal-select-wrapper">
      <select
        value={flow}
        onChange={(e) => setFlow(e.target.value)}
        className="notification-create-modal-select"
      >
        <option value="">Select Flow</option>
        <option value="retail">Retail</option>
        <option value="zoom">Zoom</option>
        <option value="driver">Driver</option>
      </select>
      <span className="notification-create-modal-required-option">*</span>
    </div>
  </div>
  {error && <div className="notification-create-modal-error">{error}</div>}
  <div className="customUI-button-body">
    <button type="button" className="customUI-No-Button" onClick={() => { resetForm(); onRequestClose(); }}>
      Cancel
    </button>
    <button type="button" className="customUI-Yes-Button" onClick={handleSubmit}>
      OK
    </button>
  </div>
</form>
      </Modal>
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onRequestClose={closeSuccessModal}
        title="Success"
        message="Message created successfully!"
        code={createdMessage}
      />
    </>
  );
};

export default CreateModal;