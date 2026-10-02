import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { initials } from "../../utils/format";

export const Brand = () => (
  <Link to="/" className="brand" aria-label="Bourse aux Livres, home">
    <span className="brand-mark">
      <i className="bi bi-book-half" />
    </span>
    <span>
      Bourse <em>aux</em> Livres
    </span>
  </Link>
);

const LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/books", label: "Books" },
  { to: "/collections", label: "Collections" },
  { to: "/about", label: "About" },
];

const Header = () => {
  const { user, isAdmin, wishIds, logout } = useAuth();
  const [navOpen, setNavOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Close every popover when the route changes.
  useEffect(() => {
    setNavOpen(false);
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onClick = (event) => {
      if (!menuRef.current?.contains(event.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [menuOpen]);

  const handleLogout = async () => {
    await logout();
    toast.success("You have been logged out.");
    navigate("/");
  };

  return (
    <header className="header">
      <div className="container header-inner">
        <button
          type="button"
          className="menu-toggle"
          onClick={() => setNavOpen((open) => !open)}
          aria-label="Toggle navigation"
          aria-expanded={navOpen}
        >
          <i className={`bi ${navOpen ? "bi-x" : "bi-list"}`} />
        </button>

        <Brand />

        <nav className={`nav${navOpen ? " open" : ""}`}>
          {LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className="nav-link">
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="header-actions">
          {user ? (
            <>
              <NavLink to="/wishlist" className="header-icon" aria-label="Wishlist">
                <i className="bi bi-heart" />
                {wishIds.length > 0 && <span className="count">{wishIds.length}</span>}
              </NavLink>
              <Link to="/add-book" className="btn btn-accent btn-sm">
                <i className="bi bi-plus-lg" /> Sell a book
              </Link>
              <div className="user-menu" ref={menuRef}>
                <button
                  type="button"
                  className="user-trigger"
                  onClick={() => setMenuOpen((open) => !open)}
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                >
                  <span className="avatar">{initials(user.name)}</span>
                  <span className="name">{user.name.split(" ")[0]}</span>
                  <i className="bi bi-chevron-down" style={{ fontSize: "0.7rem" }} />
                </button>
                {menuOpen && (
                  <div className="dropdown" role="menu">
                    <div className="dropdown-head">
                      <strong>{user.name}</strong>
                      <span>{user.email}</span>
                    </div>
                    <Link to="/dashboard" className="dropdown-item" role="menuitem">
                      <i className="bi bi-journal-bookmark" /> My books
                    </Link>
                    <Link to="/wishlist" className="dropdown-item" role="menuitem">
                      <i className="bi bi-heart" /> Wishlist
                    </Link>
                    <Link to="/profile" className="dropdown-item" role="menuitem">
                      <i className="bi bi-person" /> Profile
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" className="dropdown-item" role="menuitem">
                        <i className="bi bi-speedometer2" /> Admin panel
                      </Link>
                    )}
                    <button type="button" className="dropdown-item danger" onClick={handleLogout} role="menuitem">
                      <i className="bi bi-box-arrow-right" /> Log out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">
                Log in
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
