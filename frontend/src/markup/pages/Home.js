import React from 'react';
import '../../assets/styles/HomeDashboard.css';

function Home() {
  return (
    <div className="home-container">
      <section className="home-section">
        <div className="home-title">
          <h1>Welcome to Abe Garage</h1>
          <p>Your one-stop solution for all vehicle needs. Explore the services and manage your activities with ease.</p>
        </div>
        <div className="home-content">
          <div className="home-card">
            <h2>Customer Services</h2>
            <div className="home-services">
              <div className="service-box">
                <h3>Schedule Appointments</h3>
                <p>Book your service appointments easily through our platform.</p>
              </div>
              <div className="service-box">
                <h3>Order History</h3>
                <p>Access your complete service and order history at any time.</p>
              </div>
              <div className="service-box">
                <h3>Service Updates</h3>
                <p>Get real-time updates on the status of your vehicle's service.</p>
              </div>
              <div className="service-box">
                <h3>Customer Support</h3>
                <p>Contact our support team for any queries or assistance.</p>
              </div>
            </div>
          </div>
          <div className="home-card">
            <h2>Admin Services</h2>
            <div className="home-services">
              <div className="service-box">
                <h3>Manage Employees</h3>
                <p>Add, edit, and manage employee information and roles.</p>
              </div>
              <div className="service-box">
                <h3>Customer Management</h3>
                <p>Handle customer information and service requests efficiently.</p>
              </div>
              <div className="service-box">
                <h3>Order Management</h3>
                <p>Oversee service orders and their statuses in real-time.</p>
              </div>
              <div className="service-box">
                <h3>Service Management</h3>
                <p>Manage all services offered by the garage, including updates and additions.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
