import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Portfolio from "./pages/Portfolio";
import Contact from "./pages/Contact";

import WhatsAppButton from "./components/WhatsAppButton";
import Footer from "./components/Footer";

import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import PortfolioManager from "./pages/PortfolioManager";

import ScrollToTop from "./ScrollToTop";


function App() {
  return (
    <BrowserRouter>

      {/* SCROLL TO TOP WHEN PAGE CHANGES */}
      <ScrollToTop />

      {/* NAVBAR */}
      <Navbar />

      {/* ALL WEBSITE ROUTES */}
      <Routes>

        {/* MAIN WEBSITE */}
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/services"
          element={<Services />}
        />

        <Route
          path="/portfolio"
          element={<Portfolio />}
        />

        <Route
          path="/contact"
          element={<Contact />}
        />


        {/* ADMIN */}
        <Route
          path="/admin"
          element={<Admin />}
        />

        <Route
          path="/admin-login"
          element={<AdminLogin />}
        />

        <Route
          path="/admin/portfolio"
          element={<PortfolioManager />}
        />

      </Routes>


      {/* WHATSAPP BUTTON */}
      <WhatsAppButton />

      {/* FOOTER */}
      <Footer />

    </BrowserRouter>
  );
}


export default App;