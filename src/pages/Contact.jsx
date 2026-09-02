import { useEffect, useState } from "react";

function Contact() {

  useEffect(() => {
  const params = new URLSearchParams(
    window.location.search
  );

  const selectedService =
    params.get("service");

  if (selectedService) {
    setFormData((previous) => ({
      ...previous,
      service: selectedService,
    }));
  }
}, []);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });


  // ================================
  // HANDLE INPUT CHANGE
  // ================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  // ================================
  // SUBMIT FORM
  // ================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      // ================================
      // SAVE DATA TO MYSQL DATABASE
      // ================================

      const response = await fetch(
        "http://localhost:5000/api/contact",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(formData),
        }
      );


      const data = await response.json();


      // DATABASE ERROR

      if (!response.ok) {

        alert(
          data.message ||
          "Unable to submit your request."
        );

        return;
      }


      // ================================
      // WHATSAPP MESSAGE
      // ================================

      const whatsappNumber = "918010081477";


      const whatsappMessage = `
Hello Sarang Graphics 👋

I would like to start a project.

Name: ${formData.name}

Email: ${formData.email}

Phone: ${formData.phone}

Service: ${formData.service}

Project Details:
${formData.message}

Thank you.
`;


      const whatsappURL =
        `https://wa.me/${whatsappNumber}?text=` +
        encodeURIComponent(whatsappMessage);


      // OPEN WHATSAPP

      window.open(
        whatsappURL,
        "_blank"
      );


      // ================================
      // CLEAR FORM
      // ================================

      setFormData({
        name: "",
        email: "",
        phone: "",
        service: "",
        message: "",
      });


    } catch (error) {

      console.error(
        "Server Error:",
        error
      );

      alert(
        "Unable to connect to the server. Please make sure your backend is running."
      );

    }

  };


  return (

    <div className="contact-page">


      {/* ================================
          HEADER
      ================================= */}

  <section className="page-hero contact-page-hero">

  <div className="page-hero-content">

    <span className="page-hero-label">
      ✦ LET'S CREATE
    </span>

    <h1>
      Have an idea?
      <br />
      <span>Let's make it real.</span>
    </h1>

    <p>
      Tell us about your project, and let's create
      something meaningful for your brand.
    </p>

  </div>

  <div className="page-hero-shape contact-shape">
    <span>HELLO</span>
  </div>

</section>


      {/* ================================
          CONTACT LAYOUT
      ================================= */}

      <div className="contact-layout">


        {/* ================================
            CONTACT DETAILS
        ================================= */}

        <div className="contact-details">

          <h2>
            Contact Us
          </h2>


          <p>

            We're available for logo design, social media
            designs, posters, banners, branding and other
            creative design projects.

          </p>



          {/* EMAIL */}

          <div className="contact-detail">

            <span>
              EMAIL
            </span>


            <a href="mailto:sarangprinters625@gmail.com">
              sarangprinters625@gmail.com
            </a>

          </div>



          {/* PHONE */}

          <div className="contact-detail">

            <span>
              PHONE
            </span>


            <a href="tel:+918010081477">
              +91 8010081477
            </a>

          </div>

          {/* ADDRESS */}

<div className="contact-detail">

  <span>
    ADDRESS
  </span>

  <p>
    Nagnath mandir road,Near Deshmukh Hospital,Sengoan,Hingoli, Maharashtra, India
  </p>

</div>



          {/* INSTAGRAM */}

          <div className="contact-detail">

            <span>
              INSTAGRAM
            </span>


            <a
              href="https://instagram.com/"
              target="_blank"
              rel="noreferrer"
            >
              Sarang_gfx_2114
            </a>

          </div>



          {/* WHATSAPP */}

          <div className="contact-detail">

            <span>
              WHATSAPP
            </span>


            <a
              href="https://wa.me/918010081477"
              target="_blank"
              rel="noreferrer"
            >
              Chat on WhatsApp →
            </a>

          </div>

        </div>



        {/* ================================
            CONTACT FORM
        ================================= */}

        <div className="contact-form">


          <h2>
            Start a Project
          </h2>


          <p>

            Fill in the details and send your project
            request directly to WhatsApp.

          </p>



          <form onSubmit={handleSubmit}>


            {/* ================================
                NAME
            ================================= */}

            <div className="form-group">

              <label>
                Your Name
              </label>


              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />

            </div>



            {/* ================================
                EMAIL
            ================================= */}

            <div className="form-group">

              <label>
                Email Address
              </label>


              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />

            </div>



            {/* ================================
                PHONE
            ================================= */}

            <div className="form-group">

              <label>
                Phone Number
              </label>


              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                required
              />

            </div>



            {/* ================================
                SERVICE
            ================================= */}

            <div className="form-group">

              <label>
                What do you need?
              </label>


              <select
                name="service"
                value={formData.service}
                onChange={handleChange}
                required
              >

                <option value="">
                  Select a service
                </option>


                <option value="Logo Design">
                  Logo Design
                </option>


                <option value="Social Media Design">
                  Social Media Design
                </option>


                <option value="Poster Design">
                  Poster Design
                </option>


                <option value="Banner Design">
                  Banner Design
                </option>


                <option value="Branding">
                  Branding
                </option>


                <option value="Flyer & Brochure Design">
                  Flyer & Brochure Design
                </option>


                <option value="Website Development">
                  Website Development
                </option>


                <option value="Other">
                  Other
                </option>

              </select>

            </div>



            {/* ================================
                MESSAGE
            ================================= */}

            <div className="form-group">

              <label>
                Project Details
              </label>


              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="6"
                placeholder="Tell us about your project..."
                required
              ></textarea>

            </div>



            {/* ================================
                SUBMIT
            ================================= */}

            <button
              type="submit"
              className="whatsapp-submit-button"
            >

              Send Request on WhatsApp →

            </button>


          </form>

        </div>

      </div>

    </div>

  );

}

export default Contact;