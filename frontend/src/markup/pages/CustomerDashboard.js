import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { useAuth } from "../../Contexts/AuthContext";
import customerService from "../../services/customer.service";
import "../../assets/styles/CustomerDashboard.css";
import getAuth from "../../util/auth";

const CustomerDashboard = () => {
  const { customer } = useAuth();
  const [orders, setOrders] = useState([]);
  const [apiError, setApiError] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState("");

  const fetchCustomerOrders = async () => {
    const customer = await getAuth();
    if (customer && customer.employee_id) {
      try {
        const response = await customerService.getCustomerOrders(
          customer.employee_id
        );
        if (!response.ok) {
          setApiError(true);
          setApiErrorMessage("Failed to fetch orders");
        } else {
          const data = await response.json();
          setOrders(data.data || []);
        }
      } catch (error) {
        setApiError(true);
        setApiErrorMessage("An error occurred while fetching orders");
      }
    }
  };

  useEffect(() => {
    fetchCustomerOrders();
  }, [customer]);

  const isValidDate = (date) => {
    return !isNaN(Date.parse(date));
  };

  return (
    <section className="contact-section">
      <div className="auto-container">
        <div className="contact-title">
          <h2>Your Orders</h2>
        </div>
        {apiError ? (
          <div className="error-message">{apiErrorMessage}</div>
        ) : (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Description</th>
                <th>Order Date</th>
                <th>Estimated Completion Date</th>
                <th>Completion Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.order_id}
                  className={
                    order.active_order ? "pending-order" : "completed-order"
                  }
                >
                  <td>{order.order_id}</td>
                  <td>{order.order_description}</td>
                  <td>
                    {isValidDate(order.order_date)
                      ? new Date(order.order_date).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td>
                    {isValidDate(order.estimated_completion_date)
                      ? new Date(
                          order.estimated_completion_date
                        ).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td>
                    {order.completion_date
                      ? new Date(order.completion_date).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td>{order.active_order ? "Pending" : "Completed"}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </section>
  );
};

export default CustomerDashboard;
