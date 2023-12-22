import React, { useEffect, useState } from "react";
import AuthUser from "../../pages/forms/AuthUser";
import { Link } from "react-router-dom";


function ViewUsers (){
    const [loading,setLoading] = useState(true);
    const [categorylist,setCategorylist] = useState([]);
    const {http,token} = AuthUser();

    useEffect(()=>{
        http.get(`/users`).then(res=>{
            if(res.data.status === 200){
                setCategorylist(res.data.user);
            }
            setLoading(false);

        });

    },[]);
    var viewuser_HTML_table = '';
    if(loading){
        return <div className="loading-container">
        <div className="spinner">
        </div>
      </div>
    }
    else {
        viewuser_HTML_table = 
        categorylist.map( (item)=>{
            return (
                <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{item.email}</td>
                    <td>{item.phonenumber}</td>
                    <td>{item.role}</td>
                    <td><Link  to={`/admin/edit-user`} className="btn btn-success btn-sm">Edit</Link></td>
                    
                </tr>
            )

        });

    }

    return (
        <div className="container px-4">
            <div className="card">
                <div className="card-header">
                    <h4>Users List
                        <Link to="/admin/add-category" className="btn btn-primary btn-sm float-end" >Add category</Link>
                    </h4>
                </div>
                <div className="card-body">
                <table className="table table-striped">
                        <thead>
                            <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Name</th>
                            <th scope="col">email</th>
                            <th scope="col">Phone number</th>
                            <th scope="col">Role</th>
                            <th scope="col">Edit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {viewuser_HTML_table}
                        </tbody>
                </table>
                </div>
            </div>
        </div>
    );
}
export default ViewUsers;