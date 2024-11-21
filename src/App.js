import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Login from './pages/Login';
import Register from './pages/Register';
import BusinessDetails from './pages/BusinessDetails';
import LandingPage from './pages/LandingPage';
import ProtectedRoute from './components/ProtectedRoute';
import MapPage from './pages/MapPage';
import Profile from './pages/Profile';
import AddLocationPage from './pages/AddLocationPage';
import { AuthContext } from './context/AuthContext';
import { LoadScript } from '@react-google-maps/api';
import { ToastContainer } from 'react-toastify';
import AdminLayout from './components/AdminLayout';
import Users from './pages/admin/Users';
import Businesses from './pages/admin/Businesses';
import AdminMap from './pages/admin/AdminMap';

const AppContent = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const location = useLocation(); // Hook to get the current location

  // Paths where Header should not be displayed
  const hideHeaderPaths = ['/', '/login', '/register', '/admin', '/admin/*'];

  return (
    <>
      <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
        <ToastContainer />
        {/* Conditionally render the Header only if the current path is not in hideHeaderPaths */}
        {isAuthenticated && !hideHeaderPaths.includes(location.pathname) && <Header />}

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />  {/* Landing Page available to everyone */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes for authenticated users only */}
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
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="users" element={<Users />} />
            <Route path="businesses" element={<Businesses />} />
            <Route path="map" element={<AdminMap />} />
            <Route index element={<Navigate to="users" replace />} />
          </Route>
          {/* Redirect any non-matching route to the landing page */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </LoadScript>
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
