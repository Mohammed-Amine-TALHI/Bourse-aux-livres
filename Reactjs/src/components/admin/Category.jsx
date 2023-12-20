import React, { useState } from "react";
import axios from "axios";
import swal from "sweetalert";
import AuthUser from '../../pages/forms/AuthUser';
import { Link } from "react-router-dom";

function Category (){
    const {http,token} = AuthUser();

    const [CategoryInput,setCategory] = useState({
        slug:'',
        name:'',
        description:'',
        meta_title:'',
        meta_keyword:'',
        meta_descrip:'',
        error_list:[],
    });
    const submitCategory = (e)=> {
        e.preventDefault();
        const data = {
            slug:CategoryInput.slug,
            name:CategoryInput.name,
            description:CategoryInput.description,
            status:allcheckbox.status ? 1 : 0,
            meta_title:CategoryInput.meta_title,
            meta_keyword:CategoryInput.meta_keyword,
            meta_descrip:CategoryInput.meta_descrip,
        }
        http.post('/store-category',data).then(res =>{
            if(res.data.status === 200){
                swal('Sucess',res.data.message,'sucess');
                document.getElementById('CATEGORY_FORM').reset();
                window.location.reload();
            }
            else if(res.data.status === 400){
                setCategory({...CategoryInput, error_list:res.data.errors});

                
            }
        });

    }

    const handleInput = (e)=>{
        e.persist();
        setCategory({...CategoryInput,[e.target.name]: e.target.value});
    }
    const [allcheckbox,seCheckboxes] = useState([]);
    const handleCheckBox = (e) => {
        e.persist();
        seCheckboxes({...allcheckbox, [e.target.name]:e.target.checked});
    }
    var DisplayErrors = [];
    if(CategoryInput.error_list){
        DisplayErrors = [
            CategoryInput.error_list.slug,
            CategoryInput.error_list.name,
            CategoryInput.error_list.meta_title,
        ]
    }




    return (
        <div className="container-fluid px-4">
            <div className="card-header">
            <h4 className="mt-4">Add Category
            <Link to ='/admin/view-category' className="btn btn-primary btn-sm float-end">View Category</Link>
            </h4>
            </div>
            {
                DisplayErrors.map((item)=> {
                    return(<p className="mb-1" key={item}>{item}</p>);
                })
            }

            <div className="card-body">
            <form onSubmit={submitCategory} id="CATEGORY_FORM">
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
                    <span>{CategoryInput.error_list.slug}</span>
                </div>
                <div className="form-group mb-3 ">
                    <label>Name *</label>
                    <input type ="text" name ="name" onChange={handleInput} value={CategoryInput.name} className="form-control"/>
                    <span>{CategoryInput.error_list.name}</span>
                </div>
                <div className="form-group mb-3 ">
                    <label>Description</label>
                    <textarea name ="description" onChange={handleInput} value={CategoryInput.description} className="form-control"></textarea>
                </div>
                <div className="form-group mb-3 ">
                    <label>Status</label>
                    <input type ="checkbox" name ="status" onChange={handleCheckBox} defaultChecked={allcheckbox.status === 1 ? true : false}/> Status 0=shown/1=hidden
                </div>
            </div>
            <div className="tab-pane fade  " id="seo-tags" role="tabpanel" aria-labelledby="seo-tags-tab" tabIndex="0">
            <div className="form-group mb-3">
                    <label>Meta Title *</label>
                    <input type ="text" name ="meta_title" onChange={handleInput} value={CategoryInput.meta_title} className="form-control"/>
                    <span>{CategoryInput.error_list.meta_title}</span>
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
        <button type="submit" className="btn btn-primary px-4 float-end">Submit</button>
        </form>
        </div>
        </div>

        );
}
export default Category;