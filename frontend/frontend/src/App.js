import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// ... other imports

function App() {
  // Check if user is authenticated by looking for token
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route 
          path="/signin" 
          element={!isAuthenticated ? <SignIn /> : <Navigate to="/" />} 
        />
        <Route 
          path="/signup" 
          element={!isAuthenticated ? <SignUp /> : <Navigate to="/" />} 
        />
        
        {/* Protected Routes */}
        <Route 
          path="/" 
          element={isAuthenticated ? <MainLayout /> : <Navigate to="/signin" />}
        >
          <Route index element={<Dashboard />} />
          <Route path="location" element={<Location />} />
          <Route path="transportation" element={<Transportation />} />
          <Route path="route" element={<Route />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App; 