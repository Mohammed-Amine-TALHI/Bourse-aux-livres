import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AuthUser from '../../pages/forms/AuthUser';

// ... Existing imports and code ...

function ViewBooks() {
    const { http, user } = AuthUser();
    const [viewBooks, setBook] = useState([]);
    const [loading, setLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedId, setSelectedId] = useState('');

    document.title = 'View Books';
    var display_Booksdata = "";
    var filteredBooks = '';
    useEffect(() => {
        http.get(`/view-books`).then(res => {
            if (res.data.status === 200) {
                setBook(res.data.books);
                setLoading(false);
            }
        });
    }, []);

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    const handleIdChange = (e) => {
        setSelectedId(e.target.value);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
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

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
            </div>
        );
    } else {
        filteredBooks = viewBooks.filter((item) =>
            (item.book_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.selling_price.toString().toLowerCase().includes(searchTerm.toLowerCase())) &&
            (selectedCategory === '' || item.category.name.toLowerCase() === selectedCategory.toLowerCase()) &&
            (selectedId === '' || item.id.toString() === selectedId)
        );
        display_Booksdata = filteredBooks.map((item) => {
            const showQuantityButtons = user && parseInt(user.id) === parseInt(item.seller_id);

            return (
                <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.user.name}</td>
                    <td>{item.category.name}</td>
                    <td>{item.book_title}</td>
                    <td>{item.selling_price}</td>
                    <td><img src={`http://127.0.0.1:8000/${item.cover_image}`} alt={item.book_title} width="50px" /></td>
                    <td><Link to={`/admin/edit-book/${item.id}`} className="btn btn-success btn-sm">Edit</Link></td>
                    <td>{item.request == '0' ? (
                            <span>Pending</span>
                        ) : item.request == '1' ? (
                            <span>Accepted</span>
                        ) : item.request == '2' ? (
                            <span>Rejected</span>
                        ) : (
                            <span>Unknown Status</span>
                        )}</td>
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
            )
        });
    }
    const categories = [...new Set(viewBooks.map(item => item.category.name))];
    const ids = [...new Set(viewBooks.map(item => item.id))];
    const sellers = [...new Set(viewBooks.map(item => item.user.name))];

    return (
        <div className="container px-4 mt-3">
            <div className="card">
                <div className="card-header">
                    <h4>View Books
                        <Link to="/admin/add-book" className="btn btn-primary btn-sm float-end" >Add Book</Link>
                    </h4>
                    <div className="mb-3">
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
                    <div className="mb-3">
                        <label>Filter by ID:</label>
                        <select
                            value={selectedId}
                            onChange={handleIdChange}
                            className="form-control"
                        >
                            <option value="">All IDs</option>
                            {ids.map(id => (
                                <option key={id} value={id}>
                                    {id}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Seller Name</th>
                                    <th>CategoryName</th>
                                    <th>Book Name</th>
                                    <th>Selling Price</th>
                                    <th>Image</th>
                                    <th>Edit</th>
                                    <th>Status</th>
                                    <th>Qty</th>
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
