import { Link, useNavigate } from "react-router-dom";
import "../forms/forms.css";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthUser from "../forms/AuthUser";
import swal from "sweetalert";
import Header from "../../components/header/Header";
import Navbar from "../../components/header/Navbar";


function DashboardUser() {
    const {http,user} = AuthUser();
    const [viewBooks, setBook] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [userdetail,setUserdetail] = useState();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    var display_Booksdata = "";
    var filteredBooks = '';
    document.title = 'View Books';
    useEffect(()=> 
    {
        http.get(`/view-books`).then(res=>{
            if(res.data.status === 200){
                setBook(res.data.books);
                setLoading(false);
            }else if (res.data.status === 404){
                swal("Error",res.data.message,"error");
                navigate("/addbook");
            }

        });
    },[]);
    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };
    const updateQuantity = async (id, newQuantity) => {
        try {
            const response = await http.patch(`/update-quantity/${id}`, {
                quantity: newQuantity,
            });

            if (response.data.status === 200) {
                // Update the local state with the new quantity
                const updatedBooks = viewBooks.map(book =>
                    book.id === id ? { ...book, qty: newQuantity } : book
                );
                setBook(updatedBooks);
            } else {
                console.error("Failed to update quantity in the database");
            }
        } catch (error) {
            console.error("Error updating quantity:", error);
        }
    };
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };
    if(loading){
        return <div className="loading-container">
        <div className="spinner">
        </div>
      </div>
    }
    else{

        filteredBooks = viewBooks.filter((item) =>
            (item.book_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.selling_price.toString().toLowerCase().includes(searchTerm.toLowerCase())) &&
            (selectedCategory === '' || item.category.name.toLowerCase() === selectedCategory.toLowerCase())
            
        );
        
        var BookStatus = '';
        var showQuantityButtons='';
        display_Booksdata = viewBooks.map( (item)=>{
            showQuantityButtons = user && parseInt(user.id) === parseInt(item.seller_id);
            if (item.status == '0')
            {
                BookStatus = 'Shown';
            }else if (item.status == '1'){
                BookStatus = 'Hidden';
            }
            return (
                <tr key={item.id}>
                    <td>{item.user.name}</td>
                    <td>{item.category.name}</td>
                    <td>{item.book_title}</td>
                    <td>{item.selling_price}</td>
                    <td><img src={`http://127.0.0.1:8000/${item.cover_image}`} alt={item.book_title} width="50px" /></td>
                    <td><Link to={`/admin/edit-book/${item.id}`} className="btn btn-success btn-sm">Edit</Link></td>
                    <td>{BookStatus}</td>
                </tr>
            )

        });

    }
        const categories = [...new Set(viewBooks.map(item => item.category.name))];
        const sellers = [...new Set(viewBooks.map(item => item.user.name))];

    return (
        <div className="container mt-3">
            <Navbar/>
        <div className="form-wrapper mt-5">
            <div className="container mt-3">
            <div className="card mt-3">
                <div className="card-header mt-3">
                    <h4 className="mt-3">View Books
                        <Link to="/addbook" className="btn btn-primary btn-sm float-end" >Add Book</Link>
                    </h4>
                    <div className="mb-3 mt-5">
                            <input
                                type="text"
                                placeholder="Search by book title, price, etc."
                                className="form-control"
                                onChange={handleSearch}
                                value={searchTerm}
                            />
                        </div>
                        <div className="mb-3">
                            <label>Filter by Category:</label>
                            <select
                                value={selectedCategory}
                                onChange={handleCategoryChange}
                                className="form-control"
                            >
                                <option value="">All Categories</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>
                </div>   
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-boredered table-striped">
                            <thead>
                                <tr>
                                    <th>Seller Name</th>
                                    <th>Seller Phone number</th>
                                    <th>CategoryName</th>
                                    <th>Book Name</th>
                                    <th>Selling Price</th>
                                    <th>Image</th>
                                    <th>Edit</th>
                                    <th>Status</th>
                                    <th>Quantity</th>
                                </tr>
                            </thead>
                            <tbody>
                            {filteredBooks.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.user.name}</td>
                                            <td>{item.user.phonenumber}</td>
                                            <td>{item.category.name}</td>
                                            <td>{item.book_title}</td>
                                            <td>{item.selling_price}</td>
                                            <td><img src={`http://127.0.0.1:8000/${item.cover_image}`} alt={item.book_title} width="50px" /></td>
                                            <td><Link to={`/edit-book/${item.id}`} className="btn btn-success btn-sm">Edit</Link></td>
                                            <td>
                                                {parseInt(item.request) === 0
                                                    ? 'Pending'
                                                    : parseInt(item.request) === 1
                                                    ? 'Accepted'
                                                    : parseInt(item.request) === 2
                                                    ? 'Rejected'
                                                    : 'Unknown Status'}
                                                </td>
                                                {showQuantityButtons && (
                                                    <td>
                                                        <div className="input-group">
                                                            <button type="button" className="input-group-text" onClick={() => updateQuantity(item.id, item.qty - 1)}>-</button>
                                                            <input type="text" className="form-control text-center" value={item.qty} readOnly />
                                                            <button type="button" className="input-group-text" onClick={() => updateQuantity(item.id, item.qty + 1)}>+</button>
                                                        </div>
                                                    </td>
                                                )}
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div> 
            </div>
    </div>
        </div>
        </div>
    );
}

export default DashboardUser;
