import React, { useState } from 'react';
import '../../assets/styles/Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(formData);
  };

  return (
    <div className="contact-container">
      <section className="contact-header">
        <h1>Contact Us</h1>
        <p>We'd love to hear from you. Please reach out with any questions or comments.</p>
      </section>
      <section className="contact-content">
        <div className="contact-info">
          <div className="contact-item">
            <h3>Our Address</h3>
            <p>54B, Tailstoi Town 5238 MT, La city, IA 522364</p>
          </div>
          <div className="contact-item">
            <h3>Email Us</h3>
            <p>contact@autorex.com</p>
          </div>
          <div className="contact-item">
            <h3>Call Us</h3>
            <p>+ 1800 456 7890</p>
          </div>
        </div>
        <div className="contact-form-container">
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="submit-button">Send Message</button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Contact;
