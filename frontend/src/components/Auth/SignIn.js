import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/api';

const SignIn = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await authAPI.login(credentials);

      // Store the token in localStorage
      localStorage.setItem('token', response.data.token);
       // Force a re-render by setting a user state in localStorage
      localStorage.setItem('isAuthenticated', 'true');
      
      // Redirect to dashboard
      navigate('/');// Optional: force page reload to ensure all auth states are updated
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to sign in');
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px',
      marginTop: '50px'
    }}>
      <h1>Sign In</h1>
      
      {error && (
        <div style={{ 
          color: 'red', 
          marginBottom: '10px',
          padding: '10px',
          backgroundColor: '#ffebee',
          borderRadius: '4px'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{
        width: '100%',
        maxWidth: '300px'
      }}>
        <div style={{ marginBottom: '15px' }}>
          <input
            type="text"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            placeholder="Username"
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <input
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            placeholder="Password"
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          />
        </div>
        <button 
          type="submit"
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Sign In
        </button>
      </form>
      
      <div style={{ marginTop: '15px' }}>
        <Link to="/signup" style={{ color: '#007bff', textDecoration: 'none' }}>
          Don't have an account? Sign Up
        </Link>
      </div>
    </div>
  );
};

export default SignIn;