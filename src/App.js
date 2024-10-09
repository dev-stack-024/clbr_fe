import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BusinessDetails from './pages/BusinessDetails';
import LandingPage from './pages/LandingPage';
import ProtectedRoute from './components/ProtectedRoute';
import MapPage from './pages/MapPage';
import AddLocationPage from './pages/AddLocationPage';
import { AuthContext } from './context/AuthContext';

const AppContent = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const location = useLocation(); // Hook to get the current location

  // Paths where Header should not be displayed
  const hideHeaderPaths = ['/', '/login', '/register'];

  return (
    <>
      {/* Conditionally render the Header only if the current path is not in hideHeaderPaths */}
      {isAuthenticated && !hideHeaderPaths.includes(location.pathname) && <Header />}

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
          path="/my-location/:id"
          element={
            <ProtectedRoute>
              <MapPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-location"
          element={
            <ProtectedRoute>
              <AddLocationPage />
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
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
