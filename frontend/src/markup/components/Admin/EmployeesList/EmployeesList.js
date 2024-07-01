import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { useAuth } from "../../../../Contexts/AuthContext";
import employeeService from "../../../../services/employee.service";
import { format } from 'date-fns';

const EmployeesList = () => {
    const [employees, setEmployees] = useState([]);
    const [apiError, setApiError] = useState(false);
    const [apiErrorMessage, setApiErrorMessage] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [currentEmployee, setCurrentEmployee] = useState(null);
    const [showInactive, setShowInactive] = useState(false);
    const { employee } = useAuth();
    let token = null;
    if (employee) {
        token = employee.employee_token;
    }

    const fetchEmployees = async (token, showInactive, setApiError, setApiErrorMessage, setEmployees) => {
      try {
          const response = await employeeService.getAllEmployees(token, showInactive ? 0 : 1);
          if (!response.ok) {
              setApiError(true);
              if (response.status === 401) {
                  setApiErrorMessage("Please login again");
              } else if (response.status === 403) {
                  setApiErrorMessage("You are not authorized to view this page");
              } else {
                  setApiErrorMessage("Please try again later");
              }
          } else {
              const data = await response.json();
              setEmployees(data.data || []);
          }
      } catch (error) {
          setApiError(true);
          setApiErrorMessage("An error occurred while fetching employees");
      }
  };

      useEffect(() => {
        fetchEmployees(token, showInactive, setApiError, setApiErrorMessage, setEmployees);
    }, [token, showInactive]);

    const handleEdit = (employee) => {
        setCurrentEmployee(employee);
        setShowModal(true);
    }; 

    const handleSave = async () => {
        try {
            const token = employee?.employee_token;
            const employeeId = currentEmployee.employee_id;

            const formData = {
                employee_email: currentEmployee.employee_email,
                employee_first_name: currentEmployee.employee_first_name,
                employee_last_name: currentEmployee.employee_last_name,
                employee_phone: currentEmployee.employee_phone,
                active_employee: currentEmployee.active_employee,
                company_role_id: currentEmployee.company_role_id
            };

            const response = await employeeService.updateEmployee(employeeId, formData, token);

            if (response.ok) {
                const updatedEmployee = await response.json();
                await fetchEmployees(token, showInactive, setApiError, setApiErrorMessage, setEmployees);
            } else {
                const errorData = await response.json();
                console.error("Failed to update employee", errorData);
            }
        } catch (error) {
            console.error("An error occurred while updating the employee", error);
        } finally {
            setShowModal(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentEmployee(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const isValidDate = (date) => {
      return !isNaN(Date.parse(date));
  };

    return (
        <>
            {apiError ? (
                <section className="contact-section">
                    <div className="auto-container">
                        <div className="contact-title">
                            <h2>{apiErrorMessage}</h2>
                        </div>
                    </div>
                </section>
            ) : (
                <section className="contact-section">
                    <div className="auto-container">
                        <div className="contact-title">
                            <h2>Employees</h2>
                        </div>
                        <div className="employee-controls">
                            <Button
                                variant="primary"
                                onClick={() => setShowInactive(!showInactive)}
                                style={{ marginBottom: '10px', marginTop: '10px' }}
                            >
                                {showInactive ? 'Show Active Employees' : 'Show Inactive Employees'}
                            </Button>
                        </div>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Active</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Added Date</th>
                                    <th>Role</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.map((employee) => (
                                    <tr key={employee.employee_id}>
                                        <td>{employee.active_employee ? "Yes" : "No"}</td>
                                        <td>{employee.employee_first_name}</td>
                                        <td>{employee.employee_last_name}</td>
                                        <td>{employee.employee_email}</td>
                                        <td>{employee.employee_phone}</td>
                                        <td>{isValidDate(employee.added_date) ? format(new Date(employee.added_date), 'MM-dd-yyyy | kk:mm') : 'N/A'}</td>
                                        <td>{employee.company_role_name}</td>
                                        <td>
                                            <Button
                                                variant="warning"
                                                size="sm"
                                                style={{ width: '55px', marginBottom: '5px', borderRadius: '5px', marginRight: '5px' }}
                                                onClick={() => handleEdit(employee)}
                                            >
                                                Edit
                                            </Button> 
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </section>
            )}

            {currentEmployee && (
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Employee</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="employeeEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="employee_email"
                                    value={currentEmployee.employee_email}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="employeeFirstName">
                                <Form.Label>First Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="employee_first_name"
                                    value={currentEmployee.employee_first_name}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="employeeLastName">
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="employee_last_name"
                                    value={currentEmployee.employee_last_name}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="employeePhone">
                                <Form.Label>Phone</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="employee_phone"
                                    value={currentEmployee.employee_phone}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="employeeRole">
                                <Form.Label>Role</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="company_role_id"
                                    value={currentEmployee.company_role_id}
                                    onChange={handleChange}
                                >
                                    <option value="1">Employee</option>
                                    <option value="2">Manager</option>
                                    <option value="3">Admin</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="activeEmployee">
                                <Form.Check
                                    type="checkbox"
                                    label="Active Employee"
                                    checked={currentEmployee.active_employee === 1}
                                    onChange={(e) => setCurrentEmployee({ ...currentEmployee, active_employee: e.target.checked ? 1 : 0 })}
                                    style={{ textAlign: 'center' }} // Center the checkbox
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleSave}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </>
    );
}

export default EmployeesList;