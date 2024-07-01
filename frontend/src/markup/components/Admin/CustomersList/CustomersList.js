import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { useAuth } from "../../../../Contexts/AuthContext";
import customerService from "../../../../services/customer.service";
import { format } from 'date-fns';

const CustomersList = () => {
    const [customers, setCustomers] = useState([]);
    const [apiError, setApiError] = useState(false);
    const [apiErrorMessage, setApiErrorMessage] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [currentCustomer, setCurrentCustomer] = useState(null);
    const [showInactive, setShowInactive] = useState(false);
    const { employee } = useAuth();
    let token = null;
    if (employee) {
        token = employee.employee_token;
    }

    const fetchCustomers = async (token, showInactive, setApiError, setApiErrorMessage, setCustomers) => {
        try {
            const response = await customerService.getAllCustomers(token, showInactive ? 0 : 1);
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
                setCustomers(data.customers || []);
            }
        } catch (error) {
            setApiError(true);
            setApiErrorMessage("An error occurred while fetching customers");
        }
    };

    useEffect(() => {
        fetchCustomers(token, showInactive, setApiError, setApiErrorMessage, setCustomers);
    }, [token, showInactive]);

    const handleEdit = (customer) => {
        setCurrentCustomer(customer);
        setShowModal(true);
    };

    const handleSave = async () => {
        try {
            const token = employee?.employee_token;
            const customerId = currentCustomer.customer_id;

            const formData = {
                customer_first_name: currentCustomer.customer_first_name,
                customer_last_name: currentCustomer.customer_last_name,
                customer_email: currentCustomer.customer_email,
                customer_phone_number: currentCustomer.customer_phone_number,
                active_customer_status: currentCustomer.active_customer_status
            };

            const response = await customerService.updateCustomer(customerId, formData, token);

            if (response.ok) {
                const updatedCustomer = await response.json();
                await fetchCustomers(token, showInactive, setApiError, setApiErrorMessage, setCustomers);
            } else {
                const errorData = await response.json();
                console.error("Failed to update customer", errorData);
            }
        } catch (error) {
            console.error("An error occurred while updating the customer", error);
        } finally {
            setShowModal(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentCustomer(prevState => ({
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
                            <h2>Customers</h2>
                        </div>
                        <div className="customer-controls">
                            <Button
                                variant="primary"
                                onClick={() => setShowInactive(!showInactive)}
                                style={{ marginLeft: '10px', marginTop: '10px' }}
                            >
                                {showInactive ? 'Show Active Customers' : 'Show Inactive Customers'}
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
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customers.map((customer) => (
                                    <tr key={customer.customer_id}>
                                        <td>{customer.active_customer_status ? "Yes" : "No"}</td>
                                        <td>{customer.customer_first_name}</td>
                                        <td>{customer.customer_last_name}</td>
                                        <td>{customer.customer_email}</td>
                                        <td>{customer.customer_phone_number}</td>
                                        <td>{isValidDate(customer.customer_added_date) ? format(new Date(customer.customer_added_date), 'MM-dd-yyyy | kk:mm') : 'N/A'}</td>
                                        <td>
                                            <Button
                                                variant="warning"
                                                size="sm"
                                                style={{ width: '55px', marginBottom: '5px', borderRadius: '5px', marginRight: '5px' }}
                                                onClick={() => handleEdit(customer)}
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

            {currentCustomer && (
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Customer</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="customerFirstName">
                                <Form.Label>First Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="customer_first_name"
                                    value={currentCustomer.customer_first_name}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="customerLastName">
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="customer_last_name"
                                    value={currentCustomer.customer_last_name}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="customerEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="customer_email"
                                    value={currentCustomer.customer_email}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="customerPhoneNumber">
                                <Form.Label>Phone</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="customer_phone_number"
                                    value={currentCustomer.customer_phone_number}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="activeCustomerStatus">
                                <Form.Check
                                    type="checkbox"
                                    label="Active Customer"
                                    checked={currentCustomer.active_customer_status === 1}
                                    onChange={(e) => setCurrentCustomer({ ...currentCustomer, active_customer_status: e.target.checked ? 1 : 0 })}
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

export default CustomersList;
