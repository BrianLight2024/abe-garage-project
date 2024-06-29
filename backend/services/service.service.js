const conn = require("../config/db.config");

// Get all services
async function getAllServices() {
    const query = "SELECT * FROM common_services WHERE active_service = 1";
    const [rows] = await conn.query(query);
    return rows;
}

// Get a single service by ID
async function getServiceById(serviceId) {
    const query = "SELECT * FROM common_services WHERE service_id = ?";
    const [rows] = await conn.query(query, [serviceId]);
    return rows;
}

// Add a new service
async function addService(serviceData) {
    const query = "INSERT INTO common_services (service_name, service_description, active_service) VALUES (?, ?, 1)"; // the service is active by default 
    const result = await conn.query(query, [serviceData.service_name, serviceData.service_description]);
    return { service_id: result.insertId, ...serviceData };
}

// Update an existing service
async function updateService(serviceId, serviceData) {
    const query = "UPDATE common_services SET service_name = ?, service_description = ?, active_service = ?  WHERE service_id = ?";
    const result = await conn.query(query, [serviceData.service_name, serviceData.service_description, serviceData.active_service, serviceId]);
    if (result.affectedRows === 0) {
        return null;
    }
    return { service_id: serviceId, ...serviceData };
}

module.exports = {
    getAllServices,
    getServiceById,
    addService,
    updateService
};
