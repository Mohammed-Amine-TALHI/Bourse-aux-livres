import React, { useEffect } from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import { useState, useContext } from "react";
import BookStoreContext from "../../context/bookStorContext";
import "./book-slider.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import swal from "sweetalert";
import AuthUser from "../forms/AuthUser";

function ViewBook({ data }) {
  const { addToCart } = useContext(BookStoreContext);
  const navigate = useNavigate();
  const { http } = AuthUser();
  const [slideIndex, setSlideIndex] = useState(0);
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookData, setBookData] = useState([]);
  const { slug } = useParams();
    const bookCount = bookData.length;  // Handle Click
  useEffect(() => {
    let isMounted = true;

    http.get(`/fetchbooks/${slug}`).then((res) => {

      if (isMounted) {
        if (res.data.status === 200) {
          setBookData(res.data.book_data.book);
          setCategory(res.data.book_data.category);
          setLoading(false);
        } else if (res.data.status === 400) {
          swal('Warning', res.data.message, '');
        } else if (res.data.status === 404) {
          navigate('/collections');
          swal('Warning', res.data.message, 'error');
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  } else {
    var showProductList = '';
    if (bookCount){
        showProductList = bookData.map((item, idx) => {
        return (
            <div className="col-md-3" key={idx}>
            <div className="card">
                <Link to="">
                <img
                    src={`http://localhost:8000/${item.cover_image}`}
                    className="w-100"
                    alt="{item.book_title}"
                />
                </Link>
                <div className="card-body">
                <Link to="">
                <h5>{item.book_title}</h5>
                </Link>
                </div>
            </div>
            </div>
        );
        });
    }
    else 
    {
        showProductList = 
        <div className="col-md-12">
            <h4>No Book Available for {category.name}</h4>

        </div>
    }

    return (
      <section>
        <Header />
        <div className="container">
          <h6>Collections / {category.name}</h6>
        </div>
        <div>
          <div className="container">
            <div className="row">{showProductList}</div>
          </div>
        </div>
        <Footer />
      </section>
    );
  }
}

export default ViewBook;
