export const fetchAllLocations = async () => {
  let allLocations = [];
  let currentPage = 0;
  let hasMore = true;
  const size = 50; // Using a larger page size for efficiency

  while (hasMore) {
    try {
      const response = await fetch(
        `http://localhost:8080/api/locations?page=${currentPage}&size=${size}&sortBy=locationCode&ascending=true`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      const data = await response.json();
      allLocations = [...allLocations, ...data.content];
      hasMore = !data.last;
      currentPage++;
    } catch (err) {
      console.error('Error fetching locations:', err);
      break;
    }
  }

  return allLocations;
};

export const fetchPaginatedData = async (endpoint, page, size, sortBy, ascending) => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/${endpoint}?page=${page}&size=${size}&sortBy=${sortBy}&ascending=${ascending}`,
      {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    return await response.json();
  } catch (err) {
    console.error(`Error fetching ${endpoint}:`, err);
    throw err;
  }
};