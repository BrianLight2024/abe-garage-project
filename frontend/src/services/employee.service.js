const api_url = process.env.REACT_APP_API_URL;

// A function to send post request to create a new employee 
const createEmployee = async (formData, loggedInEmployeeToken) => {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${loggedInEmployeeToken}`
    },
    body: JSON.stringify(formData)
  };
  const response = await fetch(`${api_url}/api/employee`, requestOptions);
  return response;
}

// A function to send get request to get all employees
const getAllEmployees = async (token, active_employee = 1) => { 
  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };
  const response = await fetch(`${api_url}/api/employees?active_employee=${active_employee}`, requestOptions);
  return response;
}

// A function to update an employee
const updateEmployee = async (employeeId, formData, token) => {
  const requestOptions = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(formData)
  };
  const response = await fetch(`${api_url}/api/employee/${employeeId}`, requestOptions);
  return response;
} 

// Export all the functions 
const employeeService = {
  createEmployee,
  getAllEmployees,
  updateEmployee,
}

export default employeeService;
