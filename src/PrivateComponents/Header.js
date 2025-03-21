// Header.js
import React,{useState,useEffect} from 'react';
import '../styles/Header.css';
import ocadoLogo from '../images/logo_white.png'
import adminImage from '../images/adminImage.png'
import exit from '../images/exit.png'
import {useNavigate} from 'react-router-dom'
import { Tooltip as ReactTooltip } from "react-tooltip";

const Header = () => {
  const [username, setUser] = useState();
  const navigate = useNavigate();
  const [myName,setMyName]=useState("")
  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/');
  };
 const goToLandingPage=()=>{
  navigate('/landingPage')
 }
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
   
    setUser(storedUsername.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' '));
  }, []);
  return (
    <header className="header">
      <div className="left">
      <img src={ocadoLogo} alt="icon" onClick={goToLandingPage} style={{cursor:"pointer"}}/>
      </div>
      <div className="right">
      <img style={{cursor:"pointer"}}  src={adminImage} alt="admin" className="signout-icon" />
        <span style={{cursor:"pointer"}} className="username">{username}</span>
        <img style={{cursor:"pointer"}} data-tooltip-id="logout" src={exit} alt="sign out" className="signout-icon" onClick={handleSignOut} />
      </div>
      <ReactTooltip
                     id="logout"
                     place="top"
                     content="Logout"
                     className='toggleOnAndOff'
                     />
    </header>
  );
};

export default Header;