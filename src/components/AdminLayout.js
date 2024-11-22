import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="d-flex">
      <div style={{
        width: '250px',
        minHeight: '92vh',
        backgroundColor: '#2c3e50',
        padding: '20px',
        color: 'white'
      }}>
        <h3 className="mb-4">Admin Panel</h3>
        <nav className="nav flex-column">
          <NavLink 
            to="/admin/users" 
            className={({ isActive }) =>
              `nav-link ${isActive ? 'active bg-success text-white shadow rounded-pill px-4' : 'text-white'}`
            }
          >
            Users
          </NavLink>
          <NavLink 
            to="/admin/businesses" 
            className={({ isActive }) =>
              `nav-link ${isActive ? 'active bg-success text-white shadow rounded-pill px-4' : 'text-white'}`
            }
          >
            Businesses
          </NavLink>
          <NavLink 
            to="/admin/map" 
            className={({ isActive }) =>
              `nav-link ${isActive ? 'active bg-success text-white shadow rounded-pill px-4' : 'text-white'}`
            }
          >
            Map
          </NavLink>
        </nav>
      </div>
      <div style={{ flex: 1, padding: '0px' }}>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
