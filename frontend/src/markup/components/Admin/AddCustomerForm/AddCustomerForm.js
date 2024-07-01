import React, { useState } from 'react';
import orderService from '../../../../services/order.service';
import { useAuth } from "../../../../Contexts/AuthContext";

function AddCustomerForm() {
  const [employee_id, setEmployeeId] = useState('');
  const [customer_id, setCustomerId] = useState('');
  const [vehicle_id, setVehicleId] = useState('');
  const [order_description, setOrderDescription] = useState('');
  const [order_total_price, setOrderTotalPrice] = useState('');
  const [active_order, setActiveOrder] = useState(1);
  const [estimated_completion_date, setEstimatedCompletionDate] = useState('');
  const [completion_date, setCompletionDate] = useState('');
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  let loggedInEmployeeToken = '';
  const { employee } = useAuth();
  if (employee && employee.employee_token) {
    loggedInEmployeeToken = employee.employee_token;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      employee_id,
      customer_id,
      vehicle_id,
      order_description,
      order_total_price: parseFloat(order_total_price),
      active_order,
      estimated_completion_date,
      completion_date
    };
    
    const newOrder = orderService.createOrder(formData, loggedInEmployeeToken);
    newOrder.then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setServerError(data.error)
        } else {
          setSuccess(true);
          setServerError('')
          setTimeout(() => {
            window.location.href = '/admin/orders';
          }, 2000);
        }
      })
      .catch((error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setServerError(resMessage);
      });
  }

  return (
    <section className="contact-section">
      <div className="auto-container">
        <div className="contact-title">
          <h2>Add a new order</h2>
        </div>
        <div className="row clearfix">
          <div className="form-column col-lg-7">
            <div className="inner-column">
              <div className="contact-form">
                <form onSubmit={handleSubmit}>
                  <div className="row clearfix">
                    <div className="form-group col-md-12">
                      {serverError && <div className="validation-error" role="alert">{serverError}</div>}
                      <input type="text" name="employee_id" value={employee_id} onChange={event => setEmployeeId(event.target.value)} placeholder="Employee ID" required />
                    </div>
                    <div className="form-group col-md-12">
                      <input type="text" name="customer_id" value={customer_id} onChange={event => setCustomerId(event.target.value)} placeholder="Customer ID" required />
                    </div>
                    <div className="form-group col-md-12">
                      <input type="text" name="vehicle_id" value={vehicle_id} onChange={event => setVehicleId(event.target.value)} placeholder="Vehicle ID" required />
                    </div>
                    <div className="form-group col-md-12">
                      <textarea name="order_description" value={order_description} onChange={event => setOrderDescription(event.target.value)} placeholder="Order Description" required></textarea>
                    </div>
                    <div className="form-group col-md-12">
                      <input type="number" name="order_total_price" value={order_total_price} onChange={event => setOrderTotalPrice(event.target.value)} placeholder="Order Total Price" required />
                    </div>
                    <div className="form-group col-md-12">
                      <input type="date" name="estimated_completion_date" value={estimated_completion_date} onChange={event => setEstimatedCompletionDate(event.target.value)} placeholder="Estimated Completion Date" required />
                    </div>
                    <div className="form-group col-md-12">
                      <input type="date" name="completion_date" value={completion_date} onChange={event => setCompletionDate(event.target.value)} placeholder="Completion Date" required />
                    </div>
                    <div className="form-group col-md-12">
                      <button className="theme-btn btn-style-one" type="submit" data-loading-text="Please wait..."><span>Add Order</span></button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default AddCustomerForm;
