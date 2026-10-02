import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import http, { errorMessage } from "../api/http";
import { BookCover, bookPath } from "../components/BookCard";
import { Badge, ConfirmDialog, EmptyState, ErrorState, Loader, RequestBadge, useTitle } from "../components/ui";
import useFetch from "../hooks/useFetch";
import { REQUEST, formatPrice } from "../utils/format";

export const QuantityStepper = ({ book, onChange }) => {
  const [busy, setBusy] = useState(false);

  const change = async (delta) => {
    setBusy(true);
    try {
      const { data } = await http.patch(`/books/${book.id}/quantity`, { quantity: book.qty + delta });
      onChange(data.book);
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="stepper">
      <button type="button" onClick={() => change(-1)} disabled={busy || book.qty <= 0} aria-label="Decrease quantity">
        <i className="bi bi-dash" />
      </button>
      <span>{book.qty}</span>
      <button type="button" onClick={() => change(1)} disabled={busy} aria-label="Increase quantity">
        <i className="bi bi-plus" />
      </button>
    </div>
  );
};

const MyBooks = () => {
  useTitle("My books");
  const { data, loading, error, reload, setData } = useFetch("/my/books");
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const books = data?.books || [];
  const count = (request) => books.filter((book) => book.request === request).length;

  const replaceBook = (updated) =>
    setData((prev) => ({ books: prev.books.map((book) => (book.id === updated.id ? { ...book, ...updated } : book)) }));

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await http.delete(`/books/${toDelete.id}`);
      setData((prev) => ({ books: prev.books.filter((book) => book.id !== toDelete.id) }));
      toast.success("Book deleted.");
      setToDelete(null);
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="container page-head">
        <div className="page-head-row">
          <div>
            <span className="eyebrow">Your account</span>
            <h1>My books</h1>
            <p>Follow the status of your listings and keep your stock up to date.</p>
          </div>
          <Link to="/add-book" className="btn btn-accent">
            <i className="bi bi-plus-lg" /> Sell a book
          </Link>
        </div>
      </div>

      <div className="container section-tight">
        {loading ? (
          <Loader />
        ) : error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : books.length === 0 ? (
          <EmptyState
            icon="bi-journal-plus"
            title="You are not selling anything yet"
            action={
              <Link to="/add-book" className="btn btn-primary">
                List your first book
              </Link>
            }
          >
            List the books you no longer need. Other students will contact you directly.
          </EmptyState>
        ) : (
          <>
            <div className="stat-grid" style={{ marginBottom: 24 }}>
              <div className="stat tone-0">
                <i className="bi bi-journals" />
                <div>
                  <strong>{books.length}</strong>
                  <span>Listings</span>
                </div>
              </div>
              <div className="stat tone-3">
                <i className="bi bi-patch-check" />
                <div>
                  <strong>{count(REQUEST.APPROVED)}</strong>
                  <span>Approved</span>
                </div>
              </div>
              <div className="stat tone-2">
                <i className="bi bi-hourglass-split" />
                <div>
                  <strong>{count(REQUEST.PENDING)}</strong>
                  <span>Pending review</span>
                </div>
              </div>
              <div className="stat tone-1">
                <i className="bi bi-x-octagon" />
                <div>
                  <strong>{count(REQUEST.REJECTED)}</strong>
                  <span>Rejected</span>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Book</th>
                      <th>Collection</th>
                      <th>Price</th>
                      <th>Status</th>
                      <th>Quantity</th>
                      <th className="right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {books.map((book) => (
                      <tr key={book.id}>
                        <td>
                          <div className="cell-book">
                            <BookCover book={book} />
                            <div>
                              <strong>{book.book_title}</strong>
                              <span>{book.author || "Unknown author"}</span>
                            </div>
                          </div>
                        </td>
                        <td>{book.category.name}</td>
                        <td>
                          <strong>{formatPrice(book.selling_price)}</strong>
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                            <RequestBadge request={book.request} />
                            {book.status === 1 && <Badge tone="neutral">Hidden</Badge>}
                          </div>
                        </td>
                        <td>
                          <QuantityStepper book={book} onChange={replaceBook} />
                        </td>
                        <td>
                          <div className="cell-actions">
                            <Link to={bookPath(book)} className="icon-btn" aria-label="View" title="View">
                              <i className="bi bi-eye" />
                            </Link>
                            <Link to={`/edit-book/${book.id}`} className="icon-btn" aria-label="Edit" title="Edit">
                              <i className="bi bi-pencil" />
                            </Link>
                            <button
                              type="button"
                              className="icon-btn danger"
                              onClick={() => setToDelete(book)}
                              aria-label="Delete"
                              title="Delete"
                            >
                              <i className="bi bi-trash3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {toDelete && (
        <ConfirmDialog
          title="Delete this book?"
          description={`"${toDelete.book_title}" will be removed from the catalogue. This cannot be undone.`}
          busy={deleting}
          onConfirm={confirmDelete}
          onClose={() => setToDelete(null)}
        />
      )}
    </>
  );
};

export default MyBooks;
