import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ userRoles }) => {
  const location = useLocation();
  const isAdmin = userRoles.includes('ROLE_ADMIN');

  // Define menu items based on user role
  const menuItems = [
    ...(isAdmin ? [
      { path: '/location', label: 'Location' },
      { path: '/transportation', label: 'Transportation' },
    ] : []),
    { path: '/route', label: 'Route' }
  ];

  return (
    <div style={{
      width: '250px',
      backgroundColor: 'white',
      padding: '20px',
      borderRight: '1px solid #ddd',
      height: 'calc(100vh - 55px)',
      position: 'sticky',
      top: 0
    }}>
      <nav>
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              display: 'block',
              padding: '12px 15px',
              marginBottom: '8px',
              backgroundColor: location.pathname === item.path ? '#007bff' : 'transparent',
              color: location.pathname === item.path ? 'white' : '#333',
              textDecoration: 'none',
              borderRadius: '4px',
              transition: 'all 0.2s ease',
              fontWeight: location.pathname === item.path ? 'bold' : 'normal'
            }}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;