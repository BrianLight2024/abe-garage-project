import React, { useState } from 'react';
import customerService from '../../../../services/customer.service';
import { useAuth } from "../../../../Contexts/AuthContext";

function AddCustomerForm() {
  const [customer_email, setCustomerEmail] = useState('');
  const [customer_phone_number, setCustomerPhoneNumber] = useState('');
  const [customer_first_name, setCustomerFirstName] = useState('');
  const [customer_last_name, setCustomerLastName] = useState('');
  const [active_customer_status, setActiveCustomerStatus] = useState(1);
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
      customer_email,
      customer_phone_number,
      customer_first_name,
      customer_last_name,
      active_customer_status
    };

    const newCustomer = customerService.createCustomer(formData, loggedInEmployeeToken);
    newCustomer.then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setServerError(data.error)
        } else {
          setSuccess(true);
          setServerError('')
          setTimeout(() => {
            window.location.href = '/admin/customers';
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
          <h2>Add a new customer</h2>
        </div>
        <div className="row clearfix">
          <div className="form-column col-lg-7">
            <div className="inner-column">
              <div className="contact-form">
                <form onSubmit={handleSubmit}>
                  <div className="row clearfix">
                    <div className="form-group col-md-12">
                      {serverError && <div className="validation-error" role="alert">{serverError}</div>}
                      <input type="email" name="customer_email" value={customer_email} onChange={event => setCustomerEmail(event.target.value)} placeholder="Customer Email" required />
                    </div>
                    <div className="form-group col-md-12">
                      <input type="text" name="customer_phone_number" value={customer_phone_number} onChange={event => setCustomerPhoneNumber(event.target.value)} placeholder="Customer Phone Number" required />
                    </div>
                    <div className="form-group col-md-12">
                      <input type="text" name="customer_first_name" value={customer_first_name} onChange={event => setCustomerFirstName(event.target.value)} placeholder="Customer First Name" required />
                    </div>
                    <div className="form-group col-md-12">
                      <input type="text" name="customer_last_name" value={customer_last_name} onChange={event => setCustomerLastName(event.target.value)} placeholder="Customer Last Name" required />
                    </div>
                    <div className="form-group col-md-12">
                      <select name="active_customer_status" value={active_customer_status} onChange={event => setActiveCustomerStatus(event.target.value)} className="custom-select-box">
                        <option value="1">Active</option>
                        <option value="0">Inactive</option>
                      </select>
                    </div>
                    <div className="form-group col-md-12">
                      <button className="theme-btn btn-style-one" type="submit" data-loading-text="Please wait..."><span>Add Customer</span></button>
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
