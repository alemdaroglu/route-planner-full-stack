import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

const MainLayout = ({ userRoles }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear all auth-related items from localStorage
    localStorage.removeItem('token');
    // Force a redirect to signin page
    window.location.href = '/signin';  // This will cause a full page reload and reset the app state
  };

  return (
    <div style={{ 
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'white',
        padding: '15px 20px',
        borderBottom: '1px solid #ddd',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        zIndex: 1001,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{
          margin: 0,
          fontSize: '24px',
          color: '#333'
        }}>
          Route Planner
        </h1>
        <button
          onClick={handleLogout}
          style={{
            padding: '8px 16px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#c82333'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#dc3545'}
        >
          Logout
        </button>
      </header>

      {/* Main Content Area with Sidebar */}
      <div style={{ 
        display: 'flex',
        flex: 1
      }}>
        {/* Sidebar */}
        <Sidebar userRoles={userRoles} />
        
        {/* Content Area */}
        <div style={{ 
          flexGrow: 1,
          padding: '20px',
          overflowY: 'auto'
        }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;