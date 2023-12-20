import React, { useEffect, useState } from "react";
import { Link,useNavigate,Navigate } from "react-router-dom";
import AuthUser from '../../pages/forms/AuthUser';
import swal from "sweetalert";
import { useParams } from 'react-router-dom';


function EditCategory (){
    const [loading,setLoading] = useState(true);
    //const [CategoryInput, setCategory] = useState([]);
    const [error, setError] = useState([]);
    const navigate = useNavigate();
    const {http}=AuthUser();
    const { id } = useParams();
    const [CategoryInput, setCategory] = useState({
        slug: "",
        name: "",
        description: "",
        status: 0, // Add status property for checkbox
        meta_title: "",
        meta_keyword: "",
        meta_descrip: "",
      });
    
    const [allcheckbox,seCheckboxes] = useState([]);
    const handleCheckBox = (e) => {
        e.persist();
        setCategory({
            ...CategoryInput,
            [e.target.name]: e.target.checked ? 1 : 0, // Convert boolean to 1 or 0
          });
    }
    useEffect(()=>{
        http.get(`/edit-category/${id}`).then(res=>{
            if(res.data.status===200){
                setCategory(res.data.category);
            }else if(res.data.status===404){
                swal("Error",res.data.message,'error');
                navigate('/admin/view-category');
            }
            setLoading(false);
        });
    },[id,navigate]);
    const handleInput = (e)=>{
        e.persist();
        setCategory({...CategoryInput,[e.target.name]: e.target.value});
    }
    const updateCategory = (e)=> {
        e.preventDefault();
        const data = CategoryInput;
        http.put(`/update-gategory/${id}`,data).then(res=>{
            if(res.data.status===200){
                swal('Success',res.data.message,'success');
                setError([]);
                navigate('/admin/view-category');
            }else if(res.data.status === 422) {
                swal('All fields are mandetory',"",'error');
                setError(res.data.errors);

            }else if(res.data.status ===404){
                swal('Error',res.data.message,'error');
                navigate('/admin/view-category');

            }
        });
    }
    if(loading){
        return <div className="loading-container">
        <div className="spinner">
        </div>
      </div>
    }
    return (
        
        <div className="container-fluid px-4">
           <div className="card-header">
            <h4 className="mt-4">Edit Category
            <Link to ='/admin/view-category' className="btn btn-primary btn-sm float-end">BACK</Link>
            </h4>
            </div>
            <div className="card-body">
            <form onSubmit={updateCategory}>
            <ul className="nav nav-tabs" id="myTab" role="tablist">
            <li className="nav-item" role="presentation">
                <button className="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home-tab-pane" type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true">Home</button>
            </li>
            <li className="nav-item" role="presentation">
                <button className="nav-link" id="seo-tags-tab" data-bs-toggle="tab" data-bs-target="#seo-tags" type="button" role="tab" aria-controls="seo-tags" aria-selected="false">SEO Tags</button>
            </li>
            </ul>
        <div className="tab-content" id="myTabContent">
            <div className="tab-pane fade show active " id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab" tabIndex="0">
                <div className="form-group mb-3 ">
                    <label>Slug *</label>
                    <input type ="text" name ="slug" onChange={handleInput} value={CategoryInput.slug} className="form-control"/>
                    <small className="text-danger">{error.slug}</small>
                </div>
                <div className="form-group mb-3 ">
                    <label>Name *</label>
                    <input type ="text" name ="name" onChange={handleInput} value={CategoryInput.name} className="form-control"/>
                    <small className="text-danger">{error.name}</small>
                </div>
                <div className="form-group mb-3 ">
                    <label>Description</label>
                    <textarea name ="description" onChange={handleInput} value={CategoryInput.description} className="form-control"></textarea>
                </div>
                <div className="form-group mb-3 ">
                    <label>Status</label>
                    <input type ="checkbox" name ="status" onChange={handleCheckBox} defaultChecked={CategoryInput.status === 1 ? true:false} /> Status 0=shown/1=hidden
                </div>
            </div>
            <div className="tab-pane fade  " id="seo-tags" role="tabpanel" aria-labelledby="seo-tags-tab" tabIndex="0">
            <div className="form-group mb-3">
                    <label>Meta Title *</label>
                    <input type ="text" name ="meta_title" onChange={handleInput} value={CategoryInput.meta_title} className="form-control"/>
                    <small className="text-danger">{error.meta_title}</small>
                </div>
            <div className="form-group mb-3">
                    <label>Meta Keywords</label>
                    <textarea name ="meta_keyword" onChange={handleInput} value={CategoryInput.meta_keyword} className="form-control"></textarea>
                </div>
                <div className="form-group mb-3">
                    <label>Meta Description</label>
                    <textarea name ="meta_descrip" onChange={handleInput} value={CategoryInput.meta_descrip} className="form-control"></textarea>
                </div>
        </div>
</div>
        <button type="submit" className="btn btn-primary px-4 float-end">Update</button>
        </form>
        </div>
        </div>
    );
}
export default EditCategory;