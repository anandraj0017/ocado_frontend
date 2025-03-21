import React, { useState, useEffect } from 'react';
import ocadoLogo from '../images/logo_white.png';
import axios from 'axios';
import '../styles/SignIn.css';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';

const SignIn = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
        const token = '123456';
        localStorage.setItem('token', token);
        const name = response.data.emergency.userName;
        console.log("Hi ",name)
        localStorage.setItem('username', name);
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
        event.preventDefault(); // Prevent default form submission
        handleLogin(event);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleLogin]);

  return (
    <>
      <section className="mySection py-3 py-md-5 py-xl-8">
        <div className="container signInMargin">
          <div className="row gy-4 align-items-center">
            <div className="col-12 col-md-6 col-xl-7 infoSectionSignIn">
              <div className="d-flex justify-content-center">
                <div className="col-12 col-xl-9">
                  <img src={ocadoLogo} alt="Logo" />
                  <div className='infoSectionInner1'>
                    <hr className="border-primary-subtle mb-4" />
                    <h2 className="h1 mb-4" style={{ color: "white" }}>Start shopping the ridiculously easy way</h2>
                    <p className="lead mb-5 paraColor" style={{ color: "white" }}>We're the best supermarket for online shopping</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 col-xl-4">
              <div className="card border-0 rounded-4" style={{ backgroundColor: "white", borderRadius: "25px" }}>
                <div className="card-body p-md-4 p-xl-5">
                  <div className="row">
                    <div className="col-12">
                      <div className="mb-4" style={{ color: "#4d216d", fontWeight: "bold" }}>
                        <h3>Sign in</h3>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="row gy-3 overflow-hidden">
                      <div className="col-12 userIdMarginBottom">
                        <div className="mb-3">
                          <input
                            type="text"
                            className="form-control"
                            name="userId"
                            id="userId"
                            value={userId}
                            placeholder="User ID"
                            onChange={(e) => setUserId(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-12 userPasswordMarginBottom">
                        <div className="mb-3">
                          <input
                            type="password"
                            className="form-control"
                            name="password"
                            id="password"
                            value={password}
                            placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      {error && (
                        <div className="col-12" style={{ color: 'red', margin: "0px" }}>
                          {error}
                        </div>
                      )}
                      <div className="col-12">
                        <div className="d-grid loginButton">
                          <button type="submit" onClick={handleLogin} className="btn" style={{ backgroundColor: "#4d216d", width: "100%", color: "white" }}>
                            Log in now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer myProp="signIn" />
      </section>
    </>
  );
};

export default SignIn;