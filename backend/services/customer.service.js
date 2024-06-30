const conn = require("../config/db.config");
const { v4: uuidv4 } = require('uuid');

// Get all customers
async function getAllCustomers(limit, sortby) {
    let query = "SELECT * FROM customer_identifier INNER JOIN customer_info ON customer_identifier.customer_id = customer_info.customer_id";
    if (sortby) {
        query += ` ORDER BY ${sortby}`;
    }
    if (limit) {
        query += ` LIMIT ${limit}`;
    }
    const [rows] = await conn.query(query);
    return rows;
}

// Get a single customer by ID
async function getCustomerById(customerId) {
    const query = "SELECT * FROM customer_identifier INNER JOIN customer_info ON customer_identifier.customer_id = customer_info.customer_id WHERE customer_identifier.customer_id = ?";
    const [rows] = await conn.query(query, [customerId]);
    return rows;
}

// Add a new customer
async function addCustomer(customerData) {
    // Use the uuid to do random customer hash
    const customerHash = uuidv4(); // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
    const query = "INSERT INTO customer_identifier (customer_email, customer_phone_number, customer_hash) VALUES (?, ?, ?)";
    const result = await conn.query(query, [customerData.customer_email, customerData.customer_phone_number, customerHash]);
    const customerId = result.insertId;
    const query2 = "INSERT INTO customer_info (customer_id, customer_first_name, customer_last_name, active_customer_status) VALUES (?, ?, ?, ?)";
    await conn.query(query2, [customerId, customerData.customer_first_name, customerData.customer_last_name, customerData.active_customer_status]);
    return { customer_id: customerId, ...customerData };
}

// Update an existing customer
async function updateCustomer(customerId, customerData) {
    const customerIdentifier = await getCustomerById(customerId)
    let result = null;
    const query = "UPDATE customer_identifier SET customer_email = ?, customer_phone_number = ? WHERE customer_id = ?";
    result = await conn.query(query, [
        customerData.customer_email != customerIdentifier.customer_email ? customerData.customer_email : customerIdentifier.customer_email,
        customerData.customer_phone_number != customerIdentifier.customer_phone_number ? customerData.customer_phone_number : customerIdentifier.customer_phone_number,
        customerId]); 
    const query2 = "UPDATE customer_info SET customer_first_name = ?, customer_last_name = ?, active_customer_status = ? WHERE customer_id = ?";
    await conn.query(query2, [customerData.customer_first_name, customerData.customer_last_name, customerData.active_customer_status, customerId]);
    if (result.affectedRows === 0) {
        return null;
    }
    return { customer_id: customerId, ...customerData };
}

module.exports = {
    getAllCustomers,
    getCustomerById,
    addCustomer,
    updateCustomer
};
