const conn = require('../config/db.config');
const { v4: uuidv4 } = require('uuid');


// Get all orders with optional query parameters for limit, sort, and filter
async function getAllOrders(limit = 10, sortby = 'order_date', activeOrder  = null) {
    let query = "SELECT * FROM orders";
    const params = [];
    console.log(activeOrder)
    if (activeOrder  !== null) {
        query += " WHERE active_order = ?";
        params.push(activeOrder );
    }
    query += ` ORDER BY ${sortby} DESC LIMIT ?`;
    params.push(parseInt(limit, 10));
    console.log(query)
    const rows = await conn.query(query, params);
    return rows;
}

// Get single order by ID
async function getOrderById(orderId) {
    const query = "SELECT * FROM orders WHERE order_id = ?";
    const [rows] = await conn.query(query, [orderId]);
    if (rows.length === 0) return null;

    // Fetch order services
    const servicesQuery = "SELECT * FROM order_services WHERE order_id = ?";
    const [services] = await conn.query(servicesQuery, [orderId]);

    return {
        ...rows,
        order_services: services
    };
}

// Add new order
async function addOrder(orderData) {
    // Use the uuid to do random Order hash
    const orderHash = uuidv4(); // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'

    // Check if employee_id exists
    const employeeRows = await conn.query("SELECT * FROM employee WHERE employee_id = ?", [orderData.employee_id]);
    if (employeeRows.length === 0) {
        throw new Error("Invalid employee_id");
    }

    // Check if customer_id exists
    const customerRows = await conn.query("SELECT * FROM customer_identifier WHERE customer_id = ?", [orderData.customer_id]);
    if (customerRows.length === 0) {
        throw new Error("Invalid customer_id");
    }


    // Check if vehicle_id exists
    const vehicleRows = await conn.query("SELECT * FROM customer_vehicle_info WHERE vehicle_id = ?", [orderData.vehicle_id]);
    if (vehicleRows.length === 0) {
        throw new Error("Invalid vehicle_id");
    }
    console.log("results", orderData)

    const query = "INSERT INTO orders (employee_id, customer_id, vehicle_id, order_description, order_hash, active_order) VALUES (?, ?, ?, ?, ?, ?)";
    const result = await conn.query(query, [
        orderData.employee_id,
        orderData.customer_id,
        orderData.vehicle_id,
        orderData.order_description,
        orderHash,
        orderData.active_order
    ]);
    const orderId = result.insertId;
    console.log("orderId", orderId)

    // Insert into order_info table
    const infoQuery = "INSERT INTO order_info (order_id, order_total_price, estimated_completion_date, completion_date, additional_request, notes_for_internal_use, notes_for_customer, additional_requests_completed) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    await conn.query(infoQuery, [
        orderId,
        orderData.order_total_price,
        orderData.estimated_completion_date || null,
        orderData.completion_date || null,
        orderData.additional_request || null,
        orderData.notes_for_internal_use || null,
        orderData.notes_for_customer || null,
        orderData.additional_requests_completed || 0
    ]);
    console.log("infoQuery", infoQuery)

    // Add order services
    const servicesQuery = "INSERT INTO order_services (order_id, service_id , service_completed) VALUES (?, ? , ? )";
    const servicesData = await conn.query(servicesQuery, [
        orderId,
        orderData.service_id,
        orderData.service_completed
    ]);

    console.log("servicesData", servicesData)


    return { order_id: orderId, ...orderData };
}

// Update existing order
async function updateOrder(orderHash, orderData) {
    const query = "UPDATE orders SET employee_id = ?, customer_id = ?, vehicle_id = ?, order_description = ?, estimated_completion_date = ?, completion_date = ?, active_order = ? WHERE order_hash = ?";
    const result = await conn.query(query, [
        orderData.employee_id,
        orderData.customer_id,
        orderData.vehicle_id,
        orderData.order_description,
        orderData.estimated_completion_date,
        orderData.completion_date,
        orderData.active_order,
        orderHash
    ]);

    if (result.affectedRows === 0) return null;

    // get the Order Id internally
    const queryOrderByHash = "SELECT * FROM orders WHERE order_hash = ?";
    const rows = await conn.query(queryOrderByHash, [order_hash]);
    console.log("Query", rows)
    // Update order services
    if (orderData.order_services && orderData.order_services.length > 0) {
        // Delete existing services
        await conn.query("DELETE FROM order_services WHERE order_id = ?", [rows.order_id]);

        // Add new services
        const servicesQuery = "INSERT INTO order_services (order_id, service_id) VALUES ?";
        const servicesData = orderData.order_services.map(service => [rows.orderId, service.service_id]);
        await conn.query(servicesQuery, [servicesData]);
    }

    return { order_id: rows.orderId, ...orderData };
}

module.exports = {
    getAllOrders,
    getOrderById,
    addOrder,
    updateOrder
};
