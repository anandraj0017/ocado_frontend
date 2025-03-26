import React, { useState, useEffect } from 'react';
import Switch from 'react-switch';
import ConfirmationModal from './ConfirmationModal';
import EditModal from './EditModal';
import FlowFilter from './FlowFilter'; // Import FlowFilter
import deleteIcon from '../../images/deleteIcon.png';
import editIcon from '../../images/editIcon.png';
import { Tooltip as ReactTooltip } from "react-tooltip";
import '../../styles/message_accordion.css'
// const debounce = (func, wait) => {
//   let timeout;
//   return function(...args) {
//     clearTimeout(timeout);
//     timeout = setTimeout(() => func.apply(this, args), wait);
//   };
// };
const Accordion = ({ title, data, filter, selectedFlow, setSelectedFlow, fetchData }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [confirmationAction, setConfirmationAction] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  // const debouncedFetchData = debounce(fetchData, 300); // Debounce fetchData
  useEffect(() => {
    const fetchDataWithLoader = async () => {
      setIsLoading(true);
      await fetchData();
      setIsLoading(false);
    };

    fetchDataWithLoader();
  }, []);

  useEffect(() => {
    setFilteredData(data.filter(filter));
  }, [data, filter]);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const updatedBy = localStorage.getItem('username');

  const handleDelete = async (id, message, code) => {
    setConfirmationMessage(`Are you sure you want to delete the data with the message "${message}" and code ${code}?`);
    setConfirmationAction(() => async () => {
      await fetch(`${process.env.REACT_APP_BASE_URL}/deletemessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "docid": id,
        }),
      });
      setFilteredData(filteredData.filter(item => item.code !== code));
      await fetchData();
      setIsConfirmationOpen(false);
    });
    setIsConfirmationOpen(true);
  };

  const handleSave = (updatedItem) => {
    setFilteredData(filteredData.map(item => item.code === updatedItem.code ? updatedItem : item));
    setEditingItem(null);
  };

  const handleToggle = async (item) => {
    const itemFlow=item.flow
    
    // const isAnyFlowActive1 = data.some(dataItem => dataItem.isActive && dataItem.flow === itemFlow);
    console.log("Message",JSON.stringify(data))
    const previousActive=data.filter(dataItem => dataItem.isActive && dataItem.flow === itemFlow);
    const status=previousActive.length >0

    console.log(status)
    console.log(previousActive)
    console.log(itemFlow)

    if (item.isActive) {
      setConfirmationMessage(`Are you sure you want to disable the status with the message "${item.message}" and Code ${item.code}?`);
    } else if(!item.isActive && status){
      setConfirmationMessage(`Are you sure you want to disable the status with the message "${previousActive[0].message}" and Code ${previousActive[0].code} and enable the status with the message "${item.message}" and code "${item.code}"?`);
    }
    else {
      setConfirmationMessage(`Are you sure you want to enable the status with the message "${item.message}" and code ${item.code}?`);
    }

    setConfirmationAction(() => async () => {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/toggle-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !item.isActive, docid: item.id, updatedBy: updatedBy }),
      });

      if (response.status === 400) {
        const result = await response.json();
        const message = result.message;
        setConfirmationMessage(`${message} Do you want to disable them and enable ${item.code}?`);
        setConfirmationAction(() => async () => {
          // Disable all active items in the same flow
          for (const code of result.activeCodes) {
            await fetch(`${process.env.REACT_APP_BASE_URL}/toggle-status/${code}`, {
              method: 'PUT',
            });
          }
          // Enable the selected item
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
        await fetchData();
        setFilteredData(filteredData.map(d => d.code === updatedItem.code ? updatedItem : d));
        setIsConfirmationOpen(false);
      }
    });

    // Ensure fetchData is called after setting the confirmation action
    await fetchData();
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

  const openEditModal = (item) => {
    setEditingItem(item);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditingItem(null);
    setIsEditModalOpen(false);
  };

  return (
    <div>
      <div data-tooltip-id="Emergency Message" className={isOpen ? "accordion-header" : "accordion-open-header"} onClick={() => setIsOpen(!isOpen)}>
        <div className={isOpen ? "accordion-open-title" : "accordion-title"}>{title}</div>
      </div>
      {isOpen && (
        <div>
          {title === 'Configure Emergency Messages' ? <FlowFilter selectedFlow={selectedFlow} setSelectedFlow={setSelectedFlow} /> : ""}
          {isLoading ? (
            <p className="em-accordion-loading">Loading...</p>
          ) : (
            filteredData.length === 0 ? (
              <p className="em-accordion-no-data">No data found</p>
            ) : (
              <div className={title === 'Configure Emergency Messages' ? 'table-container2' : 'table-container'}>
                <table className={title === 'Configure Emergency Messages' ? "em-all-table" : "em-active-table"}>
                  <thead>
                    <tr className="em-accordion-tr-data" >
                      <th onClick={handleSort}>
                        Code {sortOrder === 'asc' ? '↓' : '↑'}
                      </th>
                      {title === 'Active Emergency Messages' && <th>Flow</th>}
                      <th>Activated On</th>
                      <th>Message</th>
                      <th>Status</th>
                      {title === 'Configure Emergency Messages' && <th>Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((item, index) => (
                      <tr key={index} className="table-row">
                        <td>{item.code}</td>
                        {title === 'Active Emergency Messages' && <td>{capitalizeFirstLetter(item.flow)}</td>}
                        <td>{item.createdDate}</td>
                        <td className="em-message-centered">{item.message}</td>
                        <td {...(item.isActive ? {} : { 'data-tooltip-id': 'toggle' })}>
                          <Switch
                            onChange={() => handleToggle(item)}
                            checked={item.isActive}
                            onColor="#4d216d"
                            offColor="#747272"
                            uncheckedIcon={
                              <div className="em-accordion-switch-icon" >
                                Off
                              </div>
                            }
                            checkedIcon={
                              <div className="em-accordion-switch-icon">
                                On
                              </div>
                            }
                            handleDiameter={18}
                            height={20}
                            width={40}
                          />
                        </td>
                        {title === 'Configure Emergency Messages' && (
                          <td className="actions-column">
                            <img
                              src={editIcon}
                              {...(item.isActive ? {} : { 'data-tooltip-id': 'edit' })}
                              className={`em-accordion-edit-icon ${item.isActive ? 'em-accordion-disabled' : ''}`}
                              onClick={item.isActive ? null : () => openEditModal(item)}
                            />
                            <img
                              src={deleteIcon}
                              {...(item.isActive ? {} : { 'data-tooltip-id': 'delete' })}
                              className={`em-accordion-delete-icon ${item.isActive ? 'em-accordion-disabled' : ''}`}
                              onClick={item.isActive ? null : () => handleDelete(item.id, item.message, item.code)}
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
      <EditModal
        isOpen={isEditModalOpen}
        onRequestClose={closeEditModal}
        item={editingItem}
        onSave={handleSave}
        fetchData={fetchData}
      />
      <ReactTooltip
        id="Emergency Message"
        place="top"
        content="Click to expand or collapse"
        className='toggleOnAndOff'
      />
      <ReactTooltip
        id="edit"
        place="top"
        content="Edit"
        className='toggleOnAndOff'
      />
      <ReactTooltip
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