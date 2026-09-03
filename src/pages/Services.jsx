import { Link } from "react-router-dom";

function Services() {
  const services = [
    {
      number: "01",
      title: "Logo Design",
      text: "Creative and professional logos for your business.",
    },
    {
      number: "02",
      title: "Brand Identity",
      text: "Complete branding to give your business a unique identity.",
    },
    {
      number: "03",
      title: "Social Media Design",
      text: "Attractive posts, stories and advertisements for social media.",
    },
    {
      number: "04",
      title: "Poster Design",
      text: "Creative posters for events, businesses and promotions.",
    },
    {
      number: "05",
      title: "Banner Design",
      text: "Professional banners for websites and advertising.",
    },
    {
      number: "06",
      title: "Business Card",
      text: "Simple and professional business card designs.",
    },
  ];

  return (
    <div className="simple-services">

      <div className="services-heading">
        <p>OUR SERVICES</p>
        <h1>Creative Design Services</h1>
        <span>
          We create simple, creative and professional designs
          for your business.
        </span>
      </div>

      <div className="services-container">

        {services.map((service) => (
          <div className="service-box" key={service.number}>

            <div className="service-number">
              {service.number}
            </div>

            <div>
              <h2>{service.title}</h2>
              <p>{service.text}</p>
            </div>

            <div className="service-arrow">
              →
            </div>

          </div>
        ))}

      </div>

      <div className="services-contact">
        <h2>Need a design for your business?</h2>
        <p>Let's create something great together.</p>

        <Link to="/contact">
          Contact Us →
        </Link>
      </div>

    </div>
  );
}

export default Services;