import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import http, { errorMessage } from "../../api/http";
import { BookCover } from "../../components/BookCard";
import { EmptyState, ErrorState, Loader, useTitle } from "../../components/ui";
import useFetch from "../../hooks/useFetch";
import { REQUEST, formatDate, formatPrice } from "../../utils/format";

const STATS = [
  { key: "pending", label: "Waiting for review", icon: "bi-hourglass-split", tone: 2 },
  { key: "approved", label: "Books on sale", icon: "bi-patch-check", tone: 0 },
  { key: "users", label: "Registered users", icon: "bi-people", tone: 3 },
  { key: "categories", label: "Collections", icon: "bi-collection", tone: 1 },
];

const Dashboard = () => {
  useTitle("Admin dashboard");
  const { data, loading, error, reload, setData } = useFetch("/admin/stats");
  const [busyId, setBusyId] = useState(null);

  const review = async (book, request) => {
    setBusyId(book.id);
    try {
      await http.patch(`/admin/books/${book.id}/request`, { request });
      setData((prev) => ({
        stats: {
          ...prev.stats,
          pending: prev.stats.pending - 1,
          approved: prev.stats.approved + (request === REQUEST.APPROVED ? 1 : 0),
          rejected: prev.stats.rejected + (request === REQUEST.REJECTED ? 1 : 0),
        },
        pending: prev.pending.filter((item) => item.id !== book.id),
      }));
      toast.success(request === REQUEST.APPROVED ? `"${book.book_title}" is now on sale.` : "Listing rejected.");
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <Loader page />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>Dashboard</h1>
          <p>An overview of the marketplace and the listings waiting for you.</p>
        </div>
        <Link to="/admin/books" className="btn btn-outline">
          <i className="bi bi-journals" /> All books
        </Link>
      </div>

      <div className="stat-grid">
        {STATS.map((stat) => (
          <div key={stat.key} className={`stat tone-${stat.tone}`}>
            <i className={`bi ${stat.icon}`} />
            <div>
              <strong>{data.stats[stat.key]}</strong>
              <span>{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      <section className="admin-section">
        {data.pending.length === 0 ? (
          <EmptyState icon="bi-check2-circle" title="You are all caught up">
            No listing is waiting for a review. New submissions will show up here.
          </EmptyState>
        ) : (
          <div className="card">
            <div className="card-head">
              <h2 className="card-title">Review queue</h2>
              <span className="muted">{data.pending.length} pending</span>
            </div>
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Book</th>
                    <th>Seller</th>
                    <th>Collection</th>
                    <th>Price</th>
                    <th>Submitted</th>
                    <th className="right">Decision</th>
                  </tr>
                </thead>
                <tbody>
                  {data.pending.map((book) => (
                    <tr key={book.id}>
                      <td>
                        <div className="cell-book">
                          <BookCover book={book} />
                          <div>
                            <strong>
                              <Link to={`/collections/${book.category.slug}/${book.id}`}>{book.book_title}</Link>
                            </strong>
                            <span>{book.author || "Unknown author"}</span>
                          </div>
                        </div>
                      </td>
                      <td>{book.seller.name}</td>
                      <td>{book.category.name}</td>
                      <td>
                        <strong>{formatPrice(book.selling_price)}</strong>
                      </td>
                      <td>{formatDate(book.created_at)}</td>
                      <td>
                        <div className="cell-actions">
                          <button
                            type="button"
                            className="btn btn-danger-soft btn-sm"
                            onClick={() => review(book, REQUEST.REJECTED)}
                            disabled={busyId === book.id}
                          >
                            <i className="bi bi-x-lg" /> Reject
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => review(book, REQUEST.APPROVED)}
                            disabled={busyId === book.id}
                          >
                            <i className="bi bi-check-lg" /> Approve
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default Dashboard;
