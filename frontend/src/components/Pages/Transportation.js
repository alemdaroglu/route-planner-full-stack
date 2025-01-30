import React, { useState, useEffect } from 'react';
import { transportationAPI, locationAPI } from '../../services/api';

const Transportation = () => {
  const [transportations, setTransportations] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedTransportation, setSelectedTransportation] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(10);
  const [sortBy] = useState('id');
  const [ascending] = useState(true);
  const [loading, setLoading] = useState(false);

  const transportTypes = ["FLIGHT", "BUS", "UBER", "SUBWAY"];
  const daysOfWeek = [
    { id: 1, name: 'Monday' },
    { id: 2, name: 'Tuesday' },
    { id: 3, name: 'Wednesday' },
    { id: 4, name: 'Thursday' },
    { id: 5, name: 'Friday' },
    { id: 6, name: 'Saturday' },
    { id: 7, name: 'Sunday' }
  ];

  const [formData, setFormData] = useState({
    originLocationId: '',
    destinationLocationId: '',
    transportationType: 'FLIGHT',
    operatingDays: [1, 2, 3, 4, 5, 6, 7]  // All days checked by default
  });

  // Sort locations by locationCode length and then alphabetically
  const sortedLocations = React.useMemo(() => {
    if (!Array.isArray(locations)) return [];
    
    return [...locations].sort((a, b) => {
      // First compare by length
      if (a.locationCode.length !== b.locationCode.length) {
        return a.locationCode.length - b.locationCode.length;
      }
      // If lengths are equal, compare alphabetically
      return a.locationCode.localeCompare(b.locationCode);
    });
  }, [locations]);

  // Fetch locations for dropdowns
  const fetchLocations = async () => {
    try {
      const response = await locationAPI.getAll();
      // Ensure we're setting an array
      const locationData = Array.isArray(response.data) ? response.data : 
                         (response.data?.content || []);
      setLocations(locationData);
    } catch (err) {
      console.error('Failed to fetch locations:', err);
      setError('Failed to fetch locations');
      setLocations([]); // Set empty array on error
    }
  };

  // Fetch all transportations
  const fetchTransportations = async () => {
    try {
      setLoading(true);
      const response = await transportationAPI.getAllPaginated(currentPage, pageSize, sortBy, ascending);
      setTransportations(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error('Failed to fetch transportations:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create new transportation
  const createTransportation = async (e) => {
    e.preventDefault();
    try {
      await transportationAPI.create(formData);
      resetForm();
      fetchTransportations();
    } catch (err) {
      setError('Failed to create transportation');
    }
  };

  // Update transportation
  const updateTransportation = async (e) => {
    e.preventDefault();
    try {
      await transportationAPI.update(selectedTransportation.id, formData);
      resetForm();
      fetchTransportations();
    } catch (err) {
      setError('Failed to update transportation');
    }
  };

  // Delete transportation
  const deleteTransportation = async (id) => {
    if (window.confirm('Are you sure you want to delete this transportation?')) {
      try {
        await transportationAPI.delete(id);
        fetchTransportations();
      } catch (err) {
        setError('Failed to delete transportation');
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

  // Handle operating days changes
  const handleDayChange = (dayId) => {
    setFormData(prev => {
      const newDays = prev.operatingDays.includes(dayId)
        ? prev.operatingDays.filter(id => id !== dayId)
        : [...prev.operatingDays, dayId].sort((a, b) => a - b);
      return { ...prev, operatingDays: newDays };
    });
  };

  // Reset form
  const resetForm = () => {
    setIsEditing(false);
    setSelectedTransportation(null);
    setFormData({
      originLocationId: '',
      destinationLocationId: '',
      transportationType: 'FLIGHT',
      operatingDays: [1, 2, 3, 4, 5, 6, 7]  // All days checked by default
    });
  };

  // Handle edit
  const handleEdit = (transportation) => {
    setIsEditing(true);
    setSelectedTransportation(transportation);
    setFormData({
      originLocationId: transportation.originLocationId,
      destinationLocationId: transportation.destinationLocationId,
      transportationType: transportation.transportationType,
      operatingDays: transportation.operatingDays
    });
  };

  // Load data on component mount
  useEffect(() => {
    const loadLocations = async () => {
      try {
        const response = await locationAPI.getAll();
        // Ensure we're setting an array
        const locationData = Array.isArray(response.data) ? response.data : 
                           (response.data?.content || []);
        setLocations(locationData);
      } catch (err) {
        console.error('Failed to fetch locations:', err);
        setError('Failed to fetch locations');
        setLocations([]); // Set empty array on error
      }
    };
    loadLocations();
  }, []);

  useEffect(() => {
    fetchTransportations();
  }, [currentPage, pageSize, sortBy, ascending]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>{isEditing ? 'Edit Transportation' : 'Add New Transportation'}</h2>
      
      {error && (
        <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>
      )}

      <form onSubmit={isEditing ? updateTransportation : createTransportation} style={{
        marginBottom: '20px',
        padding: '20px',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px'
      }}>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Origin Location</label>
          <select
            name="originLocationId"
            value={formData.originLocationId}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '8px' }}
          >
            <option value="">Select Origin Location</option>
            {sortedLocations.map(location => (
              <option key={location.id} value={location.id}>
                {location.locationCode} - {location.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Destination Location</label>
          <select
            name="destinationLocationId"
            value={formData.destinationLocationId}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '8px' }}
          >
            <option value="">Select Destination Location</option>
            {sortedLocations.map(location => (
              <option key={location.id} value={location.id}>
                {location.locationCode} - {location.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Transportation Type</label>
          <select
            name="transportationType"
            value={formData.transportationType}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '8px' }}
          >
            {transportTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Operating Days</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {daysOfWeek.map(day => (
              <label key={day.id} style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  checked={formData.operatingDays.includes(day.id)}
                  onChange={() => handleDayChange(day.id)}
                  style={{ marginRight: '5px' }}
                />
                {day.name}
              </label>
            ))}
          </div>
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
          {isEditing ? 'Update Transportation' : 'Add Transportation'}
        </button>
        {isEditing && (
          <button
            type="button"
            onClick={resetForm}
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

      <h2>Transportations List</h2>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Origin</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Destination</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Type</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Operating Days</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transportations.map((transportation) => {
              return (
                <tr key={transportation.id}>
                  <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>
                    {transportation.originLocation ? `${transportation.originLocation.locationCode} - ${transportation.originLocation.name}` : 'Unknown'}
                  </td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>
                    {transportation.destinationLocation ? `${transportation.destinationLocation.locationCode} - ${transportation.destinationLocation.name}` : 'Unknown'}
                  </td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>
                    {transportation.transportationType}
                  </td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>
                    {transportation.operatingDays
                      .map(dayId => daysOfWeek.find(d => d.id === dayId)?.name)
                      .join(', ')}
                  </td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>
                    <button
                      onClick={() => handleEdit(transportation)}
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
                      onClick={() => deleteTransportation(transportation.id)}
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
              );
            })}
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

export default Transportation;
