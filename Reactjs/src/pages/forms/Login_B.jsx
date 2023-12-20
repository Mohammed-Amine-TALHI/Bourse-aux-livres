import { Link } from "react-router-dom";
import "./forms.css";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthUser from "./AuthUser";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";


const Login_B = () => {
  const {http,setToken} = AuthUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userdetail,setUserdetail] = useState();
  const SubmitForm  = () => {
    http.post('/login',{email:email,password:password}).then((res)=>{
      setToken(res.data.user,res.data.access_token);
    })
  }

  // Form Submit Handler
  const formSubmitHandler = (event) => {
    event.preventDefault();

    if (email.trim() === "") {
      return toast.error("Email is required");
    }

    if (password.trim() === "") {
      return toast.error("Password is required");
    }

    setEmail("");
    setPassword("");
  };
  return (
    <div>
    <div className="form-wrapper">
      <ToastContainer />
      <h1 className="form-title">Login to your account</h1>
      <form onSubmit={formSubmitHandler} className="form">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Email"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
        />
        <button className="form-btn" type="submit" onClick={SubmitForm}>
          Login
        </button>
      </form>
      <div className="form-footer">
        Dont't have an account ?{" "}
        <Link to="/register" className="forms-link">
          Register
        </Link>
      </div>
    </div>
    </div>
  );
};

export default Login_B;
