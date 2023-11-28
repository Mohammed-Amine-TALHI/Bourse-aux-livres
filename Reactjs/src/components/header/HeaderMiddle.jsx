import { useContext } from "react";
import { Link } from "react-router-dom";
import BookStoreContext from "../../context/bookStorContext";
import AuthUser from "../../pages/forms/AuthUser";

const HeaderMiddle = () => {
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
      <Link to="/" className="header-middle-logo">
        <b>Book</b>
        <i className="bi bi-book"></i>
        <b>Store</b>
      </Link>
      <div className="header-middle-search-box">
        <input
          className="header-middle-search-input"
          type="search"
          placeholder="Search in book store..."
        />
        <i className="bi bi-search"></i>
  </div>
      {/*<Link to="/cart" className="header-middle-cart-wrapper">
        {cartInfoLength > 0 && (
          <b className="cart-notification">{cartInfoLength}</b>
        )}
        <i className="bi bi-cart2"></i>
        </Link>*/}
        {token ? (
          <div className="header-middle-add-box">
            <Link to="/Addbook">
          <i className="bi bi-plus-circle"></i></Link>
          <span > | </span> 
          <Link to="/PersonalProfile" className="header-top-link">
          <i className="bi bi-person-fill" ></i> Profile
       </Link>
       <span> | </span> 
       <button className="logout" onClick= {logoutUser} >logout</button>
        </div>
        ) : (<Link to="/login" className="header-top-link">
         <i className="bi bi-person-fill"  ></i> Login
      </Link>)}
    </div>
  );
};

export default HeaderMiddle;
