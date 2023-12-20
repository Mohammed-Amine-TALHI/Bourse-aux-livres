import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthUser from "./AuthUser";
import { toast } from "react-toastify";

import loginImage from '../../images/book3.png';

const Register = () => {
  const { http, setToken } = AuthUser();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  useEffect(() => {
    setUsername(`${firstName} ${lastName}`);
  }, [firstName, lastName]);

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleRepeatPasswordChange = (e) => {
    setRepeatPassword(e.target.value);
  };

  const SubmitForm = () => {
    http.post('/register', { name: username, email, password, phonenumber }).then((res) => {
      navigate('/login');
    });
  };

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

    if (password !== repeatPassword) {
      return toast.error("Passwords do not match");
    }

    console.log({ email, password, username, phonenumber });
    setEmail("");
    setPassword("");
    setUsername("");
    setPhonenumber("");
  };

  return (
    <div className="container">
      <div className="card o-hidden border-0 shadow-lg my-5">
        <div className="card-body p-0">
          <div className="row">
            <div className="col-lg-5 d-none d-lg-block bg-register-image">
            <img src={loginImage} alt="Login Image" className="img-fluid" />
            </div>
            <div className="col-lg-7">
              <div className="p-5">
                <div className="text-center">
                  <h1 className="h4 text-gray-900 mb-4">Create an Account!</h1>
                </div>
                <form className="register" onSubmit={formSubmitHandler}>
                  <div className="form-group row">
                    <div className="col-sm-6 mb-3 mb-sm-0">
                      <input
                        type="text"
                        value={firstName}
                        onChange={handleFirstNameChange}
                        className="form-control form-control-user"
                        id="exampleFirstName"
                        placeholder="First Name"
                      />
                    </div>
                    <div className="col-sm-6">
                      <input
                        type="text"
                        value={lastName}
                        onChange={handleLastNameChange}
                        className="form-control form-control-user"
                        id="exampleLastName"
                        placeholder="Last Name"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-control form-control-user mb-3"
                      id="exampleInputEmail"
                      placeholder="Email Address"
                    />
                    <input
                      value={phonenumber}
                      className="form-control form-control-user"
                      onChange={(e) => setPhonenumber(e.target.value)}
                      type="text"
                      placeholder="Phone Number"
                    />
                  </div>
                  <div className="form-group row">
                    <div className="col-sm-6 mb-3 mb-sm-0">
                      <input
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                        className="form-control form-control-user"
                        id="exampleInputPassword"
                        placeholder="Password"
                      />
                    </div>
                    <div className="col-sm-6">
                      <input
                        type="password"
                        value={repeatPassword}
                        onChange={handleRepeatPasswordChange}
                        className="form-control form-control-user"
                        id="exampleRepeatPassword"
                        placeholder="Repeat Password"
                      />
                    </div>
                  </div>
                  <button
                    onClick={SubmitForm}
                    className="btn btn-primary btn-user btn-block"
                  >
                    Register Account
                  </button>
                </form>
                <div className="text-center">
                  <Link className="small" to="">
                    Forgot Password?
                  </Link>
                </div>
                <div className="text-center">
                  <Link className="small" to="/login">
                    Already have an account? Login!
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
