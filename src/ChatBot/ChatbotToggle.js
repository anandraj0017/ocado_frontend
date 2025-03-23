import React, { useState, useEffect } from 'react';
import Switch from 'react-switch';
import axios from 'axios';
import Modal from 'react-modal';
import FaEdit from '../images/editIcon.png';
import FaTrash from '../images/deleteIcon.png';
import { Tooltip as ReactTooltip } from "react-tooltip";

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
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/editStatus`, { message, status, queueName:flow, updatedBy });
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

  const handleSwitch = (checked, queueName, updatedBy) => {
    const confirmationMessage = checked
    ? "Are you sure you want to enable the status?"
    : "Are you sure you want to disable the status?";

    setConfirmAction(() => async () => {
      try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/editStatus`, { queueName, status: checked, updatedBy });
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
    <div style={{ padding: "30px" }}>
      
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
        <div style={{ backgroundColor: "#4d216d", color: "white", padding: "15px 20px" }}>
          <h5 style={{ textAlign: "center", margin: 0 }}>{isEditing ? 'Edit Message' : 'Create Message'}</h5>
        </div>
        <div style={{ padding: '15px 20px', flex: '1', overflowY: 'hidden' }}>
          <div style={{ position: 'relative', marginBottom: '15px' }}>
            <textarea
              type="text"
              rows="3"
              className="form-control"
              placeholder='Message'
              onChange={handleMessageChange} 
              value={message}
              style={{ width: '100%' }}
            />
          <span style={{ position: 'absolute', top: '-10px', right: '-10px', color: 'red' }}>*</span>
          <div style={{ textAlign: 'right',color: message.length === 1000 ? 'red' : 'black' }}>
             {message.length}/1000
            </div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '10px', width: "48%" }}>
              <select
                style={{ width: '100%', border: '1px solid #ccc', padding: '5px', borderRadius: "8px" }}
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
              <span style={{ position: 'absolute', top: '-8px', right: '-10px', color: 'red' }}>*</span>
              </div>
          </div>
          {error && <div style={{ color: 'red', padding: '10px 10px 10px 0px' }}>{error}</div>}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button onClick={handleCancel} className="customUI-No-Button" >
            Cancel
          </button>
          <button onClick={handleSave} className="customUI-Yes-Button" >
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
        <div style={{ backgroundColor: "#4d216d", color: "white", padding: "15px 20px" }}>
          <h4 style={{ textAlign: "center", margin: 0 }}>Confirmation</h4>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '15px 20px', height: '100vh', overflowY: 'hidden' }}>
          <p style={{ textAlign: 'center', color: 'black', marginTop: '25px', fontSize: '15px' }}>
            {statusMessage}
          </p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button onClick={() => setConfirmModalIsOpen(false)} className="customUI-No-Button" >
            No
          </button>
          <button onClick={confirmAction} className="customUI-Yes-Button" >
            Yes
          </button>
        </div>
      </Modal>
      {isLoading ? (<p style={{ marginTop:"100px",padding: "20px", alignItems: "center", justifyContent: "center", display: "flex", fontSize: "15px", color: "black" }}>Loading...</p>)

      :
        
      (<>
        <div className="em-container">
          <h2 className="em-heading">Chatbot On/Off</h2>
          <button onClick={() => setModalIsOpen(true)} className="em-button">Create</button>
        </div>
        <div style={{ border: "2px solid #f7f4f4", overflow: "hidden", borderRadius: "8px" }}>
          <table>
            <thead>
              <tr style={{ textAlign: "center" }}>
                <th style={{ width: "15%" }}>Queue Name</th>
                <th style={{ width: "15%" }}>Modified By</th>
                <th style={{ width: "40%",textAlign: 'center' }}>Message</th>
                <th style={{ width: "10%" }}>Status</th>
                <th style={{ width: "20%" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: "20px", textAlign: "center", fontSize: "15px", color: "black" }}>
                    No data found
                  </td>
                </tr>
              ) : (
                data.map((item, index) => (
                  <tr key={index} style={{ textAlign: "center" }}>
                    <td style={{ width: "15%" }}>{item.queueName}</td>
                    <td style={{ width: "15%" }}>{item.updatedBy}</td>
                    <td style={{ textAlign: "left" ,width:"40%",overflowWrap:"anywhere" }}>{item.message}</td>
                    <td style={{ width: "10%" }} {...(item.status ? {} : { 'data-tooltip-id': 'toggle' })}>
                      <Switch
                        onChange={(checked) => handleSwitch(checked, item.queueName, item.updatedBy)}
                        checked={item.status}
                        onColor="#4d216d"
                        offColor="#747272"
                        uncheckedIcon={
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              height: '100%',
                              fontSize: 12,
                              color: 'white',
                              paddingRight: 2,
                            }}
                          >
                            Off
                          </div>
                        }
                        checkedIcon={
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              height: '100%',
                              fontSize: 12,
                              color: 'white',
                              paddingLeft: 2,
                            }}
                          >
                            On
                          </div>
                        }
                        handleDiameter={18}
                        height={20}
                        width={40}
                      />
                    </td>
                    <td style={{width:"20%"}}>
                      <img
                        {...(item.status ? {} : { 'data-tooltip-id': 'edit' })}
                        src={FaEdit}
                        onClick={item.status ? null : () => handleEdit(item)}

                        style={{ cursor: item.status ? 'not-allowed' :'pointer', marginRight: '20px', width: "20px", height: "20px",opacity: item.status ? 0.5 : 1 }}
                      />
                      <img
                        {...(item.status ? {} : { 'data-tooltip-id': 'delete' })}
                        src={FaTrash}
                        onClick={item.status ? null : () =>handleDelete(item.id)}
                        style={{ cursor: item.status ? 'not-allowed' :'pointer', width: "20px", height: "20px", marginRight: "18px",opacity: item.status ? 0.5 : 1 }}
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