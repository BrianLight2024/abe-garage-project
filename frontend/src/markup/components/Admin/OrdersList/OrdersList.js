import React, { useState, useEffect } from "react";
import { Table, Button } from 'react-bootstrap';
import { useAuth } from "../../../../Contexts/AuthContext";
import orderService from "../../../../services/order.service";
import { format } from 'date-fns'; // Import date-fns for formatting dates

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [apiError, setApiError] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState(null);
  const { employee } = useAuth();
  let token = null;
  if (employee) {
    token = employee.employee_token;
  }

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await orderService.getAllOrders(token, 1); // Fetch only active orders (active_order = 1)
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

    fetchOrders();
  }, [token]);

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
                      <Button variant="warning" size="sm" onClick={() => handleEdit(order.order_id)}>Edit</Button>
                      {' '}
                      <Button variant="danger" size="sm" onClick={() => handleDelete(order.order_id)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </section>
      )}
    </>
  );

  function handleEdit(orderId) {
    // Handle the edit functionality here
    console.log(`Edit order with ID: ${orderId}`);
    // Navigate to edit page or show edit modal
  }

  function handleDelete(orderId) {
    // Handle the delete functionality here
    console.log(`Delete order with ID: ${orderId}`);
    // Call the delete API or show confirmation modal
  }
};

export default OrdersList;
