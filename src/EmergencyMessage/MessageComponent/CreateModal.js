import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import SuccessModal from './SuccessModal';
import '../../styles/message_accordion.css'

Modal.setAppElement('#root');

const CreateModal = ({ isOpen, onRequestClose, onCreate }) => {
  const [message, setMessage] = useState('');
  const [flow, setFlow] = useState('');
  const [isPrerecorded, setisPrerecorded] = useState(false);
  const [error, setError] = useState('');
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [createdCode,setCreatedCode]=useState('');
  const [createdMessage,setCreatedMessage]=useState('');

  const updatedBy = localStorage.getItem('username');

  useEffect(() => {
    if (!isOpen) {
      resetForm(); // Reset the form fields when the modal is closed
    }
  }, [isOpen]);

  const resetForm = () => {
    setMessage('');
    setFlow('');
    setisPrerecorded(false);
    setError('');
  };

  const handleSubmit = async () => {
    if (!message.trim() || !flow) {
      setError('All fields are required.');
      return;
    }

    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/createmessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, flow, "updatedBy": updatedBy }),
    });
    const data = await response.json();
    console.log("Created Data......", data);
    onCreate(); // Call the onCreate function to refresh the data
    resetForm();
    onRequestClose(); // Close the create modal
    setIsSuccessModalOpen(true); // Open the success modal
    setCreatedCode(data.emergency.data.code)
    setCreatedMessage(data.emergency.data.message)
  };

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
  };
  const handleMessageChange = (e) => {
    const input = e.target.value;
    if (input.length <= 1000) {
      setMessage(input);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen}
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
            padding: '0px',
            overflow: 'hidden',
            outline: 'none',
            width: '50%',
            maxWidth: '500px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }
        }}
        contentLabel="Create Data">
        <h4 className="message-createModal-header">Create Emergency Message</h4>
<form className="message-createModal-form">
  <div className="message-createModal-textarea-container">
    <textarea
      placeholder="Message"
      value={message}
      onChange={handleMessageChange}
      rows="2"
      className="message-createModal-textarea"
    />
    <span className="message-createModal-required">*</span>
    <div className="message-createModal-charCount">
      {message.length}/1000
    </div>
  </div>
  <div className="message-createModal-select-container">
    <div className="message-createModal-select-wrapper">
      <select
        value={flow}
        onChange={(e) => setFlow(e.target.value)}
        className="message-createModal-select"
      >
        <option value="">Select Flow</option>
        <option value="master">Master</option>
        <option value="retail">Retail</option>
        <option value="zoom">Zoom</option>
        <option value="driver">Driver</option>
      </select>
      <span className="message-createModal-required-option">*</span>
    </div>
  </div>
  {error && <div className="message-createModal-error">{error}</div>}
  <div className="customUI-button-body">
    <button
      type="button"
      onClick={() => {
        resetForm();
        onRequestClose();
      }}
      className="customUI-No-Button"
    >
      Cancel
    </button>
    <button
      type="button"
      className="customUI-Yes-Button"
      onClick={handleSubmit}
    >
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
        code={createdCode}>
        </SuccessModal>
    </>
  );
};

export default CreateModal;