import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import http, { errorMessage } from "../../api/http";
import { BookCover } from "../../components/BookCard";
import { Badge, ConfirmDialog, EmptyState, ErrorState, Loader, useTitle } from "../../components/ui";
import useFetch from "../../hooks/useFetch";
import { formatPrice, requestLabel } from "../../utils/format";

const AdminBooks = () => {
  useTitle("Books · Admin");
  const { data, loading, error, reload, setData } = useFetch("/admin/books");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [request, setRequest] = useState("");
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const books = useMemo(() => data?.books || [], [data]);
  const categories = useMemo(() => [...new Set(books.map((book) => book.category.name))].sort(), [books]);

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return books.filter(
      (book) =>
        (!category || book.category.name === category) &&
        (request === "" || book.request === Number(request)) &&
        (!needle ||
          [book.book_title, book.author, book.seller.name, String(book.id)]
            .filter(Boolean)
            .some((value) => value.toLowerCase().includes(needle)))
    );
  }, [books, search, category, request]);

  const updateRequest = async (book, value) => {
    try {
      await http.patch(`/admin/books/${book.id}/request`, { request: value });
      setData((prev) => ({
        books: prev.books.map((item) => (item.id === book.id ? { ...item, request: value } : item)),
      }));
      toast.success(`"${book.book_title}" marked as ${requestLabel(value).toLowerCase()}.`);
    } catch (err) {
      toast.error(errorMessage(err));
    }
  };

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

  if (loading) return <Loader page />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>Books</h1>
          <p>Every listing on the marketplace, whatever its status.</p>
        </div>
        <Link to="/add-book" className="btn btn-primary">
          <i className="bi bi-plus-lg" /> Add a book
        </Link>
      </div>

      <div className="card">
        <div className="admin-filters">
          <div className="input-icon">
            <i className="bi bi-search" />
            <input
              type="search"
              className="input"
              placeholder="Search a title, an author, a seller or an ID…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search books"
            />
          </div>
          <select
            className="select"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            aria-label="Filter by collection"
          >
            <option value="">All collections</option>
            {categories.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <select
            className="select"
            value={request}
            onChange={(event) => setRequest(event.target.value)}
            aria-label="Filter by status"
          >
            <option value="">All statuses</option>
            <option value="0">Pending review</option>
            <option value="1">Approved</option>
            <option value="2">Rejected</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding: 24 }}>
            <EmptyState icon="bi-search" title="No book found">
              Try another keyword or remove a filter.
            </EmptyState>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Book</th>
                  <th>Seller</th>
                  <th>Collection</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Request</th>
                  <th className="right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((book) => (
                  <tr key={book.id}>
                    <td className="muted">{book.id}</td>
                    <td>
                      <div className="cell-book">
                        <BookCover book={book} />
                        <div>
                          <strong>
                            <Link to={`/collections/${book.category.slug}/${book.id}`}>{book.book_title}</Link>
                          </strong>
                          <span style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
                            {book.author || "Unknown author"}
                            {book.featured && (
                              <Badge tone="accent" plain>
                                Featured
                              </Badge>
                            )}
                            {book.popular && (
                              <Badge tone="info" plain>
                                Popular
                              </Badge>
                            )}
                            {book.status === 1 && (
                              <Badge tone="neutral" plain>
                                Hidden
                              </Badge>
                            )}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>{book.seller.name}</td>
                    <td>{book.category.name}</td>
                    <td>
                      <strong>{formatPrice(book.selling_price)}</strong>
                    </td>
                    <td>{book.qty}</td>
                    <td>
                      <select
                        className="select select-sm"
                        value={book.request}
                        onChange={(event) => updateRequest(book, Number(event.target.value))}
                        aria-label={`Request status of ${book.book_title}`}
                      >
                        <option value={0}>Pending</option>
                        <option value={1}>Approved</option>
                        <option value={2}>Rejected</option>
                      </select>
                    </td>
                    <td>
                      <div className="cell-actions">
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
        )}
      </div>

      {toDelete && (
        <ConfirmDialog
          title="Delete this book?"
          description={`"${toDelete.book_title}" by ${toDelete.seller.name} will be removed permanently.`}
          busy={deleting}
          onConfirm={confirmDelete}
          onClose={() => setToDelete(null)}
        />
      )}
    </>
  );
};

export default AdminBooks;
