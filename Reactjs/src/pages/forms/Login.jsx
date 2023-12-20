import { useState } from "react";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import AuthUser from "./AuthUser";
import "./contact.css";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import loginImage from '../../images/book1.png'
const Login = () => {
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
    <div className="container">
    <div className="row justify-content-center">

        <div className="col-xl-10 col-lg-12 col-md-9">

            <div className="card o-hidden border-0 shadow-lg my-5">
                <div className="card-body p-0">
                    <div className="row">
                        <div className="col-lg-6 d-none d-lg-block bg-login-image">
                          <img src={loginImage} alt="Login Image" className="img-fluid" />
                        </div>
                        <div className="col-lg-6">
                            <div className="p-5">
                                <div className="text-center">
                                    <h1 className="h4 text-gray-900 mb-4">Welcome Back!</h1>
                                </div>
                                <form onSubmit={formSubmitHandler} className="form">
                                    <div className="form-group">
                                        <input type="email" value={email}
                                            onChange={(e) => setEmail(e.target.value)} 
                                            className="form-control form-control-user"
                                            id="exampleInputEmail" aria-describedby="emailHelp"
                                            placeholder="Enter Email Address..."/>
                                    </div>
                                    <div className="form-group">
                                        <input type="password" value={password}
                                            onChange={(e) => setPassword(e.target.value)} 
                                            className="form-control form-control-user"
                                            id="exampleInputPassword" placeholder="Password"/>
                                    </div>
                                    <div className="form-group">
                                        <div className="custom-control custom-checkbox small">
                                            <input type="checkbox" className="custom-control-input" id="customCheck"/>
                                            <label className="custom-control-label" htmlFor="customCheck">Remember
                                                Me</label>
                                        </div>
                                    </div>
                                    <button onClick={SubmitForm} className="btn btn-primary btn-user btn-block">
                                        Login
                                    </button>
                                </form >
                                <div className="text-center">
                                    <Link className="small" tp="/forgotPassword">Forgot Password?</Link>
                                </div>
                                <div className="text-center">
                                    <Link className="small" to="/register">Create an Account!</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

    </div>

</div>
  );
};

export default Login;
