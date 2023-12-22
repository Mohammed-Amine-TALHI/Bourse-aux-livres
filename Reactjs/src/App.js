import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Footer from "./components/footer/Footer";
import Header from "./components/header/Header";
import About from "./pages/about/About";
import ViewBooks from "./pages/Bookspage/ViewBooks";
import BookPage from "./pages/book/BookPage";
import Cart from "./pages/cart/Cart";
import Collection from "./pages/Collection/Collection";
import ViewBook from "./pages/Collection/ViewBook";
import Login from "./pages/forms/Login";
import Register from "./pages/forms/Register";
import HomePage from "./pages/home/HomePage";
import DashboardUser from "./pages/home/DashboardUser";
import EditBookUser from "./pages/home/EditBookUser";
import PersonalProfile from "./components/Profile/PersonalProfile";
import Addbook from "./pages/forms/Addbook";
import NotFound from "./pages/404/NotFound";
import MasterLayout from "./pages/admin/MasterLayout";
import Profile from "./components/admin/Profile";
import AdminPrivateRoute from "./AdminPrivateRoute";
import routes from "./routes/routes";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.js";







function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/collections/:category/:id" element={<BookPage />} />
        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />
        <Route path="/collections" element={<Collection />} />
        <Route path="/collections/:slug" element={<ViewBook />} />
        <Route path="/edit-book/:id" element={<EditBookUser />} />
        <Route path="/books" element={<ViewBooks />} />
        <Route path="/about" element={<About />} />
        <Route path="/Dashboard" element={<DashboardUser />} />
        <Route path="/PersonalProfile" element={<PersonalProfile />} />
        <Route path="/Addbook" element={<Addbook/>}/>
        <Route component={NotFound} />
        <Route path="/admin/*" element = {<MasterLayout/>}/>

        {/*<Route element={<AdminPrivateRoute />} >
      {routes.map(({ path, component: Component }) => (
        <Route key={path} path={path} element={<Component />} />
      ))}
    </Route>*/}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
