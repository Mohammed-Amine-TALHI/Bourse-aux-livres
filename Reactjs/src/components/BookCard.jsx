import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { errorMessage } from "../api/http";
import { useAuth } from "../context/AuthContext";
import { discount, formatPrice } from "../utils/format";

const PALETTE = ["#1f4d3f", "#8a3b24", "#2f4a6d", "#6b4a1e", "#5a2f4f", "#2d5a5a", "#7a2e2e", "#3d4a2a"];

const colorFor = (text = "") => {
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
  return PALETTE[hash % PALETTE.length];
};

/** The cover picture, or a typeset cover when the seller did not upload one. */
export const BookCover = ({ book, className = "" }) => (
  <div className={`cover ${className}`}>
    {book.cover_url ? (
      <img src={book.cover_url} alt={`Cover of ${book.book_title}`} loading="lazy" />
    ) : (
      <div className="cover-fallback" style={{ background: colorFor(book.book_title) }} aria-hidden="true">
        <span className="t">{book.book_title}</span>
        <span className="rule" />
        <span className="a">{book.author}</span>
      </div>
    )}
  </div>
);

export const bookPath = (book) => `/collections/${book.category?.slug || "books"}/${book.id}`;

export const useWishToggle = () => {
  const { user, toggleWish } = useAuth();
  const navigate = useNavigate();

  return async (book) => {
    if (!user) {
      toast.info("Log in to save books to your wishlist.");
      navigate("/login", { state: { from: bookPath(book) } });
      return;
    }
    try {
      const saved = await toggleWish(book.id);
      toast.success(saved ? "Added to your wishlist." : "Removed from your wishlist.");
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };
};

const BookCard = ({ book }) => {
  const { wishIds } = useAuth();
  const toggle = useWishToggle();
  const saved = wishIds.includes(book.id);
  const off = discount(book);

  return (
    <article className="book-card">
      <div className="book-card-tags">
        {off >= 10 && <span className="tag">-{off}%</span>}
        {Number(book.qty) === 0 && <span className="tag dark">Sold out</span>}
      </div>
      <button
        type="button"
        className={`book-card-wish${saved ? " on" : ""}`}
        onClick={() => toggle(book)}
        aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
        aria-pressed={saved}
      >
        <i className={`bi ${saved ? "bi-heart-fill" : "bi-heart"}`} />
      </button>
      <BookCover book={book} />
      <div className="book-card-body">
        <span className="book-card-cat">{book.category?.name}</span>
        <h3 className="book-card-title">
          <Link to={bookPath(book)}>{book.book_title}</Link>
        </h3>
        <p className="book-card-author">{book.author || "Unknown author"}</p>
        <div className="price">
          <strong>{formatPrice(book.selling_price)}</strong>
          {off && <s>{formatPrice(book.original_price)}</s>}
        </div>
      </div>
    </article>
  );
};

export default BookCard;
