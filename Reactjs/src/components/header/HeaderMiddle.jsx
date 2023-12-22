import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import BookStoreContext from "../../context/bookStorContext";
import AuthUser from "../../pages/forms/AuthUser";
import { IoIosLogOut } from "react-icons/io";
import { FaHeart } from "react-icons/fa";

const HeaderMiddle = () => {
  const [search, setSearch] = useState("");
  const { cartInfoLength } = useContext(BookStoreContext);
  const {getToken,token,logout} = AuthUser() 

  const logoutUser = () => {
    if(token != undefined){
      logout();
      window.location.reload(true);

    }

  }
  return (
    <div className="header-middle">
      <Link to="/" className="header-middle-logo" style={{ textDecoration: 'none', color: 'inherit' }}>
        <b>Book</b>
        <i className="bi bi-book"></i>
        <b>Store</b>
      </Link>
      
      {/*<Link to="/cart" className="header-middle-cart-wrapper">
        {cartInfoLength > 0 && (
          <b className="cart-notification">{cartInfoLength}</b>
        )}
        <i className="bi bi-cart2"></i>
        </Link>*/}
        {token ? (
          <div className="header-middle-add-box">
            <Link to="/wish-List"  >
          <i className="bi bi bi-heart-fill" style={{ color: 'black' }} ></i></Link>
            <span > | </span> 
            <Link to="/Addbook"  >
          <i className="bi bi-plus-circle" style={{ color: 'black' }} ></i></Link>
          <span > | </span> 
          <Link to="/PersonalProfile" className="header-top-link" style={{ textDecoration: 'none', color: 'black' }}>
          <i className="bi bi-person-fill" ></i> Profile
       </Link>
       <span> | </span> 
       <button className="logout-btn" style={{ color: 'black' }} onClick= {logoutUser} >logout</button>
        </div>
        ) : (<Link to="/login" style={{ textDecoration: 'none', color: 'black' }} className="header-top-link">
         <i className="bi bi-person-fill"  ></i> Login
      </Link>)}
    </div>
  );
};

export default HeaderMiddle;
