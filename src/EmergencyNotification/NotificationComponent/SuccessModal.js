import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const SuccessModal = ({ isOpen, onRequestClose, title, message, code }) => {
  return (
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
      contentLabel={title}>
      <h4 style={{ backgroundColor: '#4d216d', color: '#fff', padding: '10px', textAlign: 'center', width: '100%' }}>{title}</h4>
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p style={{fontSize:"15px",color:"black"}}>{message} {code && `with code ${code}`}</p>
        <button type="button" onClick={onRequestClose} style={{backgroundColor:"#4d216d",color:"white"}} >OK</button>
      </div>
    </Modal>
  );
};

export default SuccessModal;