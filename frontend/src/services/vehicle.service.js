const api_url = process.env.REACT_APP_API_URL;

// A function to get all vehicles for a customer
const getVehiclesByCustomerId = async (customerId, token) => {
  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };
  const response = await fetch(`${api_url}/api/vehicles/${customerId}`, requestOptions);
  return response;
}

// A function to get a single vehicle by ID
const getVehicleById = async (vehicleId, token) => {
  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };
  const response = await fetch(`${api_url}/api/vehicle/${vehicleId}`, requestOptions);
  return response;
}

// A function to create a new vehicle
const createVehicle = async (formData, token) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(formData)
  };
  const response = await fetch(`${api_url}/api/vehicle`, requestOptions);
  return response;
}

// A function to update a vehicle
const updateVehicle = async (vehicleId, formData, token) => {
  const requestOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(formData)
  };
  const response = await fetch(`${api_url}/api/vehicle/${vehicleId}`, requestOptions);
  return response;
}

// Export all the functions
const vehicleService = {
  getVehiclesByCustomerId,
  getVehicleById,
  createVehicle,
  updateVehicle
}
export default vehicleService;
