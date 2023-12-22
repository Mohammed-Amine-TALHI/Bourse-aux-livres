import React, { useEffect } from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import { useState} from "react";
import "./book-slider.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import swal from "sweetalert";
import AuthUser from "../forms/AuthUser";
function WishList (){
    const navigate = useNavigate();
    const { http } = AuthUser();
    const [category, setCategory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bookData, setBookData] = useState([]);
    useEffect(() => {
        let isMounted = true;
    
        http.get(`/wish-List`).then((res) => {
    
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


    return (
        <div>
           <Header/>

           <Footer/> 
        </div>
    );
}
export default WishList;