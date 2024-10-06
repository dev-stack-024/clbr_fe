import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BusinessDetails from './pages/BusinessDetails';
import LandingPage from './pages/LandingPage'; // Import Landing Page
import ProtectedRoute from './components/ProtectedRoute';
import MapPage from './pages/MapPage';
// import { AuthContext } from './context/AuthContext';

const App = () => {
  // const { isAuthenticated } = useContext(AuthContext);

  return (
    <Router>
      {/* Show Header only when authenticated */}
      {/* {isAuthenticated && <Header />} */}
      
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />  {/* Landing Page available to everyone */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes for authenticated users only */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/map"
          element={
            <ProtectedRoute>
              <MapPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/business/:id"
          element={
            <ProtectedRoute>
              <BusinessDetails />
            </ProtectedRoute>
          }
        />

        {/* Redirect any non-matching route to the landing page */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
