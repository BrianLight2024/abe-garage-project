import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { useAuth } from "../../../../Contexts/AuthContext";
import orderService from "../../../../services/order.service";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';
import "../../../../assets/styles/custom.css"

const OrdersList = () => {
    const [orders, setOrders] = useState([]);
    const [apiError, setApiError] = useState(false);
    const [apiErrorMessage, setApiErrorMessage] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [currentOrder, setCurrentOrder] = useState(null);
    const [limit, setLimit] = useState(10);
    const [showCompleted, setShowCompleted] = useState(false);
    const { employee } = useAuth();
    let token = null;
    if (employee) {
        token = employee.employee_token;
    }

    const fetchOrders = async () => {
        try {
            const response = await orderService.getAllOrders(token, limit, showCompleted ? 0 : 1);
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
                setOrders(data.data || []);
            }
        } catch (error) {
            setApiError(true);
            setApiErrorMessage("An error occurred while fetching orders");
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [token, limit, showCompleted]);

    const handleEdit = (order) => {
        setCurrentOrder(order);
        setShowModal(true);
    };

    const handleDelete = async (orderId) => {
        try {
            const response = await orderService.deleteOrder(orderId, token);
            const data = await response.json();
            if (data.status === 'success') {
                setOrders(orders.filter(order => order.order_id !== orderId));
            } else {
                console.error('Failed to delete order');
            }
        } catch (err) {
            console.error('Failed to delete order', err);
        }
    };

    const handleSave = async () => {
        try {
            const orderId = currentOrder.order_id;
            const formData = {
                employee_id: currentOrder.employee_id,
                customer_id: currentOrder.customer_id,
                vehicle_id: currentOrder.vehicle_id,
                order_description: currentOrder.order_description,
                estimated_completion_date: currentOrder.estimated_completion_date ? new Date(currentOrder.estimated_completion_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                completion_date: currentOrder.completion_date ? new Date(currentOrder.completion_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                active_order: currentOrder.active_order,
                order_total_price: parseInt(currentOrder.order_total_price)
            };

            const response = await orderService.updateOrder(orderId, formData, token);

            if (response.ok) {
                const updatedOrder = await response.json();
                await fetchOrders();
            } else {
                const errorData = await response.json();
                console.error("Failed to update order", errorData);
            }
        } catch (error) {
            console.error("An error occurred while updating the order", error);
        } finally {
            setShowModal(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentOrder(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleChangeDate = (date, field) => {
        setCurrentOrder(prevState => ({
            ...prevState,
            [field]: date.toISOString().split('T')[0]
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
                            <h2>Orders</h2>
                        </div>
                        <div className="order-controls">
                            <Form.Group controlId="limit">
                                <Form.Label>Number of records to Show</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={limit}
                                    onChange={(e) => setLimit(parseInt(e.target.value, 10))}
                                    min="1"
                                    className="form-control"
                                />
                            </Form.Group>
                            <Button
                                variant="primary"
                                onClick={() => setShowCompleted(!showCompleted)}
                                style={{ marginBottom: '10px', marginTop: '10px' }}
                            >
                                {showCompleted ? 'Show Active Orders' : 'Show Completed Orders'}
                            </Button>
                        </div>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Employee ID</th>
                                    <th>Customer ID</th>
                                    <th>Vehicle ID</th>
                                    <th>Description</th>
                                    <th>Order Date</th>
                                    <th>Estimated Completion Date</th>
                                    <th>Completion Date</th>
                                    <th>Order Completed</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.order_id}>
                                        <td>{order.order_id}</td>
                                        <td>{order.employee_id}</td>
                                        <td>{order.customer_id}</td>
                                        <td>{order.vehicle_id}</td>
                                        <td>{order.order_description}</td>
                                        <td>{format(new Date(order.order_date), 'MM-dd-yyyy | kk:mm')}</td>
                                        <td>{order.estimated_completion_date ? format(new Date(order.estimated_completion_date), 'MM-dd-yyyy | kk:mm') : 'N/A'}</td>
                                        <td>{order.completion_date ? format(new Date(order.completion_date), 'MM-dd-yyyy | kk:mm') : 'N/A'}</td>
                                        <td>{order.active_order ? 'No' : 'Yes'}</td>
                                        <td>
                                            <Button
                                                variant="warning"
                                                size="sm"
                                                style={{ width: '55px', marginBottom: '5px', borderRadius: '5px', marginRight: '5px' }}
                                                onClick={() => handleEdit(order)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                style={{ borderRadius: '5px' }}
                                                onClick={() => handleDelete(order.order_id)}
                                            >
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </section>
            )}

            {currentOrder && (
                <Modal show={showModal} style={{ marginTop: '150px' }} onHide={() => setShowModal(false)} >
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Order</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="orderDescription" style={{ margin: '10px 0px' }}>
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="order_description"
                                    value={currentOrder.order_description}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </Form.Group>
                            <Form.Group controlId="estimatedCompletionDate" style={{ margin: '10px 0px' }}>
                                <Form.Label>Estimated Completion Date</Form.Label>
                                <DatePicker
                                    selected={currentOrder.estimated_completion_date ? new Date(currentOrder.estimated_completion_date) : null}
                                    onChange={(date) => handleChangeDate(date, 'estimated_completion_date')}
                                    dateFormat="yyyy-MM-dd"
                                    className="form-control"
                                />
                            </Form.Group>
                            <Form.Group controlId="completionDate" style={{ margin: '10px 0px' }}>
                                <Form.Label>Completion Date</Form.Label>
                                <DatePicker
                                    selected={currentOrder.completion_date ? new Date(currentOrder.completion_date) : null}
                                    onChange={(date) => handleChangeDate(date, 'completion_date')}
                                    dateFormat="yyyy-MM-dd"
                                    className="form-control"
                                />
                            </Form.Group>
                            <Form.Group controlId="orderTotalPrice" style={{ margin: '10px 0px' }}>
                                <Form.Label>Order Total Price</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={currentOrder.order_total_price || ''}
                                    onChange={(e) => setCurrentOrder({ ...currentOrder, order_total_price: e.target.value })}
                                    className="form-control"
                                />
                            </Form.Group>
                            <Form.Group controlId="activeOrder" >
                                <Form.Check
                                    type="checkbox"
                                    label="Order Completed"
                                    checked={currentOrder.active_order === 0}
                                    onChange={(e) => setCurrentOrder({ ...currentOrder, active_order: e.target.checked ? 0 : 1 })}
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

export default OrdersList;
