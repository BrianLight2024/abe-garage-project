import React from 'react';
import '../../assets/styles/About.css';
import bannerImage from '../../assets/images/banner/banner.jpg';

function About() {
  return (
    <div className="about-container">
      <section className="about-banner">
        <img src={bannerImage} alt="About Us Banner" className="banner-image" />
        <div className="banner-text">
          <h1>About Abe Garage</h1>
        </div>
      </section>
      <section className="about-content">
        <div className="story-section">
          <h2>Our Story</h2>
          <p>
            Abe Garage started with a simple idea: to provide top-notch auto repair services with a focus on customer satisfaction. Over the years, we have grown into a trusted name in the industry, thanks to our dedicated team of professionals who go above and beyond to ensure your vehicle is in the best possible hands.
          </p>
        </div>
        <div className="mission-section">
          <h2>Our Mission</h2>
          <p>
            Our mission is to deliver high-quality auto repair services that you can rely on. We believe in transparency, integrity, and building long-lasting relationships with our customers. At Abe Garage, we are committed to keeping you safe on the road and ensuring your vehicle runs smoothly.
          </p>
        </div>
        <div className="values-section">
          <h2>Our Values</h2>
          <ul>
            <li><strong>Customer Satisfaction:</strong> We prioritize our customers and strive to exceed their expectations with every service.</li>
            <li><strong>Quality Workmanship:</strong> Our skilled technicians use the latest technology and techniques to provide top-quality repairs.</li>
            <li><strong>Integrity:</strong> We operate with honesty and transparency, ensuring you understand every step of the repair process.</li>
            <li><strong>Community:</strong> We believe in giving back to the community that has supported us throughout the years.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

export default About;
