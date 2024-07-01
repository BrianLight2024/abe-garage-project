import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { useAuth } from "../../../../Contexts/AuthContext";
import serviceService from "../../../../services/service.service"; // Import the service for services
import { format } from 'date-fns';

const ServicesList = () => {
    const [services, setServices] = useState([]);
    const [apiError, setApiError] = useState(false);
    const [apiErrorMessage, setApiErrorMessage] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [currentService, setCurrentService] = useState(null);
    const [showInactive, setShowInactive] = useState(false);
    const { employee } = useAuth();
    let token = null;
    if (employee) {
        token = employee.employee_token;
    }

    const fetchServices = async (token, showInactive, setApiError, setApiErrorMessage, setServices) => {
        try {
            const response = await serviceService.getAllServices(token, showInactive ? 0 : 1);
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
                setServices(data || []);
            }
        } catch (error) {
            setApiError(true);
            setApiErrorMessage("An error occurred while fetching services");
        }
    };

    useEffect(() => {
        fetchServices(token, showInactive, setApiError, setApiErrorMessage, setServices);
    }, [token, showInactive]);

    const handleEdit = (service) => {
        setCurrentService(service);
        setShowModal(true);
    };

    const handleSave = async () => {
        try {
            const token = employee?.employee_token;
            const serviceId = currentService.service_id;

            const formData = {
                service_name: currentService.service_name,
                service_description: currentService.service_description,
                active_service: currentService.active_service,
            };

            const response = await serviceService.updateService(serviceId, formData, token);

            if (response.ok) {
                const updatedService = await response.json();
                await fetchServices(token, showInactive, setApiError, setApiErrorMessage, setServices);
            } else {
                const errorData = await response.json();
                console.error("Failed to update service", errorData);
            }
        } catch (error) {
            console.error("An error occurred while updating the service", error);
        } finally {
            setShowModal(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentService(prevState => ({
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
                            <h2>Services</h2>
                        </div>
                        <div className="service-controls">
                            <Button
                                variant="primary"
                                onClick={() => setShowInactive(!showInactive)}
                                style={{ marginBottom: '10px', marginTop: '10px' }}
                            >
                                {showInactive ? 'Show Active Services' : 'Show Inactive Services'}
                            </Button>
                        </div>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Active</th>
                                    <th>Service Name</th>
                                    <th>Description</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {services.map((service) => (
                                    <tr key={service.service_id}>
                                        <td>{service.active_service ? "Yes" : "No"}</td>
                                        <td>{service.service_name}</td>
                                        <td>{service.service_description}</td>
                                        <td>
                                            <Button
                                                variant="warning"
                                                size="sm"
                                                style={{ width: '55px', marginBottom: '5px', borderRadius: '5px', marginRight: '5px' }}
                                                onClick={() => handleEdit(service)}
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

            {currentService && (
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Service</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="serviceName">
                                <Form.Label>Service Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="service_name"
                                    value={currentService.service_name}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="serviceDescription">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="service_description"
                                    value={currentService.service_description}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="activeService">
                                <Form.Check
                                    type="checkbox"
                                    label="Active Service"
                                    checked={currentService.active_service === 1}
                                    onChange={(e) => setCurrentService({ ...currentService, active_service: e.target.checked ? 1 : 0 })}
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

export default ServicesList;
