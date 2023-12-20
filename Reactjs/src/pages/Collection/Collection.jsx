import { useEffect, useState } from "react";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import "./contact.css";
import AuthUser from "../forms/AuthUser";
import { Link } from "react-router-dom";

const Collection = () => {
  const { http } = AuthUser();
  const [category, setCategory] = useState([]);
  const [loading,setLoading] = useState(true);
  useEffect(()=>{
    let isMountered = true;
    http.get(`/getCategory`).then(res =>{
      if(isMountered){
        if (res.data.status === 200){
          //console.log(res.data.category);
          setCategory(res.data.category);
          setLoading(false);
        }
      }
    });
    return () => {
      isMountered = false;
    }
  },[]);
 

  if(loading){
    return <div className="loading-container">
    <div className="spinner">
    </div>
  </div>
}
else {
    var showCategorylist = "";
    showCategorylist = category.map((item,idx)=>{
      return(
        <div className="col-sm-4" key={idx}>
          <div className="card shadow mb-4">
            <Link to={`/collections/${item.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="card-header py-3" data-toggle="collapse" role="button"  aria-expanded="true" >
                <h6 className="m-0 font-weight-bold text-primary d-flex justify-content-between align-items-center">
                  {item.name}
                  <i className="bi bi-chevron-down"></i>
                </h6>
              </div>
            </Link>

            <div className="collapse show" >
              <div className="card-body">
                {item.meta_title}
              </div>
            </div>
          </div>
        </div>

        /*<div className="col-sm-4" key={idx}>
        <div className="card w-75 mb-3">
        <Link to = {`${item.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className="card-body">
            <h6>{item.name}</h6>
            <p>{item.meta_title}</p>
          </div>
          </Link>
        </div>
      </div>*/
      )
    })



}

  
  return (
    <div>
    <Header/>
    <section className="Collections">
      <div className="p-3 mb-2 text-dark ">
        <div className="container">
          <h6>Category Page</h6>
        </div>
      </div>
      <div className="py-3">
          <div className="container">
            <div className="row">
              {showCategorylist}
            </div>
          </div>
        </div>
    </section>
    <Footer/>
    </div>
  );
};

export default Collection;
