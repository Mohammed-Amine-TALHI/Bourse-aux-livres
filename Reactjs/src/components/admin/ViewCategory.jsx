import React, { useEffect, useState } from "react";
import {Link} from "react-router-dom";
import AuthUser from '../../pages/forms/AuthUser';

import swal from "sweetalert";


function ViewCategory (){
    const [loading,setLoading] = useState(true);
    const [categorylist,setCategorylist] = useState([]);
    const {http,token} = AuthUser();

    useEffect(()=>{

        http.get('/view-category').then(res=>{
            // console.log(res.data.category);
            if(res.status===200)
            {
                setCategorylist(res.data.category)
            }
            setLoading(false);
        });

    },[]);

    var viewcategory_HTML_table = '';

    const deleteCategory = (e,id)=>{
        e.preventDefault();
        const thisClicked = e.currentTarget;
        thisClicked.innerText = 'Deleting';

        http.delete(`/delete-category/${id}`).then(res=>{
            if(res.data.status === 200){
               swal("Success",res.data.message,"success");
               thisClicked.closest("tr").remove();
            }else if(res.data.status === 404){
                swal("Success",res.data.message,"success");
                thisClicked.innerText = 'Delete';

            }
        });
    }
    if(loading){
        return <div className="loading-container">
        <div className="spinner">
        </div>
      </div>
    }
    else {
        viewcategory_HTML_table = 
        categorylist.map( (item)=>{
            return (
                <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{item.slug}</td>
                    <td>{item.status}</td>
                    <td><Link to={`/admin/edit-category/${item.id}`} className="btn btn-success btn-sm">Edit</Link></td>
                    <td><button type='button' onClick={(e)=> deleteCategory(e,item.id)} className="btn btn-danger btn-sm">Delete</button></td>
                </tr>
            )

        });

    }


    return (
        <div className="container px-4">
            <div className="card">
                <div className="card-header">
                    <h4>Category List
                        <Link to="/admin/add-category" className="btn btn-primary btn-sm float-end" >Add category</Link>
                    </h4>
                </div>
                <div className="card-body">
                <table className="table table-striped">
                        <thead>
                            <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Name</th>
                            <th scope="col">Slug</th>
                            <th scope="col">Status</th>
                            <th scope="col">Edit</th>
                            <th scope="col">Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {viewcategory_HTML_table}
                        </tbody>
                </table>
                </div>
            </div>
        </div>
    );
}
export default ViewCategory;