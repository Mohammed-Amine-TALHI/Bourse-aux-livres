import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Brand } from "../../components/layout/Header";
import { useAuth } from "../../context/AuthContext";
import useFetch from "../../hooks/useFetch";
import { initials } from "../../utils/format";
import "../../styles/admin.css";

const LINKS = [
  { to: "/admin", label: "Dashboard", icon: "bi-speedometer2", end: true },
  { to: "/admin/books", label: "Books", icon: "bi-journals" },
  { to: "/admin/categories", label: "Collections", icon: "bi-collection" },
  { to: "/admin/users", label: "Users", icon: "bi-people" },
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  // Refreshed on every navigation so the "pending" pill follows approvals.
  const stats = useFetch(`/admin/stats?at=${encodeURIComponent(location.pathname)}`);
  const pending = stats.data?.stats.pending;

  useEffect(() => setOpen(false), [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="admin">
      <aside className={`admin-side${open ? " open" : ""}`}>
        <Brand />
        <nav className="admin-nav">
          <span className="admin-nav-label">Manage</span>
          {LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className="admin-link">
              <i className={`bi ${link.icon}`} />
              {link.label}
              {link.to === "/admin" && pending > 0 && <span className="pill">{pending}</span>}
            </NavLink>
          ))}
          <span className="admin-nav-label">Shortcuts</span>
          <NavLink to="/add-book" className="admin-link">
            <i className="bi bi-plus-circle" />
            Add a book
          </NavLink>
          <NavLink to="/" className="admin-link" end>
            <i className="bi bi-shop" />
            Back to the site
          </NavLink>
        </nav>
        <div className="admin-side-foot">
          <span className="avatar">{initials(user.name)}</span>
          <div>
            <strong>{user.name}</strong>
            <span>Administrator</span>
          </div>
          <button type="button" onClick={handleLogout} aria-label="Log out" title="Log out">
            <i className="bi bi-box-arrow-right" />
          </button>
        </div>
      </aside>

      <div>
        <div className="admin-mobile-bar">
          <button type="button" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
            <i className={`bi ${open ? "bi-x" : "bi-list"}`} />
          </button>
          <strong>Admin panel</strong>
        </div>
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
