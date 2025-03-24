// src/components/ConfirmationModal.js
import React from 'react';
import Modal from 'react-modal';
import '../../styles/message_accordion.css'

Modal.setAppElement('#root');

const ConfirmationModal = ({ isOpen, onRequestClose, onConfirm, message }) => {
  return (
    <Modal isOpen={isOpen} 
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
    onRequestClose={onRequestClose} 
    contentLabel="Confirmation">
    <h2 className="message-confirmation-header">Confirmation</h2>
    <div className="message-confirmation-body">{message}</div>
      <div className='customUI-button-body'>
      <button className="customUI-No-Button" onClick={onRequestClose}>Cancel</button>
      <button className="customUI-Yes-Button" onClick={onConfirm}>OK</button>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;