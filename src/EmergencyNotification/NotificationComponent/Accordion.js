import React, { useState, useEffect } from 'react';
import Switch from 'react-switch';
import ConfirmationModal from './ConfirmationModal';
import FlowFilter from './FlowFilter';
import deleteIcon from '../../images/deleteIcon.png';
import downloadIcon from '../../images/downloadIcon.png';
import { Tooltip as ReactTooltip } from "react-tooltip";
import axios from 'axios'
// const debounce = (func, wait) => {
//   let timeout;
//   return function (...args) {
//     clearTimeout(timeout);
//     timeout = setTimeout(() => func.apply(this, args), wait);
//   };
// };

const Accordion = ({ title, data, filter, onUpdate, selectedFlow, setSelectedFlow }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [confirmationAction, setConfirmationAction] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const updatedBy = localStorage.getItem('username');
  //const { All_notifications, fileNames } = data.sessionInfo.parameters;
  //const debouncedFetchData = debounce(onUpdate, 300); // Debounce fetchData


  useEffect(() => {
    const fetchDataWithLoader = async () => {
      setIsLoading(true);
      await onUpdate();
      setIsLoading(false);
    };

    fetchDataWithLoader();
  }, []);

  useEffect(() => {
    if (data && data.sessionInfo && data.sessionInfo.parameters) {
      //const { sessionInfo: { parameters: { All_notifications, fileNames } } } = data;
      const { sessionInfo: { parameters: { All_notifications = [], fileNames = [] } } } = data;
      const combinedData = [...All_notifications, ...fileNames];

      setFilteredData(combinedData.filter(filter));
    }
  }, [data, filter]);

  const capitalizeFirstLetter = (string) => {

    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const handleDelete = async (id) => {
    setConfirmationMessage('Are you sure you want to delete this notification?');
    setConfirmationAction(() => async () => {
      await fetch(`${process.env.REACT_APP_BASE_URL}/delete_notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          docID: id,
          updatedBy: updatedBy
        }),
      });
      onUpdate(); // Fetch updated data
      setIsConfirmationOpen(false);
    });
    setIsConfirmationOpen(true);
  };

  const handleToggle = async (item) => {
    const itemFlow = item.flow;
    const { All_notifications, fileNames } = data.sessionInfo.parameters;

    const activeNotifications = All_notifications.filter(dataItem => dataItem.isActive && dataItem.flow === itemFlow);
    const activeFiles = fileNames.filter(dataItem => dataItem.isActive && dataItem.flow === itemFlow);

    const isNotificationActive = activeNotifications.length > 0;
    const isFileActive = activeFiles.length > 0;

    if (item.isActive) {
      if (item.message) {
        setConfirmationMessage(`Are you sure you want to disable the status with the message "${item.message}" ?`);
      } else {
        setConfirmationMessage(`Are you sure you want to disable the status with the filename "${item.filename}" ?`);
      }
    } else if (!item.isActive && (isNotificationActive || isFileActive)) {
      if (isFileActive && item.filename) {
        setConfirmationMessage(`Are you sure you want to disable the status with the file name "${activeFiles[0].filename}" and enable the status with the filename "${item.filename}" ?`);
      } else if (isNotificationActive && item.filename) {
        setConfirmationMessage(`Are you sure you want to enable the status with the filename "${item.filename}" ?`);
      } else if (isFileActive && item.message) {
        setConfirmationMessage(`Are you sure you want to enable the status with the message "${item.message}" ?`);
      } else {
        setConfirmationMessage(`Are you sure you want to disable the status with the message "${activeNotifications[0].message}" and enable the status with the message "${item.message}" ?`);
      }
    } else {
      if (item.message) {
        setConfirmationMessage(`Are you sure you want to enable the status with the message "${item.message}" ?`);
      } else {
        setConfirmationMessage(`Are you sure you want to enable the status with the filename "${item.filename}" ?`);
      }
    }

    setConfirmationAction(() => async () => {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/toggle_notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !item.isActive, docID: item.docID, updatedBy: updatedBy }),
      });

      if (response.status === 400) {
        const result = await response.json();
        const message = result.message;
        setConfirmationMessage(`${message} Do you want to disable them and enable ${item.code}?`);
        setConfirmationAction(() => async () => {
          for (const code of result.activeCodes) {
            await fetch(`${process.env.REACT_APP_BASE_URL}/toggle-status/${code}`, {
              method: 'PUT',
            });
          }
          const updatedResponse = await fetch(`${process.env.REACT_APP_BASE_URL}/${item.code}`, {
            method: 'PUT',
          });
          const updatedItem = await updatedResponse.json();
          setFilteredData(filteredData.map(d => {
            if (d.code === updatedItem.code) {
              return updatedItem;
            } else if (result.activeCodes.includes(d.code)) {
              return { ...d, isActive: false };
            }
            return d;
          }));
          setIsConfirmationOpen(false);
        });
        setIsConfirmationOpen(true);
      } else {
        const updatedItem = await response.json();
        await onUpdate();
        setFilteredData(filteredData.map(d => d.code === updatedItem.code ? updatedItem : d));
        setIsConfirmationOpen(false);
      }
    });

    await onUpdate();
    setIsConfirmationOpen(true);
  };
  const handleSort = () => {
    const sortedData = [...filteredData].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.code.localeCompare(b.code);
      } else {
        return b.code.localeCompare(a.code);
      }
    });
    setFilteredData(sortedData);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };


  const handleDownload = async (docID,filename) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/download`,{   
          method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
             body: JSON.stringify({ docID: docID }),
           });
      if (!response.ok) {
        throw new Error("Failed to download file");
      }
      // Convert response to Blob
      const blob = await response.blob();
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename; // Use the original filename
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url); // Free up memory
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };
  return (
    <div>
      <div data-tooltip-id="Emergency Notification" className={isOpen ? "accordion-header" : "accordion-open-header"} onClick={() => setIsOpen(!isOpen)}>
        <div className={isOpen ? "accordion-open-title" : "accordion-title"}>{title}</div>
      </div>
      {isOpen && (
        <div>
          {title === 'Configure Emergency Notifications' ? <FlowFilter selectedFlow={selectedFlow} setSelectedFlow={setSelectedFlow} /> : ""}
          {isLoading ? (
            <p style={{ padding: "20px", alignItems: "center", justifyContent: "center", display: "flex", fontSize: "15px", color: "black" }}>Loading...</p>
          ) : (
            filteredData.length === 0 ? (
              <p style={{ padding: "20px", alignItems: "center", justifyContent: "center", display: "flex", fontSize: "15px", color: "black" }}>No data found</p>
            ) : (
              <div className={title === 'Configure Emergency Notifications' ? 'table-container2' : 'table-container'}>
                <table className={title === 'Configure Emergency Notifications' ? "en-all-table" : "en-active-table"}>
                  <thead>
                    <tr style={{ textAlign: "center" }}>
                      <th>Flow</th>
                      <th>Updated By</th>
                      {title === 'Configure Emergency Notifications' ? <th>Uploaded On</th> : <th>Last Updated Date</th>}
                      <th>Notification Messages</th>
                      <th>Files</th>
                      <th>Status</th>
                      {title === 'Configure Emergency Notifications' && <th>Actions</th>}

                    </tr>
                  </thead>
                  <tbody>
                    {/* {JSON.stringify(All_notifications)} */}
                    {filteredData.map((item, index) => (
                      <tr key={index} className="table-row">
                        <td>{item.flow ? capitalizeFirstLetter(item.flow) : 'N/A'}</td>
                        <td>{item.updatedBy}</td>
                        {title === 'Configure Emergency Notifications' ? <td>{item.updatedDate}</td> : <td>{item.updatedDate}</td>}
                        <td>{item.message}</td>
                        <td>{item.filename}</td>
                        <td {...(item.isActive ? {} : { 'data-tooltip-id': 'toggle' })} >
                          <Switch
                            onChange={() => handleToggle(item)}
                            checked={item.isActive}
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
                        {title === 'Configure Emergency Notifications' && (
                          <td>
                            <img
                              {...(item.isActive ? {} : (item.filename ?{ 'data-tooltip-id': 'download' }:{}))}
                              src={downloadIcon}
                              style={{
                                width: "20px",
                                height: "20px",
                                marginRight: "18px",
                                cursor: item.isActive  ? 'not-allowed' : (item.filename ? 'pointer' : 'not-allowed'),
                                opacity: item.isActive ? 0.5 : (item.filename ? '1' : '0.5')
                              }}
                              onClick={!item.isActive && item.filename ?  () => handleDownload(item.docID,item.filename) :null}
                              //onClick={()=>handleDownload(item.docID,item.filename)}
                              alt="Download"
                            />
                            <img
                              {...(item.isActive  ? {} :{ 'data-tooltip-id': 'delete' })}
                              src={deleteIcon}
                              style={{
                                width: "20px",
                                height: "20px",
                                cursor: item.isActive  ? 'not-allowed' : 'pointer',
                                opacity: item.isActive ? 0.5 : 1
                              }}
                              onClick={!item.isActive  ?   () => handleDelete(item.docID) : null}
                              alt="Delete"
                            />
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}
        </div>
      )}
      <ConfirmationModal
        isOpen={isConfirmationOpen}
        onRequestClose={() => setIsConfirmationOpen(false)}
        onConfirm={confirmationAction}
        message={confirmationMessage}
      />
      <ReactTooltip
        id="Emergency Notification"
        place="top"
        content="Click to expand or collapse"
        className='toggleOnAndOff'
      /><ReactTooltip
        id="download"
        place="top"
        content="Download"
        className='toggleOnAndOff'
      /><ReactTooltip
        id="delete"
        place="top"
        content="Delete"
        className='toggleOnAndOff'
      />
      <ReactTooltip
        id="toggle"
        place="top"
        content="Toggle On and Off"
        className='toggleOnAndOff'
      />
    </div>
  );

};

export default Accordion;