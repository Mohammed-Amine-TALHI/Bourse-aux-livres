import { Link } from "react-router-dom";
import "./services.css";

const Services = () => {
  return (
    <div className="services">
      <div className="service-item">
        <i className="bi bi-truck"></i>
        <b>Secure 100%</b>
      </div>
      {/*<div className="service-item">
        <i className="bi bi-gift"></i>
        <b>Gift Card</b>
      </div>
      <div className="service-item">
        <i className="bi bi-arrow-clockwise"></i>
        <b>7 Days Return</b>
  </div>*/}
      
      <div className="service-item">
        <i className="bi bi-send"></i>
        <Link to = "/contact">
        <b>Contact Us</b>
        </Link>
      </div>
      
    </div>
  );
};

export default Services;
