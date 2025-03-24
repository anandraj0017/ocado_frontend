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
     <h4 className="message-successModal-header">{title}</h4>
<div className="message-successModal-body">
  <p className="message-successModal-message">
    {message} {code && `with code ${code}`}
  </p>
  <button type="button" onClick={onRequestClose} className="message-successModal-button">OK</button>
</div>
    </Modal>
  );
};

export default SuccessModal;