// LandingPage.js
import React from "react";
import EmergencyFlowImage from "../images/EmergencyFlow.png";
import EmergencyNotificationImage from "../images/Notification.png";
import { Tooltip as ReactTooltip } from "react-tooltip";
import OnAndOffImage from "../images/OnAndOff.png";
import "../styles/LandingPage.css";
import {useNavigate} from 'react-router-dom';
const LandingPage = () => {
  const navigate=useNavigate();
  const handleEmergencyMessage=()=>{
navigate('/emergencyMessage')
  }
  const handleEmergencyNotification=()=>{
    navigate('/emergencyNotification')

  }
  const handleOnAndOff=()=>{
    navigate('/chatbotToggle')

  }
  return (
    <>
      <div className="landing-page">
        <div className="image-container">
          <div className="image-item" >
            <img
              src={EmergencyFlowImage}
              style={{cursor: "pointer"}}
              alt="Image 1"
              className="responsive-image"
              data-tooltip-id="Emergency Message"
              onClick={handleEmergencyMessage}
            />
            <p className="image-title">Emergency Message</p>
          </div>
          <div className="image-item" >
            <img
              src={EmergencyNotificationImage}
              style={{cursor:"pointer"}}
              alt="Image 2"
              className="responsive-image"
              data-tooltip-id="Emergency Notification"
              onClick={handleEmergencyNotification}
            />
            <p className="image-title">Emergency Notification</p>
          </div>
          <div className="image-item" >
            <img
              src={OnAndOffImage}
              alt="Image 3"
              style={{cursor:"pointer"}}
              className="responsive-image"
              data-tooltip-id="On And Off"
              onClick={handleOnAndOff}
            />
            <p className="image-title">Chatbot On/Off</p>
          </div>
        </div>
      </div>
      <ReactTooltip
        id="Emergency Message"
        place="top"
        content="Access the Emergency Message"
        style={{ backgroundColor: "#4d216d" }}
      />
      <ReactTooltip
        id="Emergency Notification"
        place="top"
        content="Access the Emergency Notification"
        style={{ backgroundColor: "#4d216d" }}
      />
      <ReactTooltip
        id="On And Off"
        place="top"
        content="Access the On And Off functionality"
        style={{ backgroundColor: "#4d216d" }}
      />
    </>
  );
};

export default LandingPage;
