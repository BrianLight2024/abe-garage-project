const api_url = process.env.REACT_APP_API_URL;

// A function to get all orders
const getAllOrders = async (token, limit, activeOrder = null) => {
  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };
  const url = activeOrder !== null ? `${api_url}/api/orders?limit=${limit}&activeOrder=${activeOrder}` : `${api_url}/api/orders?limit=${limit}`;
  const response = await fetch(url, requestOptions);
  return response;
}


// A function to get a single order by ID
const getOrderById = async (orderId, token) => {
  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };
  const response = await fetch(`${api_url}/api/order/${orderId}`, requestOptions);
  return response;
}

// A function to create a new order
const createOrder = async (formData, token) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(formData)
  };
  const response = await fetch(`${api_url}/api/order`, requestOptions);
  return response;
}

// A function to update an order
const updateOrder = async (orderId, formData, token) => {
  const requestOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(formData)
  };
  const response = await fetch(`${api_url}/api/order/${orderId}`, requestOptions);
  return response;
}

const deleteOrder = async (orderId, token) => {
  const requestOptions = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };
  const response = await fetch(`${api_url}/api/order/${orderId}`, requestOptions);
  return response;
}

// Export all the functions
const orderService = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder
}
export default orderService;
