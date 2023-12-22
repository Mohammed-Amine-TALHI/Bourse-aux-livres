import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import swal from "sweetalert";
import AuthUser from "../forms/AuthUser";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import "./books.css";

const ViewBooks = () => {
  const [search, setSearch] = useState("");
  const { http } = AuthUser();
  const [bookData, setBookData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const bookCount = bookData.length; 

  useEffect(() => {
    let isMounted = true;

    http.get("/Books").then((res) => {
      if (isMounted) {
        if (res.data.status === 200) {
          setBookData(res.data.books);
          setLoading(false);
        } else if (res.data.status === 404) {
          swal("Warning", res.data.message, "error");
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, [http]);
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
};

const handleIdChange = (e) => {
    setSelectedId(e.target.value);
};
const handleSearch = (e) => {
    setSearchTerm(e.target.value);
};
  var display_Booksdata = "";
  var filteredBooks = '';
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  } else {

    const filteredBooks = bookData.filter((item) =>
    (item.book_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.selling_price.toString().toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedCategory === '' || item.category.name.toLowerCase() === selectedCategory.toLowerCase()) &&
    (selectedId === '' || item.id.toString() === selectedId)
);
if (bookCount>0){
display_Booksdata = filteredBooks.map((books) => (
  <div className="col-md-3" key={books.id}>
    <div className="card">
      <Link to={`/collections/${books.category.slug}/${books.id}`}>
        <img
          src={`http://localhost:8000/${books.cover_image}`}
          className="w-100"
          alt={books.book_title}
        />
      </Link>
      <div className="card-body">
        <Link to={`/collections/${books.category.slug}/${books.id}` }  style={{ textDecoration: 'none', color: 'inherit' }}>
          <h5>{books.book_title}</h5>
        </Link>
      </div>
    </div>
  </div>
));
}
else{
  display_Booksdata = 
        <div className="col-md-12">
            <h4>No Book Available for</h4>
        </div>
}
  }
  const categories = [...new Set(bookData.map(item => item.category.name))];

  return (
    <div>
      <Header />
      <section className="books">
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
        <div className="books-wrapper">
          {display_Booksdata}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ViewBooks;
