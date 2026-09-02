import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Admin() {
  const navigate = useNavigate();

  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [serviceFilter, setServiceFilter] = useState("All");

  const [selectedContact, setSelectedContact] = useState(null);


  // =====================================
  // PROTECT ADMIN PAGE
  // =====================================

  useEffect(() => {
    const loggedIn = localStorage.getItem("adminLoggedIn");

    if (loggedIn !== "true") {
      navigate("/admin-login");
    }
  }, [navigate]);


  // =====================================
  // FETCH CONTACTS
  // =====================================

  const fetchContacts = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/contact"
      );

      const data = await response.json();

      if (response.ok) {
        setContacts(data);
      } else {
        alert(
          data.message ||
          "Unable to load enquiries."
        );
      }

    } catch (error) {
      console.error(error);

      alert(
        "Unable to connect to backend."
      );

    } finally {
      setLoading(false);
    }
  };


  // =====================================
  // LOAD CONTACTS
  // =====================================

  useEffect(() => {
    fetchContacts();
  }, []);


  // =====================================
  // LOGOUT
  // =====================================

  const handleLogout = () => {
    localStorage.removeItem(
      "adminLoggedIn"
    );

    navigate("/admin-login");
  };


  // =====================================
  // DELETE CONTACT
  // =====================================

  const deleteContact = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this enquiry?"
    );

    if (!confirmDelete) {
      return;
    }


    try {

      const response = await fetch(
        `http://localhost:5000/api/contact/${id}`,
        {
          method: "DELETE",
        }
      );


      const data = await response.json();


      if (!response.ok) {

        alert(
          data.message ||
          "Unable to delete enquiry."
        );

        return;
      }


      setContacts(
        (previousContacts) =>
          previousContacts.filter(
            (contact) =>
              contact.id !== id
          )
      );


      // Close details popup if deleted

      if (
        selectedContact &&
        selectedContact.id === id
      ) {
        setSelectedContact(null);
      }


    } catch (error) {

      console.error(error);

      alert(
        "Unable to connect to backend."
      );

    }
  };


  // =====================================
  // SEARCH + FILTER
  // =====================================

  const filteredContacts =
    contacts.filter((contact) => {

      const searchText =
        search.toLowerCase().trim();


      const matchesSearch =
        contact.name
          ?.toLowerCase()
          .includes(searchText) ||

        contact.email
          ?.toLowerCase()
          .includes(searchText) ||

        contact.phone
          ?.toLowerCase()
          .includes(searchText);


      const matchesService =
        serviceFilter === "All" ||
        contact.service === serviceFilter;


      return (
        matchesSearch &&
        matchesService
      );

    });


  // =====================================
  // GET SERVICES
  // =====================================

  const services = [
    ...new Set(
      contacts
        .map(
          (contact) =>
            contact.service
        )
        .filter(Boolean)
    ),
  ];


  // =====================================
  // WHATSAPP LINK
  // =====================================

  const getWhatsAppLink = (phone) => {

    const cleanPhone =
      String(phone || "").replace(
        /\D/g,
        ""
      );


    let whatsappNumber = cleanPhone;


    // If Indian number has 10 digits,
    // add country code 91

    if (
      whatsappNumber.length === 10
    ) {

      whatsappNumber =
        "91" + whatsappNumber;

    }


    return `https://wa.me/${whatsappNumber}`;
  };


  return (

    <div className="admin-page">


      {/* =====================================
          HEADER
      ===================================== */}

      <div className="admin-header">

        <div>

          <span>
            SARANGGRAPHICS
          </span>


          <h1>
            Admin Dashboard
          </h1>


          <p>
            Manage customer project enquiries.
          </p>

        </div>


        <div className="admin-header-buttons">

          <button
            className="admin-refresh-button"
            onClick={fetchContacts}
          >
            ↻ Refresh
          </button>


          <button
            className="admin-logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </div>



      {/* =====================================
          STATISTICS
      ===================================== */}

      <div className="admin-stats">


        {/* TOTAL */}

        <div className="admin-stat-card">

          <span>
            TOTAL ENQUIRIES
          </span>


          <strong>
            {contacts.length}
          </strong>

        </div>



        {/* SERVICES */}

        <div className="admin-stat-card">

          <span>
            SERVICES
          </span>


          <strong>
            {services.length}
          </strong>

        </div>



        {/* SHOWING */}

        <div className="admin-stat-card">

          <span>
            SHOWING
          </span>


          <strong>
            {filteredContacts.length}
          </strong>

        </div>

      </div>



      {/* =====================================
          MAIN CONTENT
      ===================================== */}

      <div className="admin-content">


        {/* HEADER */}

        <div className="admin-content-header">

          <div>

            <span>
              CUSTOMER REQUESTS
            </span>


            <h2>
              Project Enquiries
            </h2>

          </div>

        </div>



        {/* =====================================
            SEARCH + FILTER
        ===================================== */}

        <div className="admin-filters">


          {/* SEARCH */}

          <div className="admin-search">

            <span>
              🔎
            </span>


            <input
              type="text"
              placeholder="Search name, email or phone..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>



          {/* SERVICE FILTER */}

          <select
            className="admin-service-filter"
            value={serviceFilter}
            onChange={(e) =>
              setServiceFilter(e.target.value)
            }
          >

            <option value="All">
              All Services
            </option>


            {services.map(
              (service) => (

                <option
                  key={service}
                  value={service}
                >
                  {service}
                </option>

              )
            )}

          </select>



          {/* RESET */}

          <button
            className="admin-reset-button"
            onClick={() => {
              setSearch("");
              setServiceFilter("All");
            }}
          >
            Reset
          </button>

        </div>



        {/* =====================================
            LOADING
        ===================================== */}

        {loading && (

          <div className="admin-message">

            Loading enquiries...

          </div>

        )}



        {/* =====================================
            NO RESULTS
        ===================================== */}

        {!loading &&
          filteredContacts.length === 0 && (

          <div className="admin-message">

            {contacts.length === 0
              ? "No enquiries found."
              : "No enquiries match your search."}

          </div>

        )}



        {/* =====================================
            TABLE
        ===================================== */}

        {!loading &&
          filteredContacts.length > 0 && (

          <div className="admin-table-wrapper">

            <table className="admin-table">

              <thead>

                <tr>

                  <th>
                    ID
                  </th>

                  <th>
                    Name
                  </th>

                  <th>
                    Email
                  </th>

                  <th>
                    Phone
                  </th>

                  <th>
                    Service
                  </th>

                  <th>
                    Message
                  </th>

                  <th>
                    Date
                  </th>

                  <th>
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredContacts.map(
                  (contact) => (

                  <tr
                    key={contact.id}
                  >


                    {/* ID */}

                    <td>
                      {contact.id}
                    </td>



                    {/* NAME */}

                    <td>

                      <strong>
                        {contact.name}
                      </strong>

                    </td>



                    {/* EMAIL */}

                    <td>

                      <a
                        href={`mailto:${contact.email}`}
                        style={{
                          color: "inherit",
                          textDecoration: "none"
                        }}
                      >
                        {contact.email}
                      </a>

                    </td>



                    {/* PHONE */}

                    <td>

                      <a
                        href={`tel:${contact.phone}`}
                        style={{
                          color: "inherit",
                          textDecoration: "none"
                        }}
                      >
                        {contact.phone}
                      </a>

                    </td>



                    {/* SERVICE */}

                    <td>

                      <span className="service-badge">

                        {contact.service}

                      </span>

                    </td>



                    {/* MESSAGE */}

                    <td className="message-cell">

                      {contact.message}

                    </td>



                    {/* DATE */}

                    <td>

                      {contact.created_at
                        ? new Date(
                            contact.created_at
                          ).toLocaleDateString()
                        : "-"}

                    </td>



                    {/* ACTION */}

                    <td>

                      <div className="admin-action-buttons">


                        {/* VIEW */}

                        <button
                          className="view-button"
                          onClick={() =>
                            setSelectedContact(
                              contact
                            )
                          }
                        >
                          View
                        </button>



                        {/* DELETE */}

                        <button
                          className="delete-button"
                          onClick={() =>
                            deleteContact(
                              contact.id
                            )
                          }
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>



      {/* =====================================
          CONTACT DETAILS MODAL
      ===================================== */}

      {selectedContact && (

        <div
          className="contact-modal-overlay"
          onClick={() =>
            setSelectedContact(null)
          }
        >

          <div
            className="contact-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >


            {/* MODAL HEADER */}

            <div className="contact-modal-header">

              <div>

                <span>
                  ENQUIRY DETAILS
                </span>


                <h2>
                  {selectedContact.name}
                </h2>

              </div>


              <button
                className="modal-close-button"
                onClick={() =>
                  setSelectedContact(null)
                }
              >
                ✕
              </button>

            </div>



            {/* DETAILS */}

            <div className="contact-modal-details">


              {/* EMAIL */}

              <div className="detail-box">

                <span>
                  EMAIL
                </span>


                <strong>
                  {selectedContact.email}
                </strong>

              </div>



              {/* PHONE */}

              <div className="detail-box">

                <span>
                  PHONE
                </span>


                <strong>
                  {selectedContact.phone}
                </strong>

              </div>



              {/* SERVICE */}

              <div className="detail-box">

                <span>
                  SERVICE
                </span>


                <strong>
                  {selectedContact.service}
                </strong>

              </div>



              {/* DATE */}

              <div className="detail-box">

                <span>
                  DATE
                </span>


                <strong>

                  {selectedContact.created_at
                    ? new Date(
                        selectedContact.created_at
                      ).toLocaleString()
                    : "-"}

                </strong>

              </div>

            </div>



            {/* PROJECT DETAILS */}

            <div className="project-details-box">

              <span>
                PROJECT DETAILS
              </span>


              <p>
                {selectedContact.message}
              </p>

            </div>



            {/* ACTION BUTTONS */}

            <div className="contact-modal-actions">


              {/* WHATSAPP */}

              <a
                href={getWhatsAppLink(
                  selectedContact.phone
                )}
                target="_blank"
                rel="noreferrer"
                className="modal-whatsapp-button"
              >
                WhatsApp Customer →
              </a>



              {/* EMAIL */}

              <a
                href={`mailto:${selectedContact.email}`}
                className="modal-email-button"
              >
                Send Email
              </a>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}

export default Admin;