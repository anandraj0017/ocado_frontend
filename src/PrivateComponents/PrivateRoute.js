// PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
 
const PrivateRoute = ({ children }) => {
  const username = localStorage.getItem('username');
  return username ? children : <Navigate to="/" />;
};
 
export default PrivateRoute;