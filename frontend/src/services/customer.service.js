const api_url = process.env.REACT_APP_API_URL;

// A function to get all customers
const getAllCustomers = async (token, active_customer_status) => {
  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };
  const response = await fetch(`${api_url}/api/customers?active_customer_status=${active_customer_status}`, requestOptions);
  return response;
}

// A function to get a single customer by ID
const getCustomerById = async (customerId, token) => {
  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };
  const response = await fetch(`${api_url}/api/customer/${customerId}`, requestOptions);
  return response;
}

// A function to create a new customer
const createCustomer = async (formData, token) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(formData)
  };
  const response = await fetch(`${api_url}/api/customer`, requestOptions);
  return response;
}

// A function to update a customer
const updateCustomer = async (customerId, formData, token) => {
  const requestOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(formData)
  };
  const response = await fetch(`${api_url}/api/customer/${customerId}`, requestOptions);
  return response;
}

// Export all the functions
const customerService = {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer
}
export default customerService;
