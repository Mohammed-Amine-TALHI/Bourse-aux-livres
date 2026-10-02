import { Link } from "react-router-dom";
import { useTitle } from "../components/ui";

const NotFound = () => {
  useTitle("Page not found");

  return (
    <div className="notfound">
      <div>
        <div className="code">
          4<em>0</em>4
        </div>
        <h1>This page is out of print</h1>
        <p>The page or the book you are looking for does not exist, or is no longer on sale.</p>
        <Link to="/" className="btn btn-primary">
          <i className="bi bi-arrow-left" /> Back to the home page
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
