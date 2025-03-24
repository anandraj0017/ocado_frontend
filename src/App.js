import React from 'react';
import Modal from 'react-modal';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Dashboard from './EmergencyMessage/MessageComponent/Dashboard';
import NotificationDashboard from './EmergencyNotification/NotificationComponent/NotificationDashboard';
import SignIn from './PrivateComponents/SignIn'
import Login from './PrivateComponents/Login';
import PrivateLayout from './PrivateComponents/PrivateLayout';
import PrivateRoute from './PrivateComponents/PrivateRoute';
import LandingPage from './PrivateComponents/LandingPage';
import ChatbotToggle from './ChatBot/ChatbotToggle';
import './App.css';
Modal.setAppElement('#root');

const App = () => {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Login/>} />
                <Route path="/landingPage" exact element={<PrivateRoute>
              <PrivateLayout>
                <LandingPage />
              </PrivateLayout>
            </PrivateRoute>} />
                <Route path="/emergencyMessage" element={<PrivateRoute>
              <PrivateLayout>
                <Dashboard />
              </PrivateLayout>
            </PrivateRoute>} />
                <Route path="/emergencyNotification" element={<PrivateRoute>
              <PrivateLayout>
                <NotificationDashboard />
              </PrivateLayout>
            </PrivateRoute>} />
                <Route path="/chatbotToggle" element={<PrivateRoute>
              <PrivateLayout>
                <ChatbotToggle />
              </PrivateLayout>
            </PrivateRoute>} />
           
            
            
         
        </Routes>
    </Router>
    // <Router>
    //   <div>
    //     <nav>
    //       <ul>
    //         <li>
    //           <Link to="/">Messages</Link>
    //         </li>
    //         <li>
    //           <Link to="/notifications">Notifications</Link>
    //         </li>
    //       </ul>
    //     </nav>
    //     <Routes>
    //       <Route path="/" element={<Dashboard />} />
    //       <Route path="/notifications" element={<NotificationDashboard />} />
    //       {/* Add other routes here */}
    //     </Routes>
    //   </div>
    // </Router>
  );
};

export default App;