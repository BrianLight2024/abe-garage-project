const api_url = process.env.REACT_APP_API_URL;

// A function to get all services
const getAllServices = async (token) => {
  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };
  const response = await fetch(`${api_url}/api/services`, requestOptions);
  return response;
}

// A function to get a single service by ID
const getServiceById = async (serviceId, token) => {
  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };
  const response = await fetch(`${api_url}/api/service/${serviceId}`, requestOptions);
  return response;
}

// A function to create a new service
const createService = async (formData, token) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(formData)
  };
  const response = await fetch(`${api_url}/api/service`, requestOptions);
  return response;
}

// A function to update an existing service
const updateService = async (serviceId, formData, token) => {
  const requestOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(formData)
  };
  const response = await fetch(`${api_url}/api/service/${serviceId}`, requestOptions);
  return response;
}

// Export all the functions
const serviceService = {
  getAllServices,
  getServiceById,
  createService,
  updateService
}
export default serviceService;
