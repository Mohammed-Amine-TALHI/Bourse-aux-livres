import { Link } from "react-router-dom";
import BookCard from "../components/BookCard";
import { EmptyState, ErrorState, Loader, useTitle } from "../components/ui";
import { useAuth } from "../context/AuthContext";
import useFetch from "../hooks/useFetch";

const Wishlist = () => {
  useTitle("Wishlist");
  const { wishIds } = useAuth();
  const { data, loading, error, reload } = useFetch("/wishlist");

  // Books removed with the heart button disappear immediately.
  const books = (data?.books || []).filter((book) => wishIds.includes(book.id));

  return (
    <>
      <div className="container page-head">
        <span className="eyebrow">Your account</span>
        <h1>Wishlist</h1>
        <p>The books you saved for later. Contact the seller before someone else does.</p>
      </div>

      <div className="container section-tight">
        {loading ? (
          <Loader />
        ) : error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : books.length === 0 ? (
          <EmptyState
            icon="bi-heart"
            title="Your wishlist is empty"
            action={
              <Link to="/books" className="btn btn-primary">
                Browse books
              </Link>
            }
          >
            Tap the heart on any book to keep it here.
          </EmptyState>
        ) : (
          <div className="book-grid">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Wishlist;
