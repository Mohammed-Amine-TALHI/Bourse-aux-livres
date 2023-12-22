import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import swal from "sweetalert";
import AuthUser from "../forms/AuthUser";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import Rating from "../../components/book-slider/Rating";
import BookStoreContext from "../../context/bookStorContext";
import "./book.css";
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

const BookPage = () => {
  const { addToCart } = useContext(BookStoreContext);
  const navigate = useNavigate();
  const { http } = AuthUser();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const { category, id } = useParams();

  useEffect(() => {
    let isMounted = true;

    http.get(`/collections/${category}/${id}`).then((res) => {
      if (isMounted) {
        if (res.data.status === 200) {
          setBook(res.data.book);
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
  }, [category, id, navigate]);
  const handleContactSeller = () => {
    // Add your logic to handle the contact seller action
    swal("Contact Seller", ` Phone Number : ${book.user.phonenumber}`, "info");
  };

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Contact Seller
    </Tooltip>
  );
  const submitAddtoWishlist = (e) =>{
    e.preventDefault();
    const data = {
      book_id:book.id,
    }
    http.post(`/add-to-wish`,data).then(res=>{
      if(res.data.status === 201){
        swal("Success",res.data.message,'success');
      }else if (res.data.status === 409){
        //Already added to wishlist
        swal("Success",res.data.message,'success');
      }else if (res.data.status === 401){

        swal("Error",res.data.message,'error');
      }else if (res.data.status === 404){
        swal("Warning",res.data.message,'warning');
      }

    });
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="book">
        <div className="container">
          <h6>Collections / {book.category.name} / {book.book_title}</h6>
        </div>
        <div className="book-content">
          <img
            src={`http://localhost:8000/${book.cover_image}`}
            alt={book.book_title}
            className="book-content-img"
          />
          <div className="book-content-info">
            <h1 className="book-title">{book.book_title}</h1>
            <div className="book-author">
              by <span>{book.author}</span> (Author)
            </div>
            {book.qty === '0' ? (
          <label className="btn-dm btn-danger px-4 mt-2">Out of stock</label>
        ) : (
          <label className="btn-dm btn-success px-4 mt-2">In stock</label>
        )}
            <div className="modal-content-info-price">
              <div className="row">
                <div>
                  <b className="text-decoration-line-through">{book.original_price} </b> DH
                </div>
                <div>
                  <b>{book.selling_price} </b> DH
                </div>
              </div>
            </div>
            <button onClick={submitAddtoWishlist} type="button" className="btn btn-danger mr-3">
              Add to wishlist
            </button>
              <Button variant="primary" onClick={handleContactSeller}>
                Contact Seller
              </Button>

          </div>
        </div>
        <p className="book-description">{book.description}</p>
        <div className="book-icons">
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BookPage;
