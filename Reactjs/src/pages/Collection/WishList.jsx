import React, { useEffect } from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import { useState} from "react";
import "./book-slider.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import swal from "sweetalert";
import AuthUser from "../forms/AuthUser";
function WishList (){

    if(!sessionStorage.getItem('token')){
        navigate('/');
        swal("Warning","Login to go to Wish List")
    }


    const navigate = useNavigate();
    const { http } = AuthUser();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [wish, setWish] = useState([]);
    useEffect(() => {
        let isMounted = true;
    
        http.get(`/wish-List`).then((res) => {
          if (isMounted) {
            if (res.data.status === 200) {
                setWish(res.data.wish);
              setLoading(false);
            } else if (res.data.status === 401) {
              navigate('/');
              swal('Warning', res.data.message, 'error');
            }
          }
        });
    
        return () => {
          isMounted = false;
        };
      }, [navigate]);

      const deleteWishItem = (e,wish_id) =>{
        e.preventDefault();
        const thisClicked = e.currentTarget;
        thisClicked.innerText = 'Removing';

        http.delete(`/delete-wish/${wish_id}`).then(res =>{
            if(res.data.status === 200){
                swal('Success',res.data.message,'success');
                thisClicked.closest('tr').remove();
            }else if(res.data.status === 404) {
                swal('Error',res.data.message,'error');
                thisClicked.innerText = 'Remove';
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
      var cart_HTML ='';
      if(wish.lenght >0 )
      {
        cart_HTML = <div className="table-responsive">
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Book</th>
                        <th className="text-center">Price</th>
                        <th className="text-center">Status</th>
                        <th>Remove</th>
                    </tr>
                </thead>
                <tbody>
                    {wish.map((item)=>{
                        return (
                <tr key = {item.id}>
                    <td width='10%'>
                        <img src={`http://localhost:8000/${item.cover_image}`} alt="book image" width="50px" height="50px"/>
                    </td>
                    <td>{item.book_title}</td>
                    <td width="15%" className="text-center">{item.selling_price}</td>
                    <td className="text-center">
                    {item.qty === '0' ? (
                        <label className="btn-dm btn-danger px-4 mt-2">Out of stock</label>
                        ) : (
                        <label className="btn-dm btn-success px-4 mt-2">In stock</label>
                        )}
                    </td>
                    <td width="10%">
                        <button type="button" onClick={(e)=> deleteWishItem(e,item.id)} className="btn btn-danger btn-sm">Remove</button>
                    </td>
                    </tr> 
                    )
                })}
                </tbody>
            </table>
        </div>
      }else {
        <div className="card card-body py-5 text-center shadow-sm ">
            <h4>Your wish List is Empty</h4>
        </div>
      }


    return (
        <div>
           <Header/>
           <div className="container">
          <h6>Home / Wish List</h6>
        </div>
        <div>
          <div className="container">
            <div className="row">
                <div className="col-md-12">
                    {cart_HTML}
                </div>
                
            </div>
        </div>
    </div>
           <Footer/> 
        </div>
    );
}
export default WishList;