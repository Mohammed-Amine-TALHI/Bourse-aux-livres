import { useState,useContext, useEffect } from "react";
import BookStoreContext from "../../context/bookStorContext";
import "./book-slider.css";
import Rating from "./Rating";
import AuthUser from "../../pages/forms/AuthUser";
import { Link, useNavigate } from "react-router-dom";
import swal from "sweetalert";

const BookSlider = () => {
  const [slideIndex, setSlideIndex] = useState(0);
  const { http } = AuthUser();
  const navigate = useNavigate();
  const [bookP, setBookP] = useState(null);
  const [bookF, setBookF] = useState(null);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    let isMounted = true;

    http.get(`/Books-slider`).then((res) => {
      if (isMounted) {
        if (res.data.status === 200) {
          setBookP(res.data.bookP);
          setBookF(res.data.bookF);
          setLoading(false);
        } else if (res.data.status === 404) {
          navigate('/collections');
          swal('Warning', res.data.message, 'error');
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  // Handle Click
  const handleClick = (direction) => {
    if (direction === "left") {
      setSlideIndex(slideIndex - 1);
    } else {
      setSlideIndex(slideIndex + 1);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }else {

  }


  return (
    <div className="row">
    <div className="book-slider-container">
      {slideIndex >= 0 && <i
        onClick={() => handleClick("left")}
        className="bi bi-chevron-left book-slider-arrow-left"
      ></i>}
      <div
        style={{ transform: `translateX(${slideIndex * -340}px)` }}
        className="book-slider-wrapper"
      >
        {bookP.map((item) => (
          <Link to={`/collections/${item.category.slug}/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <div key={item.id} className="book-slide-item">
            <img
              src={`http://localhost:8000/${item.cover_image}`}
              alt={item.book_title}
              className="book-slide-item-img"
            />
            <h3 className="book-slide-item-title">{item.book_title}</h3>
            <div className="book-slider-item-price">{item.selling_price} DH</div>
            <div className="book-slider-icons-wrapper">
              <i className="bi bi-eye-fill"></i>
              
            </div>
          </div>
          </Link>
        ))}
      </div>
      {slideIndex <= bookP.length - 1 && <i
        onClick={() => handleClick("right")}
        className="bi bi-chevron-right book-slider-arrow-right"
      ></i>}
    </div>
    <div>
    <button type="button" className="btn btn-link float-end mr-4" >'View more'</button>
    <h2>Featured</h2>
    <div className="book-slider-container">
      {slideIndex >= 0 && <i
        onClick={() => handleClick("left")}
        className="bi bi-chevron-left book-slider-arrow-left"
      ></i>}
      <div
        style={{ transform: `translateX(${slideIndex * -340}px)` }}
        className="book-slider-wrapper"
      >
        {bookF.map((item) => (
          <Link to={`/collections/${item.category.slug}/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <div key={item.id} className="book-slide-item">
            <img
              src={`http://localhost:8000/${item.cover_image}`}
              alt={item.book_title}
              className="book-slide-item-img"
            />
            <h3 className="book-slide-item-title">{item.book_title}</h3>
            <Rating rating={item.rating} reviews={item.reviews} />
            <div className="book-slider-item-price">${item.selling_price}</div>
            <div className="book-slider-icons-wrapper">
              <i className="bi bi-eye-fill"></i>
              
            </div>
          </div>
          </Link>
        ))}
      </div>
      {slideIndex <= bookF.length - 1 && <i
        onClick={() => handleClick("right")}
        className="bi bi-chevron-right book-slider-arrow-right"
      ></i>}
    </div>
    </div>
    </div>
  );
};

export default BookSlider;
