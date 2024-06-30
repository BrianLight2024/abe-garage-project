import React from 'react';
import '../../assets/styles/Services.css';

const services = [
  { title: "Valet Parking", description: "Convenient valet parking services for all our customers." },
  { title: "Auto Body", description: "Professional auto body services to restore your vehicle." },
  { title: "Auto Repair", description: "Expert auto repair services to keep your vehicle running smoothly." },
  { title: "Car Washes", description: "Premium car washes to keep your vehicle looking like new." },
  { title: "Fluid Services", description: "Comprehensive fluid services for optimal vehicle performance." },
  { title: "Wrecking Yard", description: "Efficient wrecking yard services for end-of-life vehicles." },
  { title: "Car Dealership", description: "Wide selection of new and used cars at our dealership." },
  { title: "Glass Installers", description: "Professional glass installation for all types of vehicles." },
  { title: "Impound Yards", description: "Secure impound yards for vehicle storage and retrieval." },
];

function Services() {
  return (
    <div className="services-container">
      <section className="services-header">
        <h1>Our Services</h1>
        <p>Explore the wide range of services we offer to our valued customers.</p>
      </section>
      <section className="services-content">
        <div className="services-grid">
          {services.map((service, index) => (
            <div className="service-card" key={index}>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Services;
