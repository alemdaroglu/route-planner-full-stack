import React, { useState, useEffect } from 'react';
import { locationAPI } from '../../services/api';

const Location = () => {
  const [locations, setLocations] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(10);
  const [sortBy] = useState('locationCode');
  const [ascending] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    city: '',
    locationCode: ''
  });
  const [error, setError] = useState('');

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const response = await locationAPI.getAllPaginated(currentPage, pageSize, sortBy, ascending);
      setLocations(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error('Failed to fetch locations:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create new location
  const createLocation = async (e) => {
    e.preventDefault();
    try {
      await locationAPI.create(formData);
      setFormData({ name: '', country: '', city: '', locationCode: '' });
      fetchLocations();
    } catch (err) {
      setError('Failed to create location');
    }
  };

  // Update location
  const updateLocation = async (e) => {
    e.preventDefault();
    try {
      await locationAPI.update(selectedLocation.id, formData);
      setIsEditing(false);
      setSelectedLocation(null);
      setFormData({ name: '', country: '', city: '', locationCode: '' });
      fetchLocations();
    } catch (err) {
      setError('Failed to update location');
    }
  };

  // Delete location
  const deleteLocation = async (id) => {
    if (window.confirm('Are you sure you want to delete this location?')) {
      try {
        await locationAPI.delete(id);
        fetchLocations();
      } catch (err) {
        setError('Failed to delete location');
      }
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Edit location
  const handleEdit = (location) => {
    setIsEditing(true);
    setSelectedLocation(location);
    setFormData({
      name: location.name,
      country: location.country,
      city: location.city,
      locationCode: location.locationCode
    });
  };

  useEffect(() => {
    fetchLocations();
  }, [currentPage, pageSize, sortBy, ascending]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>{isEditing ? 'Edit Location' : 'Add New Location'}</h2>
      
      {error && (
        <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>
      )}

      <form onSubmit={isEditing ? updateLocation : createLocation} style={{
        marginBottom: '20px',
        padding: '20px',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px'
      }}>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Location Name"
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            placeholder="Country"
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            placeholder="City"
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            name="locationCode"
            value={formData.locationCode}
            onChange={handleInputChange}
            placeholder="Location Code"
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <button 
          type="submit"
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {isEditing ? 'Update Location' : 'Add Location'}
        </button>
        {isEditing && (
          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              setSelectedLocation(null);
              setFormData({ name: '', country: '', city: '', locationCode: '' });
            }}
            style={{
              padding: '8px 16px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginLeft: '10px'
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <h2>Locations List</h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Name</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Country</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>City</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Location Code</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {locations.map((location) => (
              <tr key={location.id}>
                <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{location.name}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{location.country}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{location.city}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{location.locationCode}</td>
                <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>
                  <button
                    onClick={() => handleEdit(location)}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      marginRight: '5px'
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteLocation(location.id)}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div style={{ 
        marginTop: '20px', 
        display: 'flex', 
        justifyContent: 'center',
        gap: '10px'
      }}>
        <button
          onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
          disabled={currentPage === 0 || loading}
          style={{
            padding: '8px 16px',
            cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
            backgroundColor: currentPage === 0 ? '#ddd' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          Previous
        </button>
        
        <span style={{ alignSelf: 'center' }}>
          Page {currentPage + 1} of {totalPages}
        </span>
        
        <button
          onClick={() => setCurrentPage(prev => prev + 1)}
          disabled={currentPage === totalPages - 1 || loading}
          style={{
            padding: '8px 16px',
            cursor: currentPage === totalPages - 1 ? 'not-allowed' : 'pointer',
            backgroundColor: currentPage === totalPages - 1 ? '#ddd' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Location;
