import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import SignIn from './components/Auth/SignIn';
import SignUp from './components/Auth/SignUp';
import Location from './components/Pages/Location';
import Transportation from './components/Pages/Transportation';
import RouteFinder from './components/Pages/RouteFinder';
import MainLayout from './components/Layout/MainLayout';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [userRoles, setUserRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserInfo = async () => {
    if (localStorage.getItem('token')) {
      try {
        const response = await fetch('http://localhost:8080/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setUserRoles(data.roles);
          return true;
        }
        return false;
      } catch (err) {
        console.error('Failed to fetch user info');
        return false;
      }
    }
    return false;
  };

  useEffect(() => {
    const init = async () => {
      const success = await fetchUserInfo();
      if (!success) {
        setUserRoles([]);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
      }
      setLoading(false);
    };

    init();
  }, []);

  if (loading) {
    return null; // or a loading spinner
  }

  const isAdmin = userRoles.includes('ROLE_ADMIN');
  const defaultPath = isAdmin ? '/location' : '/route';

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signin" element={!isAuthenticated ? <SignIn /> : <Navigate to={defaultPath} />} />
        <Route path="/signup" element={!isAuthenticated ? <SignUp /> : <Navigate to={defaultPath} />} />
        
        <Route 
          path="/" 
          element={isAuthenticated ? <MainLayout userRoles={userRoles} /> : <Navigate to="/signin" />}
        >
          {isAdmin && <Route path="location" element={<Location />} />}
          {isAdmin && <Route path="transportation" element={<Transportation />} />}
          <Route path="route" element={<RouteFinder />} />
          <Route index element={<Navigate to={defaultPath} replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;