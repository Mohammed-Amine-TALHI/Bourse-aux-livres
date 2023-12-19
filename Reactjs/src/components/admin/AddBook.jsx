import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AuthUser from '../../pages/forms/AuthUser';
import swal from "sweetalert";


function AddBook (){
    const {http} = AuthUser();
    const [errorlist, setError] = useState([]);
    const [bookInput,setBook] = useState({
        category_id : '',
        isbn : '',
        book_title : '',
        description : '',
        status:'',
        meta_title:'',
        meta_keyword:'',
        meta_descrip:'',
        author : '',
        genre : '',
        original_price : '',
        selling_price : '',
        published_date : '',
        qty : '',
        featured : '',
        popular : '',


    });
    const [categorylist,setCategorylist] = useState([]);
    const [picture,setPicture] = useState([]);

    const handleInput = (e) => {
        e.persist();
        setBook({...bookInput, [e.target.name]:e.target.value});
    }
    const handleImage = (e) => {
        e.persist();
        setPicture({ cover_image:e.target.files[0]});
    }



    useEffect(()=>{
        http.get(`/all-category`).then(res=>{
            if(res.data.status === 200){
                setCategorylist(res.data.category);

            }

        });
        
    },[]);

    const submitBook = (e) => {
        e.preventDefault();
        console.log('Picture State before FormData:', picture);
        console.log('BookInput State before FormData:', bookInput);
        const formData = new FormData();
        formData.append('cover_image', picture.cover_image);
        formData.append('category_id', bookInput.category_id);
        formData.append('book_title', bookInput.book_title);
        formData.append('isbn', bookInput.isbn);
        formData.append('description', bookInput.description);

        formData.append('meta_title', bookInput.meta_title);
        formData.append('meta_keyword', bookInput.meta_keyword);
        formData.append('meta_descrip', bookInput.meta_descrip);

        formData.append('author', bookInput.author);
        formData.append('genre', bookInput.genre);
        formData.append('published_date', bookInput.published_date);
        formData.append('original_price', bookInput.original_price);
        formData.append('selling_price', bookInput.selling_price);

        formData.append('qty', bookInput.qty);
        formData.append('featured', bookInput.featured);
        formData.append('popular', bookInput.popular);
        formData.append('status', bookInput.status);

        http.post(`/store-book`, formData).then(res =>{
            if (res.data.status === 200){
                swal('Success',res.data.message,'success');
                setError([]);
            }else if (res.data.status === 422){
                swal("All Fields are mandetory","","error");
                setError(res.data.errors);
            }
        });
    }
    return (
        <div className="container-fluid px-4">
            <div className="card mt-4">
                <div className="card-header">
                <h4>Add Book
                    <Link to ="/admin/view-books" className = "btn btn-primary btn-sm float-end">View Books</Link>
                </h4>
                </div>
                <div className="card-body">
                    <form encType="multipart/form-data" onSubmit={submitBook} >
                        <ul className="nav nav-tabs" id="myTab" role="tablist">
                            <li className="nav-item" role="presentation">
                                <button className="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home-tab-pane" type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true">Home</button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button className="nav-link" id="seotags-tab" data-bs-toggle="tab" data-bs-target="#seotags" type="button" role="tab" aria-controls="seotags" aria-selected="false">SEO tags</button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button className="nav-link" id="otherdetails-tab" data-bs-toggle="tab" data-bs-target="#otherdetails" type="button" role="tab" aria-controls="otherdetails" aria-selected="false">Other details</button>
                            </li>
                        </ul>
                        <div className="tab-content" id="myTabContent">
                        <div className="tab-pane card-body bordered fade show active" id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab" tabIndex="0">

                            <div className="form-group mb-3">
                                <label >Select Category </label>
                                <select name="category_id" onChange={handleInput} value={bookInput.category_id} className="form-control">
                                    <option >Select</option>
                                    {
                                        categorylist.map( (item)=>{
                                            return (
                                                <option value ={item.id} key={item.id} >{item.name}</option>
                                            )
                                        } )
                                    }
                                    
                                </select>
                                <small className="text-danger">{errorlist.category_id}</small>
                            </div>
                            <div className="form-group mb-3">
                                <label >ISBN </label>
                                <input type="text" name="isbn" onChange={handleInput} value={bookInput.isbn} className="form-control" />
                                <small className="text-danger">{errorlist.isbn}</small>

                            </div>
                            <div className="form-group mb-3">
                                <label >Book Title </label>
                                <input type="text" name="book_title" onChange={handleInput} value={bookInput.book_title} className="form-control" />
                                <small className="text-danger">{errorlist.book_title}</small>
                                
                            </div>
                            <div className="form-group mb-3">
                                <label >Description </label>
                                <textarea type="text" name="description" onChange={handleInput} value={bookInput.description} className="form-control" ></textarea>
                            </div>
                        
                        </div>
                        <div className="tab-pane card-body bordered fade" id="seotags" role="tabpanel" aria-labelledby="seotags-tab" tabIndex="0">

                            <div className="form-group mb-3">
                                <label>Meta Title </label>
                                <input type ="text" name ="meta_title" onChange={handleInput} value={bookInput.meta_title} className="form-control"/>
                                <small className="text-danger">{errorlist.meta_title}</small>
                                
                            </div>
                            <div className="form-group mb-3">
                                <label>Meta Keywords</label>
                                <textarea name ="meta_keyword" onChange={handleInput} value={bookInput.meta_keyword} className="form-control"></textarea>
                            </div>
                            <div className="form-group mb-3">
                                <label>Meta Description</label>
                                <textarea name ="meta_descrip" onChange={handleInput} value={bookInput.meta_descrip} className="form-control"></textarea>
                            </div>
                        </div>
                        <div className="tab-pane card-body bordered fade" id="otherdetails" role="tabpanel" aria-labelledby="otherdetails-tab" tabIndex="0">

                            <div className="row">
                                    <div className="col-md-4 from-group mb-3">
                                        <label >Author</label>
                                        <input type ="text" name ="author" onChange={handleInput} value={bookInput.author} className="form-control"/>
                                    </div>
                                    <div className="col-md-4 from-group mb-3">
                                        <label >Published Date</label>
                                        <input type ="date" name ="published_date" onChange={handleInput} value={bookInput.published_date} className="form-control"/>
                                    </div>
                                    <div className="col-md-4 from-group mb-3">
                                        <label >Genre</label>
                                        <input type ="text" name ="genre" onChange={handleInput} value={bookInput.genre} className="form-control"/>
                                        <small className="text-danger">{errorlist.genre}</small>
                                    
                                    </div>
                                    <div className="col-md-4 from-group mb-3">
                                        <label >Selling Price</label>
                                        <input type ="text" name ="selling_price" onChange={handleInput} value={bookInput.selling_price}  className="form-control"/>
                                        <small className="text-danger">{errorlist.selling_price}</small>
                                    </div>
                                    <div className="col-md-4 from-group mb-3">
                                        <label >Original Price</label>
                                        <input type ="text" name ="original_price" onChange={handleInput} value={bookInput.original_price} className="form-control"/>
                                        <small className="text-danger">{errorlist.original_price}</small>
                                    </div>
                                    <div className="col-md-4 from-group mb-3">
                                        <label >Quantity</label>
                                        <input type ="text" name ="qty" onChange={handleInput} value={bookInput.qty} className="form-control"/>
                                        <small className="text-danger">{errorlist.qty}</small>
                                    </div>
                                    <div className="col-md-4 from-group mb-3">
                                        <label >Featured (checked=shown)</label>
                                        <input type ="checkbox" name ="featured" onChange={handleInput} value={bookInput.featured} className="w-50 h-50"/>
                                    </div>
                                    <div className="col-md-4 from-group mb-3">
                                        <label >Popular (checked=shown)</label>
                                        <input type ="checkbox" name ="popular" onChange={handleInput} value={bookInput.popular} className="w-50 h-50"/>
                                    </div>
                                    <div className="col-md-4 from-group mb-3">
                                        <label >Status (checked=Hidden)</label>
                                        <input type ="checkbox" name ="status" onChange={handleInput} value={bookInput.status} className="w-50 h-50"/>
                                    </div>
                                    <div className="col-md-8 from-group mb-3">
                                        <label >Cover Image</label>
                                        <input type ="file" name ="cover_image" onChange={handleImage}  className="form-control"/>
                                        <small className="text-danger">{errorlist.cover_image}</small>
                                    </div>
                            </div>

                        </div>
                        </div>
                        <button type="submit" className="btn btn-primary px-4 mt-2">Submit</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
export default AddBook;