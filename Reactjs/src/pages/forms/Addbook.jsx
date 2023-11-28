import Header from "../../components/header/Header";
import React,{ useState } from "react";
import AuthUser from '../../pages/forms/AuthUser';
import NotFound from "../404/NotFound";
const Addbook = () => {
  const {http,token} = AuthUser();
  const [description, setDescription] = useState('');
  const maxWords = 100; // Set your desired word limit here

  const handleChange = (event) => {
    const words = event.target.value.split(/\s+/).filter((word) => word.length > 0);
    const remainingWords = maxWords - words.length;

    if (remainingWords >= 0) {
      setDescription(event.target.value);
    } else {
      setDescription(event.target.value.split(/\s+/).slice(0, maxWords).join(' '));
    }
  };

  
    return (
      <div>
        {token ?  (
        <section>
          <Header/>
        <div class="book-form">
  <h2>Add a New Book</h2>
  <form>
  <label for="title">Title:</label>
  <input type="text" id="title" name="title" placeholder="Enter the book title" required />

  <label for="author">Author:</label>
  <input type="text" id="author" name="author" placeholder="Enter the author's name" required />

  <label for="genre">Genre:</label>
  <select id="genre" name="genre" required>
    <option value="">Select a Genre</option>
    <option value="Mystery">Mystery</option>
    <option value="Science Fiction">Science Fiction</option>
    <option value="Fantasy">Fantasy</option>
    <option value="Romance">Romance</option>
  </select>

  <label for="year">Publication Year:</label>
  <input type="date" id="year" name="year" required />
  
      <label htmlFor="description">Description:</label>
      <textarea
        id="description"
        name="description"
        rows="6"
        value={description}
        onChange={handleChange}
        placeholder="Enter your description here"
        required
      ></textarea>
      <p className="word-count">
        {description.split(/\s+/).filter((word) => word.length > 0).length}/100
      </p>
    

  
  <label for="image">Upload Image:</label>
  <div class="image-upload">
    <input type="file" id="image" name="image" accept="image/*" required />
    <label for="image" class="upload-button"><i class="fa fa-upload"></i> Choose File</label>

    <p class="subcategories">Supported formats: JPG, PNG, GIF</p>
  </div>

  <button type="submit">Add Book</button>
</form>
</div>
</section>) : (<div><NotFound/></div>)}

      
      </div>
    );
  };
  
  export default Addbook;