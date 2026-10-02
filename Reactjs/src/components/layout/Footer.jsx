import { Link } from "react-router-dom";
import { Brand } from "./Header";

const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div className="footer-grid">
        <div>
          <Brand />
          <p className="footer-about">
            The student book exchange: buy and sell second-hand textbooks and novels, hand to hand, on campus.
          </p>
        </div>
        <div>
          <h4>Explore</h4>
          <ul>
            <li>
              <Link to="/books">All books</Link>
            </li>
            <li>
              <Link to="/collections">Collections</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4>Sell</h4>
          <ul>
            <li>
              <Link to="/add-book">List a book</Link>
            </li>
            <li>
              <Link to="/dashboard">My books</Link>
            </li>
            <li>
              <Link to="/wishlist">Wishlist</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4>Contact</h4>
          <ul>
            <li>
              <i className="bi bi-geo-alt" />
              EMINES, UM6P, Benguerir
            </li>
            <li>
              <i className="bi bi-envelope" />
              <a href="mailto:contact@bourse-aux-livres.ma">contact@bourse-aux-livres.ma</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Bourse aux Livres. A student project.</span>
        <span>Built with React &amp; Laravel</span>
      </div>
    </div>
  </footer>
);

export default Footer;
