import React, { useState, useEffect } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { routeAPI, fetchAllLocations } from '../../services/api';


const RouteFinder = () => {
  const [locations, setLocations] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [error, setError] = useState('');
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [searchParams, setSearchParams] = useState({
    origin: '',
    destination: '',
    date: dayjs()
  });
  const [hasSearched, setHasSearched] = useState(false);

  // Fetch locations for dropdowns
  useEffect(() => {
    const loadLocations = async () => {
      const allLocations = await fetchAllLocations();
      setLocations(allLocations);
    };
    loadLocations();
  }, []);

  const handleSearch = async () => {
    try {
      setHasSearched(true);
      const formattedDate = searchParams.date.format('YYYY-MM-DD');
      const response = await routeAPI.search(
        searchParams.origin,
        searchParams.destination,
        formattedDate
      );
      const sortedRoutes = [...response.data].sort((a, b) => 
        (a.stops.length - 1) - (b.stops.length - 1)
      );
      setRoutes(sortedRoutes);
      setError('');
    } catch (err) {
      setError('Failed to fetch routes');
      setRoutes([]);
    }
  };

  const getRouteName = (route) => {
    const flightStop = route.stops.find(stop => stop.transportationTypeToNext === 'FLIGHT');
    if (flightStop) {
      return `Via ${flightStop.location.name} (${flightStop.location.locationCode})`;
    }
    return 'Direct Route';
  };

  const handleRouteClick = (route) => {
    setSelectedRoute(route);
  };

  // Helper function to get location name from code
  const getLocationName = (locationCode) => {
    const location = locations.find(loc => loc.locationCode === locationCode);
    return location ? `${location.name} (${location.locationCode})` : locationCode;
  };

  // Helper function to format date for display
  const formatDateForDisplay = (date) => {
    return date.format('DD-MM-YYYY');
  };

  return (
    <div style={{ padding: '20px', position: 'relative' }}>
      <div style={{
        display: 'flex',
        gap: '20px',
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px'
      }}>
        {/* Origin Selection */}
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Origin</label>
          <select
            value={searchParams.origin}
            onChange={(e) => setSearchParams(prev => ({ ...prev, origin: e.target.value }))}
            style={{ width: '100%', padding: '8px', borderRadius: '4px' }}
          >
            <option value="">Select Origin</option>
            {locations.map(location => (
              <option key={location.id} value={location.locationCode}>
                {location.locationCode} - {location.name}
              </option>
            ))}
          </select>
        </div>

        {/* Destination Selection */}
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Destination</label>
          <select
            value={searchParams.destination}
            onChange={(e) => setSearchParams(prev => ({ ...prev, destination: e.target.value }))}
            style={{ width: '100%', padding: '8px', borderRadius: '4px' }}
          >
            <option value="">Select Destination</option>
            {locations.map(location => (
              <option key={location.id} value={location.locationCode}>
                {location.locationCode} - {location.name}
              </option>
            ))}
          </select>
        </div>

        {/* Date Picker with updated format */}
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Travel Date</label>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={searchParams.date}
              onChange={(newValue) => setSearchParams(prev => ({ ...prev, date: newValue }))}
              format="DD-MM-YYYY"
              slotProps={{ textField: { style: { width: '100%' } } }}
            />
          </LocalizationProvider>
        </div>

        {/* Search Button */}
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <button
            onClick={handleSearch}
            style={{
              padding: '8px 24px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              height: '40px'
            }}
          >
            Search
          </button>
        </div>
      </div>

      {error && (
        <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>
      )}

      {/* Enhanced results summary with date */}
      {hasSearched && (
        <div style={{ 
          marginBottom: '20px',
          padding: '10px',
          backgroundColor: '#f8f9fa',
          borderRadius: '4px'
        }}>
          <div>From {getLocationName(searchParams.origin)} to {getLocationName(searchParams.destination)}</div>
          <div>Date: {formatDateForDisplay(searchParams.date)}</div>
          <div style={{ marginTop: '8px' }}>Routes Found: {routes.length}</div>
        </div>
      )}

      {/* Routes Table */}
      {routes.length > 0 && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Route Options</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}># Legs</th>
              </tr>
            </thead>
            <tbody>
              {routes.map((route, index) => (
                <tr 
                  key={index}
                  onClick={() => handleRouteClick(route)}
                  style={{ 
                    cursor: 'pointer',
                    backgroundColor: selectedRoute === route ? '#f0f0f0' : 'transparent',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = selectedRoute === route ? '#f0f0f0' : 'transparent'}
                >
                  <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>
                    {getRouteName(route)}
                  </td>
                  <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>
                    {route.stops.length - 1}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Sliding Sidebar */}
      <div style={{
        position: 'fixed',
        top: '55px',
        right: 0,
        width: '400px',
        height: 'calc(100vh - 55px)',
        backgroundColor: 'white',
        boxShadow: '-2px 0 5px rgba(0,0,0,0.1)',
        transform: selectedRoute ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s ease-in-out',
        zIndex: 1000,
        overflowY: 'auto'
      }}>
        {selectedRoute && (
          <div style={{ padding: '20px' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h2 style={{ margin: 0 }}>{getRouteName(selectedRoute)}</h2>
              <button
                onClick={() => setSelectedRoute(null)}
                style={{
                  border: 'none',
                  background: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  padding: '5px'
                }}
              >
                ×
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {selectedRoute.stops.map((stop, index) => (
                <div key={index} style={{ marginBottom: '20px' }}>
                  <div style={{
                    padding: '15px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '8px',
                    marginBottom: stop.transportationTypeToNext ? '10px' : '0'
                  }}>
                    <div style={{ fontWeight: 'bold' }}>
                      {stop.location.locationCode} - {stop.location.name}
                    </div>
                    <div style={{ color: '#666', fontSize: '0.9em' }}>
                      {stop.location.city}, {stop.location.country}
                    </div>
                  </div>
                  
                  {stop.transportationTypeToNext && (
                    <div style={{
                      textAlign: 'center',
                      padding: '10px',
                      color: '#666',
                      position: 'relative'
                    }}>
                      <div style={{
                        position: 'absolute',
                        left: '50%',
                        top: '0',
                        bottom: '0',
                        width: '2px',
                        backgroundColor: '#ddd',
                        zIndex: 0
                      }} />
                      <span style={{
                        backgroundColor: '#fff',
                        padding: '5px 10px',
                        borderRadius: '15px',
                        border: '1px solid #ddd',
                        position: 'relative',
                        zIndex: 1
                      }}>
                        {stop.transportationTypeToNext}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RouteFinder;