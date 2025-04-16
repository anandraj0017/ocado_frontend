import React, { useState, useEffect } from 'react';
import '../styles/NewLogin.css';
import logo from '../images/ocado_logo1.svg';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin, googleLogout } from '@react-oauth/google';
import {jwtDecode} from 'jwt-decode';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import eyeOpen from '../images/eyeopen.png';
import eyeClose from '../images/eyeclose.png';


const clientId = `${process.env.REACT_APP_CLIENT_ID}`;

const LoginPage = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const storedPassword = localStorage.getItem('password');
    if (storedUserId && storedPassword) {
      setUserId(storedUserId);
      setPassword(storedPassword);
      console.log(rememberMe)
      setRememberMe(true);
    }
  }, []);

  const handleLoginSuccess = (response) => {
    const decoded = jwtDecode(response.credential);
    localStorage.setItem('username', decoded.name);
    console.log('Decoded Token:', JSON.stringify(decoded));
    console.log('Login Success:', JSON.stringify(response));
    navigate('/landingPage');
  };

  const handleLoginFailure = (error) => {
    console.log('Login Failed:', error);
  };

  const handleLogout = () => {
    googleLogout();
    console.log('Logged out');
  };
  const redirectToSAMLLogin = () => {
    window.location.href="https://apifirestore-1-dot-orl-tst-ccai-prj01.uc.r.appspot.com/auth/saml"
    // window.location.href = "https://adminportal-dot-orl-tst-ccai-prj01.uc.r.appspot.com/auth/saml";
    //window.location.href = "http://localhost:5000/auth/saml";
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!userId || !password) {
      setError('Username and password cannot be empty.');
      return;
    }

    const data = {
      emailId: userId,
      password: password,
    };

    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/user_auth`, data);

      if (response.status === 200 && response.data.emergency.authenticated === true) {
        const name = response.data.emergency.userName;
        localStorage.setItem('username', name);
        if (rememberMe) {
          localStorage.setItem('userId', userId);
          localStorage.setItem('password', password);
        } else {
          localStorage.removeItem('userId');
          localStorage.removeItem('password');
        }
        navigate('/landingPage');
      } else {
        setError('Incorrect credentials. Please enter the correct username and password.');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert('Unauthenticated');
      } else {
        console.error('Error authenticating user:', error);
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        handleLogin(event);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleLogin]);

  return (
    <div className="login-page">
      <div className="login-container">
        <img className="login-ocado-image" src={logo} alt="Logo" />
        <form onSubmit={handleLogin}>
          <div className='input-group'>
            <label htmlFor="username" className='login-input-lable'>Username</label>
          </div>
          <input
            type="text"
            id="username"
            name="log"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="input-field"
            required
          />
          <div className="input-group">
            <label htmlFor="password" className='login-input-lable'>Password</label>
          </div>
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="pwd"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              required
            />
            <span className="password-toggle-icon" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <img style={{width:"25px",height:"20px",border:"1px solid #0a4b78"}}src={eyeClose}></img> : <img style={{width:"25px",height:"20px"}} src={eyeOpen}></img> }
            </span>
          </div>
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          <div style={{marginTop:"10px"}}>
            <GoogleOAuthProvider clientId={clientId}>
              <GoogleLogin
                onSuccess={handleLoginSuccess}
                onFailure={handleLoginFailure}
                className="google-login-button"
              />
            </GoogleOAuthProvider>
          </div>
          {/* <div style={{marginTop:"10px"}}>
          <a 
      href="#" 
      onClick={redirectToSAMLLogin}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white', // Microsoft dark gray
        color: '#2F2F2F',
        fontSize: '16px',
        fontWeight: 'bold',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        textDecoration: 'none',
      }}
    >
      <img 
        src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" 
        alt="Microsoft Logo" 
        style={{
          marginRight: '10px',
          width: '20px',
          height: '20px',
        }} 
      />
      Sign in with Microsoft
    </a>
          </div> */}
          {/* <div className="button-row">
             <div className="remember-me">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="rememberMe">Remember Me</label>
            </div> 
            <button type="submit" className="login-button"><b>Log In</b></button>
          </div> */}
          {/* <div className="button-row">
  <div className="remember-me">
    <label htmlFor="rememberMe" className="custom-checkbox">
      <input
        type="checkbox"
        id="rememberMe"
        checked={rememberMe}
        onChange={(e) => setRememberMe(e.target.checked)}
      />
      <span className="checkmark"></span>
      Remember Me
    </label>
  </div> 
  <button type="submit" className="login-button"><b>Log In</b></button>
</div> */}
<div style={{display:"flex",justifyContent:"right",marginTop:"20px"}}>
<button type="submit" className="login-button"><b>Log In</b></button>
</div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;