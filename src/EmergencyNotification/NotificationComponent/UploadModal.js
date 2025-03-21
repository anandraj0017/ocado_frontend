import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import SuccessModal from './SuccessModal'
Modal.setAppElement('#root');

const UploadModal = ({ isOpen, onRequestClose, onUpload }) => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [flow, setFlow] = useState('');
  const [error, setError] = useState('');
  const updatedBy = localStorage.getItem('username');
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  
  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
  };
  const handleUpload = async () => {
    if (!file || !flow) {
      setError('All fields are required.');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('flow', flow);
      formData.append('updatedBy', updatedBy);

      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/uploaddata`,formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (response.status == 200) {
        onUpload();
        onRequestClose();
        resetForm();
        setIsSuccessModalOpen(true);
      } else {

        const errorMessage = await response.text();
        console.error('Upload failed:', errorMessage);
        setError('Upload failed: ' + errorMessage);
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setError('Fetch error: ' + error.message);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(''); // Clear the error when a file is selected
  };

  const handleFlow = (e) => {
    setFlow(e.target.value);
    setError('');
  };

  const resetForm = () => {
    setFile('');
    setFlow('');
    setError('');
  };

  return (<>
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
      contentLabel="Upload Notification"
    >
      <h4
        style={{
          backgroundColor: '#4d216d',
          color: '#fff',
          padding: '10px',
          textAlign: 'center',
          width: '100%',
        }}
      >
        Upload Notification
      </h4>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', padding: '10px 20px', position: 'relative' }}>
        <span style={{ position: 'absolute', top: '0px', right: '10px', color: 'red' }}>*</span>
        <input
          type="text"
          readOnly
          value={file ? file.name : 'Click here to upload a file'}
          onClick={() => document.getElementById('file-upload').click()}
          style={{
            flex: 1,
            padding: '10px',
            border: '1px solid #ccc',
            cursor: 'pointer',
            borderRadius: '8px',
          }}
        />
        <input
          id="file-upload"
          type="file"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', padding: '10px 20px', position: 'relative' }}>
        <div style={{ position: 'relative', width: '48%' }}>
          <select
            value={flow}
            onChange={handleFlow}
            style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '8px' }}
          >
            <option value="">Select Flow</option>
            <option value="retail">Retail</option>
            <option value="zoom">Zoom</option>
            <option value="driver">Driver</option>
          </select>
          <span style={{ position: 'absolute', top: '-8px', right: '-10px', color: 'red' }}>*</span>
        </div>
      </div>
      {error && <div style={{ color: 'red', padding: '10px 20px' }}>{error}</div>}
      <div className="customUI-button-body">
        <button type="button" className="customUI-No-Button" onClick={() => { resetForm(); onRequestClose(); }}>
          Cancel
        </button>
        <button type="button" className="customUI-Yes-Button" onClick={handleUpload}>
          Upload
        </button>
      </div>
    </Modal>
    <SuccessModal
        isOpen={isSuccessModalOpen}
        onRequestClose={closeSuccessModal}
        title="Success"
        message="File Uploaded successfully!"
        >
        </SuccessModal>
    </>
  );
};

export default UploadModal;