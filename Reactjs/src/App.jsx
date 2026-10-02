import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { GuestOnly, RequireAuth, SiteLayout } from "./components/layout/Layouts";
import About from "./pages/About";
import { Login, Register } from "./pages/Auth";
import BookDetails from "./pages/BookDetails";
import { AddBook, EditBook } from "./pages/BookEditor";
import Books from "./pages/Books";
import { CollectionBooks, Collections } from "./pages/Collections";
import Home from "./pages/Home";
import MyBooks from "./pages/MyBooks";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Wishlist from "./pages/Wishlist";
import AdminBooks from "./pages/admin/AdminBooks";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminUsers from "./pages/admin/AdminUsers";
import Dashboard from "./pages/admin/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<Books />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/collections/:slug" element={<CollectionBooks />} />
          <Route path="/collections/:category/:id" element={<BookDetails />} />
          <Route path="/about" element={<About />} />

          <Route element={<GuestOnly />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          <Route element={<RequireAuth />}>
            <Route path="/dashboard" element={<MyBooks />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/add-book" element={<AddBook />} />
            <Route path="/edit-book/:id" element={<EditBook />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>

        <Route element={<RequireAuth admin />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="books" element={<AdminBooks />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>
        </Route>
      </Routes>
      <ToastContainer position="bottom-right" autoClose={3200} hideProgressBar newestOnTop />
    </BrowserRouter>
  );
}

export default App;
