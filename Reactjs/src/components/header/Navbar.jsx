import { Link } from "react-router-dom";

const Navbar = ({ toggle, setToggle }) => {
  return (
    <nav style={{ left: toggle && "0" }} className="navbar">
      <ul className="navbar-links">
        <Link to="/" onClick={() => setToggle(false)} className="navbar-link">
          Home
        </Link>
        <Link
          to="/books"
          onClick={() => setToggle(false)}
          className="navbar-link"
        >
          Books
        </Link>
        <Link
          to="/collections"
          onClick={() => setToggle(false)}
          className="navbar-link"
        >
          Collection
        </Link>
        {/*<Link
          to="/contact"
          onClick={() => setToggle(false)}
          className="navbar-link"
        >
          Contact Us
  </Link>*/}
        {/*<Link
          to="/register"
          onClick={() => setToggle(false)}
          className="navbar-link"
        >
          Register
        </Link>*/}
      </ul>
    </nav>
  );
};

export default Navbar;
