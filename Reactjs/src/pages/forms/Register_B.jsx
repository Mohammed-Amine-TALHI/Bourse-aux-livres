import { Link, Navigate, useNavigate } from "react-router-dom";
import "./forms.css";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import AuthUser from "./AuthUser";

 const Register_B = () => {
  const navigate = useNavigate();
  const {http,setToken} = AuthUser();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  
  const SubmitForm  = () => {
    http.post('/register',{name:username,email:email,password:password,phonenumber:phonenumber}).then((res)=>{
      navigate('/login')
    })
  }


  // Form Submit Handler
  const formSubmitHandler = (event) => {
    event.preventDefault();

    if (email.trim() === "") {
      return toast.error("Email is required");
    }

    if (username.trim() === "") {
      return toast.error("Username is required");
    }
    if (phonenumber.trim() === "") {
      return toast.error("Phone Number is required");
    }

    if (password.trim() === "") {
      return toast.error("Password is required");
    }

    console.log({ email, password, username ,phonenumber});
    setEmail("");
    setPassword("");
    setUsername("");
    setPhonenumber("");
  };
  return (
    <div>
    <Header/>
    <div className="form-wrapper">
      <ToastContainer />
      <h1 className="form-title">Create new account</h1>
      <form onSubmit={formSubmitHandler} className="form">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Email"
        />
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          type="text"
          placeholder="Username"
        />
        <input
          value={phonenumber}
          onChange={(e) => setPhonenumber(e.target.value)}
          type="text"
          placeholder="Phone Number"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
        />
        <button className="form-btn" type="submit" onClick={SubmitForm}>
          Register
        </button>
      </form>
      <div className="form-footer">
        Already have an account ?{" "}
        <Link to="/login" className="forms-link">
          Login
        </Link>
      </div>
    </div>
    </div>
  );
};

export default Register_B;
