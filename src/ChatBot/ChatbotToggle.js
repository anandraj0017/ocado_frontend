import React, { useState, useEffect } from 'react';
import Switch from 'react-switch';
import axios from 'axios';
import Modal from 'react-modal';
import FaEdit from '../images/editIcon.png';
import FaTrash from '../images/deleteIcon.png';
import { Tooltip as ReactTooltip } from "react-tooltip";
import '../styles/chatbot_toggle.css'
Modal.setAppElement('#root');

const ChatbotToggle = () => {
  const [message, setMessage] = useState('');
  const [statusMessage,setStatusMessage]=useState('');
  const [status, setStatus] = useState(false);
  const [flow, setFlow] = useState('');
  const [savedFlows, setSavedFlows] = useState([]);
  const [data, setData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [confirmModalIsOpen, setConfirmModalIsOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [error, setError] = useState('');
  const updatedBy = localStorage.getItem('username');
  const flowOptions = ['Zoom Chat', 'Retail Chat Osp'];
   const [isLoading, setIsLoading] = useState(true); // Add loading state
 
  const fetchData = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/getAllQueues`);
      console.log(response)
      setIsLoading(false);
      setData(response.data);
      
      setSavedFlows(response.data.map(item => item.queueName));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async () => {
    if (!message.trim()  || !flow) {
      setError('All fields are required.');
      return;
    }

    if (isEditing) {
      try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/editQueueMessage`, { message, status, queueName:flow, updatedBy });
        // alert(response.data.message);
        setIsEditing(false);
        fetchData(); // Refresh data
      } catch (error) {
        // alert(error.response.data.error);
      }
    } else {
      try {
        const newStatus = true;
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/createQueue`, { message, status: newStatus, queueName:flow ,updatedBy});
        // alert(response.data.message);
        fetchData(); // Refresh data
      } catch (error) {
        // alert(error.response.data.error);
      }
    }
    setMessage('');
    setStatus(false);
    setFlow('');
    setModalIsOpen(false);
    setError('');
  };

  const handleSwitch = (checked, queueName) => {
    const confirmationMessage = checked
    ? "Are you sure you want to enable the status?"
    : "Are you sure you want to disable the status?";

    setConfirmAction(() => async () => {
      try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/toggleQueueStatus`, { queueName, status: checked, updatedBy });
        // alert(response.data.data);
        fetchData(); // Refresh data
      } catch (error) {
        // alert(error.response.data.error);
      }
      setConfirmModalIsOpen(false);
    });
    setConfirmModalIsOpen(true);
    setStatusMessage(confirmationMessage)
  };

  const handleDelete = (id) => {
    const confirmationMessage = "Are you sure you want to delete this queue?";
    setConfirmAction(() => async () => {
      try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/deleteQueue`,{ docid : id});
        // alert(response.data.message);
        fetchData(); // Refresh data
      } catch (error) {
        // alert(error.response.data.error);
      }
      setConfirmModalIsOpen(false);
    });
    setConfirmModalIsOpen(true);
    setStatusMessage(confirmationMessage);
  };

  const handleEdit = (item) => {
    console.log("Hi Item",item)
    setMessage(item.message);
    setStatus(item.status);
    setFlow(item.queueName);
    setIsEditing(true);
    setModalIsOpen(true);
  };

  const handleCancel = () => {
    setMessage('');
    setStatus(false);
    setFlow('');
    setIsEditing(false);
    setModalIsOpen(false);
    setError('');
  };
  const handleMessageChange = (e) => {
    const input = e.target.value;
    if (input.length <= 1000) {
      setMessage(input);
    }
  };

  return (
    <div className='chatbot-main-div'>
      
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={handleCancel}
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
      >
        <div className='chatbot-heading-div'>
          <h5 className='chatbot-heading'>{isEditing ? 'Edit Message' : 'Create Message'}</h5>
        </div>
        <div className="chatbot-toggle-message-container">
        <div className="chatbot-toggle-textarea-wrapper">
          <textarea
            type="text"
            rows="3"
            className="form-control chatbot-toggle-custom-textarea"
            placeholder="Message"
            onChange={handleMessageChange}
            value={message}
          />
          <span className="chatbot-toggle-required-indicator">*</span>
          <div className={`chatbot-toggle-message-length ${message.length === 1000 ? 'chatbot-toggle-message-length-red' : ''}`}>
            {message.length}/1000
          </div>
        </div>
        <div className="chatbot-toggle-select-container">
          <div className="chatbot-toggle-select-wrapper">
            <select
              className="chatbot-toggle-custom-select"
              value={flow}
              onChange={(e) => setFlow(e.target.value)}
              disabled={isEditing}
            >
              <option value="">{isEditing ? flow : "Select Flow"}</option>
              {flowOptions.map((option) => (
                <option key={option} value={option} disabled={savedFlows.includes(option)}>
                  {option}
                </option>
              ))}
            </select>
            <span className="chatbot-toggle-required-indicator">*</span>
          </div>
        </div>
        {error && <div className="chatbot-toggle-error-message">{error}</div>}
      </div>
      <div className="chatbot-toggle-action-buttons">
        <button onClick={handleCancel} className="customUI-No-Button">
          Cancel
        </button>
        <button onClick={handleSave} className="customUI-Yes-Button">
          {isEditing ? "Save" : "Add"}
        </button>
      </div>
      </Modal>
  
      <Modal
        isOpen={confirmModalIsOpen}
        onRequestClose={() => setConfirmModalIsOpen(false)}
        style={{
          overlay: { zIndex: 1000 },
          content: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            height: '200px',
            border: '1px solid rgb(204, 204, 204)',
            borderRadius: '10px',
            overflow: 'hidden',
            outline: 'none',
            padding: '0px',
            width: '50%',
            maxWidth: '400px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column'
          }
        }}
      >
       <div className="chatbot-toggle-header">
        <h4>Confirmation</h4>
      </div>
      <div className="chatbot-toggle-content">
        <p>{statusMessage}</p>
      </div>
      <div className="chatbot-toggle-actions">
        <button onClick={() => setConfirmModalIsOpen(false)} className="customUI-No-Button">
          No
        </button>
        <button onClick={confirmAction} className="customUI-Yes-Button">
          Yes
        </button>
      </div>
      </Modal>
      {isLoading ? (<p className="chatbot-toggle-loading">Loading...</p>)

      :
        
      (<>
        <div className="em-container">
        <h1 className="em-heading">
  Chat routing to Advisor On/Off (Chatbot on/off)
</h1>          <button onClick={() => setModalIsOpen(true)} className="em-button">Create</button>
        </div>
        <div className="chatbot-toggle-container">
          <table className="chatbot-toggle-table">
            <thead>
              <tr>
                <th>Queue Name</th>
                <th>Modified By</th>
                <th style={{textAlign:"center"}}>Message</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan="5" className="chatbot-toggle-no-data">
                    No data found
                  </td>
                </tr>
              ) : (
                data.map((item, index) => (
                  <tr key={index}>
                    <td>{item.queueName}</td>
                    <td>{item.updatedBy}</td>
                    <td>{item.message}</td>
                    <td {...(item.status ? {} : { 'data-tooltip-id': 'toggle' })}>
                      <Switch
                        onChange={(checked) => handleSwitch(checked, item.queueName, item.updatedBy)}
                        checked={item.status}
                        onColor="#4d216d"
                        offColor="#747272"
                        uncheckedIcon={
                          <div className="chatbot-toggle-switch-icon" style={{ paddingRight: 2 }}>
                            Off
                          </div>
                        }
                        checkedIcon={
                          <div className="chatbot-toggle-switch-icon" style={{ paddingLeft: 2 }}>
                            On
                          </div>
                        }
                        handleDiameter={18}
                        height={20}
                        width={40}
                      />
                    </td>
                    <td>
                      <img
                        {...(item.status ? {} : { 'data-tooltip-id': 'edit' })}
                        src={FaEdit}
                        onClick={item.status ? null : () => handleEdit(item)}
                        className={`chatbot-toggle-edit-icon ${item.status ? 'chatbot-toggle-disabled' : ''}`}
                      />
                      <img
                        {...(item.status ? {} : { 'data-tooltip-id': 'delete' })}
                        src={FaTrash}
                        onClick={item.status ? null : () => handleDelete(item.id)}
                        className={`chatbot-toggle-delete-icon ${item.status ? 'chatbot-toggle-disabled' : ''}`}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </>)}
      <ReactTooltip
        id="edit"
        place="top"
        content="Edit"
        className='toggleOnAndOff'
      />
      <ReactTooltip
        id="toggle"
        place="top"
        content="Toggle On and Off"
        className='toggleOnAndOff'
      />
      <ReactTooltip
        id="delete"
        place="top"
        content="Delete"
        className='toggleOnAndOff'
      />
    </div>
  );
}

export default ChatbotToggle;