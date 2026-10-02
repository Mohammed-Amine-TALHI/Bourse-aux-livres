import { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import BookCard, { BookCover, useWishToggle } from "../components/BookCard";
import { Badge, Breadcrumb, ErrorState, Loader, RequestBadge, StockBadge, useTitle } from "../components/ui";
import { useAuth } from "../context/AuthContext";
import useFetch from "../hooks/useFetch";
import { REQUEST, discount, formatDate, formatPrice, initials, whatsappLink } from "../utils/format";
import NotFound from "./NotFound";

const BookDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const { user, wishIds } = useAuth();
  // Refetch when the session changes: the seller's phone is only sent to logged-in users.
  const { data, loading, error, status, reload } = useFetch(`/books/${id}${user ? "?auth=1" : ""}`);
  const toggleWish = useWishToggle();
  const [showContact, setShowContact] = useState(false);

  useTitle(data?.book.book_title || "Book");

  if (loading) return <Loader page />;
  if (status === 404) return <NotFound />;
  if (error) {
    return (
      <div className="container section">
        <ErrorState message={error} onRetry={reload} />
      </div>
    );
  }

  const { book, seller_phone: phone, can_manage: canManage, related } = data;
  const saved = wishIds.includes(book.id);
  const off = discount(book);
  const isOwner = user?.id === book.seller_id;
  const message = `Hello ${book.seller.name}, I am interested in your book "${book.book_title}" on Bourse aux Livres.`;

  return (
    <div className="container section-tight" style={{ paddingTop: 32 }}>
      <Breadcrumb
        items={[
          { label: "Collections", to: "/collections" },
          { label: book.category.name, to: `/collections/${book.category.slug}` },
          { label: book.book_title },
        ]}
      />

      {canManage && book.request !== REQUEST.APPROVED && (
        <div
          className={`notice ${book.request === REQUEST.REJECTED ? "notice-danger" : "notice-warning"}`}
          style={{ marginTop: 20 }}
        >
          <i className="bi bi-info-circle" />
          <span>
            {book.request === REQUEST.REJECTED
              ? "This listing was rejected by an admin and is not visible to other students."
              : "This listing is waiting for an admin review. Only you can see it for now."}
          </span>
        </div>
      )}

      <div className="detail">
        <div className="detail-cover">
          <BookCover book={book} />
        </div>

        <div>
          <Link to={`/collections/${book.category.slug}`} className="eyebrow">
            {book.category.name}
          </Link>
          <h1>{book.book_title}</h1>
          {book.author && <p className="detail-author">by {book.author}</p>}

          <div className="detail-badges">
            <StockBadge qty={book.qty} />
            {book.featured && (
              <Badge tone="accent" plain>
                <i className="bi bi-star-fill" /> Featured
              </Badge>
            )}
            {canManage && <RequestBadge request={book.request} />}
          </div>

          <div className="detail-price">
            <strong>{formatPrice(book.selling_price)}</strong>
            {off && (
              <>
                <s>{formatPrice(book.original_price)}</s>
                <Badge tone="accent" plain>
                  Save {off}%
                </Badge>
              </>
            )}
          </div>

          <div className="detail-actions">
            {!isOwner && (
              <button type="button" className="btn btn-primary btn-lg" onClick={() => setShowContact(true)}>
                <i className="bi bi-chat-dots" /> Contact the seller
              </button>
            )}
            {!isOwner && (
              <button type="button" className="btn btn-outline btn-lg" onClick={() => toggleWish(book)}>
                <i className={`bi ${saved ? "bi-heart-fill" : "bi-heart"}`} style={saved ? { color: "var(--accent)" } : {}} />
                {saved ? "Saved" : "Add to wishlist"}
              </button>
            )}
            {canManage && (
              <Link to={`/edit-book/${book.id}`} className="btn btn-outline btn-lg">
                <i className="bi bi-pencil" /> Edit listing
              </Link>
            )}
          </div>

          {showContact && !isOwner && (
            <div className="contact-box">
              <div className="who">
                <span className="avatar">{initials(book.seller.name)}</span>
                <div>
                  <strong>{book.seller.name}</strong>
                  <span>{phone ? phone : "Seller on Bourse aux Livres"}</span>
                </div>
              </div>
              {phone ? (
                <div className="links">
                  <a
                    className="btn btn-primary btn-sm"
                    href={whatsappLink(phone, message)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="bi bi-whatsapp" /> WhatsApp
                  </a>
                  <a className="btn btn-outline btn-sm" href={`tel:${phone}`}>
                    <i className="bi bi-telephone" /> Call
                  </a>
                </div>
              ) : (
                <div className="links">
                  <Link to="/login" state={{ from: location.pathname }} className="btn btn-primary btn-sm">
                    Log in to see the phone number
                  </Link>
                </div>
              )}
            </div>
          )}

          <div className="detail-section">
            <h2>Description</h2>
            <p>{book.description}</p>
          </div>

          <div className="detail-section">
            <h2>Details</h2>
            <dl className="specs">
              <div>
                <dt>Seller</dt>
                <dd>{book.seller.name}</dd>
              </div>
              <div>
                <dt>Collection</dt>
                <dd>{book.category.name}</dd>
              </div>
              {book.school_name && (
                <div>
                  <dt>School</dt>
                  <dd>{book.school_name}</dd>
                </div>
              )}
              {book.genre && (
                <div>
                  <dt>Genre</dt>
                  <dd>{book.genre}</dd>
                </div>
              )}
              {book.isbn && (
                <div>
                  <dt>ISBN</dt>
                  <dd>{book.isbn}</dd>
                </div>
              )}
              <div>
                <dt>Listed on</dt>
                <dd>{formatDate(book.created_at)}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section style={{ marginTop: 72 }}>
          <div className="section-head">
            <h2 className="section-title">More in {book.category.name}</h2>
            <Link to={`/collections/${book.category.slug}`} className="link-arrow">
              View all <i className="bi bi-arrow-right" />
            </Link>
          </div>
          <div className="book-grid">
            {related.map((item) => (
              <BookCard key={item.id} book={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default BookDetails;
