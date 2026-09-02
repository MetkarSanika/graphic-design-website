import { FaWhatsapp } from "react-icons/fa";

function WhatsAppButton() {

  const whatsappNumber = "918010081477";

  const message =
    "Hello Sarang Graphics 👋 I would like to discuss a design project.";

  const whatsappURL =
    `https://wa.me/${whatsappNumber}?text=` +
    encodeURIComponent(message);

  return (
    <a
      href={whatsappURL}
      target="_blank"
      rel="noreferrer"
      className="floating-whatsapp"
      aria-label="Contact Sarang Graphics on WhatsApp"
    >
      <span className="whatsapp-icon">
        <FaWhatsapp />
      </span>

      <span className="whatsapp-text">
        WhatsApp
      </span>
    </a>
  );
}

export default WhatsAppButton;