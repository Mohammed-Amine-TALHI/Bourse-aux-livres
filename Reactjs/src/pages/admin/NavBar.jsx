import React from "react";
import { Link } from "react-router-dom";
import AuthUser from "../forms/AuthUser";


const NavBar = () => {
const {logout,token} = AuthUser();
const logoutUser = () => {
  if(token != undefined){
    logout();
    window.location.reload(true);

  }}
    return (
        <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark">
            
            <Link className="navbar-brand ps-3" to="/admin">Admin Panel</Link>
            
            <button className="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" id="sidebarToggle" to="#!"><i className="fas fa-bars"></i></button>
                <div className="input-group">
                <Link to = "/"><button className="bg-dark"><i className="bi bi-house"></i></button></Link>
                </div>
          <button onClick= {logoutUser} className="btn btn-dark mr-2"  aria-expanded="false">
            Logout
          </button>
       
        </nav>
    );
} 
export default NavBar;