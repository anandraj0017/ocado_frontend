// src/components/EditModal.js
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const EditModal = ({ isOpen, onRequestClose, item, onSave ,fetchData }) => {
  const [message, setMessage] = useState('');
  const [id, setId] = useState('');
  const updatedBy = localStorage.getItem('username');
  const [error, setError] = useState('');


  useEffect(() => {
    if (item) {
      setId(item.id)
      setMessage(item.message);
    }
  }, [item]);
  const handleClose = () => {
    setError(''); // Reset the error message
    onRequestClose();
  };
  const handleSave = async () => {
    if (!message.trim() ) {
      setError('Message is required.');
     
      return;
    }
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/editmessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "docid": id,
        "message": message,
        "updatedBy":updatedBy
    }),
    });
    const updatedItem = await response.json();
    onSave(updatedItem);
    await fetchData();
    setError('')
    onRequestClose(); // Close the modal
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={handleClose}
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
        flexDirection: 'column'
      }
    }}
     contentLabel="Edit Data">
      <h4 style={{ backgroundColor: '#4d216d', color: '#fff', padding: '10px', textAlign: 'center', width: '100%' }}>Edit Form</h4>
      <form >
        {/* <div>{code}</div> */}
        <label style={{marginLeft:"20px"}}>Message:</label>
        <div style={{ marginBottom: '10px', padding: '10px 20px' }}>
        <textarea style={{ width: '100%', padding: '10px', border: '1px solid #ccc',borderRadius:"8px" }}  value={message} onChange={(e) => setMessage(e.target.value)} />
        </div>
        {error && <div style={{ color: 'red', padding: '10px 20px' }}>{error}</div>}
        <div className='customUI-button-body'>
        <button className="customUI-No-Button" type="button" onClick={handleClose}>Cancel</button>
        <button className="customUI-Yes-Button" type="button" onClick={handleSave}>Save</button>
        </div>
      </form>
    </Modal>

  );
};

export default EditModal;