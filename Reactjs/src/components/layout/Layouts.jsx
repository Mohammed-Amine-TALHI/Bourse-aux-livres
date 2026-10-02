import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Loader } from "../ui";
import Footer from "./Footer";
import Header from "./Header";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

/** Public shell: header, page, footer. */
export const SiteLayout = () => (
  <div className="site">
    <ScrollToTop />
    <Header />
    <main className="site-main">
      <Outlet />
    </main>
    <Footer />
  </div>
);

/** Only renders its children for logged-in users (and admins when `admin` is set). */
export const RequireAuth = ({ admin = false }) => {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) return <Loader page />;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (admin && !isAdmin) return <Navigate to="/" replace />;

  return <Outlet />;
};

/** Login and register are pointless once logged in. */
export const GuestOnly = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loader page />;
  if (user) return <Navigate to={location.state?.from || "/"} replace />;

  return <Outlet />;
};
