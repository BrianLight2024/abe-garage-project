// src/markup/pages/admin/AdminDashboard.js
import React from 'react';
import '../../../assets/styles/AdminDashboard.css';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard-container">
      <h1>Admin Dashboard</h1>
      <p>
        Welcome to the admin dashboard. Here you can manage employees, customers, orders, and services.
        Use the menu on the left to navigate through the different sections of the admin panel.
        Ensure to monitor the activity logs and handle administrative tasks efficiently.
      </p>
      <div className="admin-dashboard-content">
        <div className="admin-section">
          <h2>Employees</h2>
          <p>Manage the employees of the garage, including adding new employees and updating existing ones.</p>
        </div>
        <div className="admin-section">
          <h2>Customers</h2>
          <p>View and manage customer details. Add new customers and update their information as needed.</p>
        </div>
        <div className="admin-section">
          <h2>Orders</h2>
          <p>Track and manage all the orders. Ensure timely completion and update order statuses.</p>
        </div>
        <div className="admin-section">
          <h2>Services</h2>
          <p>Manage the services offered by the garage. Add new services and update existing ones.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
