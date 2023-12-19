import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AuthUser from '../../pages/forms/AuthUser';


function ViewBooks (){
    const {http} = AuthUser();
    const [viewBooks, setBook] = useState([]);
    const [loading, setLoading] = useState(true);
    var display_Booksdata = "";
    document.title = 'View Books';
    useEffect(()=> {
        http.get(`/view-books`).then(res=>{
            if(res.data.status === 200){
                setBook(res.data.Products);
                setLoading(false);
            }

        });
    },[]);
    if(loading){
        return <div className="loading-container">
        <div className="spinner">
        </div>
      </div>
    }
    else{
        
        display_Booksdata = viewBooks.map( (item)=>{
            return (
                <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.category.name}</td>
                    <td>{item.book_title}</td>
                    <td>{item.selling_price}</td>
                    <td><img src={`http://127.0.0.1:8000/${item.cover_image}`} alt={item.book_title} width="50px" /></td>
                    <td><Link to={`/admin/edit-book/${item.id}`} className="btn btn-success btn-sm">Edit</Link></td>
                    <td><button type='button' /*</td>onClick={(e)=> deleteCategory(e,item.id)}*/ className="btn btn-danger btn-sm">Delete</button></td>
                </tr>
            )

        });

    }

    return (
<div className="container px-4 mt-3">
            <div className="card">
                <div className="card-header">
                    <h4>View Books
                        <Link to="/admin/add-book" className="btn btn-primary btn-sm float-end" >Add Book</Link>
                    </h4>
                </div>   
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-boredered table-striped">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>CategoryName</th>
                                    <th>Book Name</th>
                                    <th>Selling Price</th>
                                    <th>Image</th>
                                    <th>Edit</th>
                                    <th>Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {display_Booksdata}
                            </tbody>
                        </table>
                    </div>
                </div> 
            </div>
    </div>
    );
}
export default ViewBooks;