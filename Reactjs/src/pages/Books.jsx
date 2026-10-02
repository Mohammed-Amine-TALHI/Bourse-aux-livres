import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import BookCard from "../components/BookCard";
import { EmptyState, ErrorState, Loader, useTitle } from "../components/ui";
import useFetch from "../hooks/useFetch";

const SORTS = {
  newest: { label: "Newest first", compare: (a, b) => new Date(b.created_at) - new Date(a.created_at) },
  "price-asc": { label: "Price: low to high", compare: (a, b) => a.selling_price - b.selling_price },
  "price-desc": { label: "Price: high to low", compare: (a, b) => b.selling_price - a.selling_price },
  title: { label: "Title A-Z", compare: (a, b) => a.book_title.localeCompare(b.book_title) },
};

const Books = () => {
  useTitle("Books");
  const { data, loading, error, reload } = useFetch("/books");
  const [params, setParams] = useSearchParams();

  const search = params.get("q") || "";
  const category = params.get("category") || "";
  const sort = SORTS[params.get("sort")] ? params.get("sort") : "newest";

  const setParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  const books = useMemo(() => data?.books || [], [data]);

  const categories = useMemo(
    () => [...new Map(books.map((book) => [book.category.slug, book.category.name])).entries()].sort(),
    [books]
  );

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return books
      .filter((book) => !category || book.category.slug === category)
      .filter(
        (book) =>
          !needle ||
          [book.book_title, book.author, book.isbn, book.school_name, book.genre]
            .filter(Boolean)
            .some((value) => value.toLowerCase().includes(needle))
      )
      .sort(SORTS[sort].compare);
  }, [books, search, category, sort]);

  return (
    <>
      <div className="container page-head">
        <span className="eyebrow">Catalogue</span>
        <h1>All books</h1>
        <p>Every book currently on sale. Search by title, author, ISBN or school.</p>
      </div>

      <div className="container section-tight">
        <div className="toolbar">
          <div className="input-icon">
            <i className="bi bi-search" />
            <input
              type="search"
              className="input"
              placeholder="Search a title, an author, an ISBN…"
              value={search}
              onChange={(event) => setParam("q", event.target.value)}
              aria-label="Search books"
            />
          </div>
          <select
            className="select"
            value={category}
            onChange={(event) => setParam("category", event.target.value)}
            aria-label="Filter by collection"
          >
            <option value="">All collections</option>
            {categories.map(([slug, name]) => (
              <option key={slug} value={slug}>
                {name}
              </option>
            ))}
          </select>
          <select
            className="select"
            value={sort}
            onChange={(event) => setParam("sort", event.target.value)}
            aria-label="Sort books"
          >
            {Object.entries(SORTS).map(([key, option]) => (
              <option key={key} value={key}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <Loader />
        ) : error ? (
          <div style={{ marginTop: 24 }}>
            <ErrorState message={error} onRetry={reload} />
          </div>
        ) : (
          <>
            <div className="toolbar-meta">
              <span>
                <strong style={{ color: "var(--ink)" }}>{filtered.length}</strong>{" "}
                {filtered.length === 1 ? "book" : "books"} found
              </span>
              {(search || category) && (
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => setParams({}, { replace: true })}>
                  <i className="bi bi-x-lg" /> Clear filters
                </button>
              )}
            </div>

            {filtered.length > 0 ? (
              <div className="book-grid">
                {filtered.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            ) : (
              <EmptyState icon="bi-search" title="No book matches your search">
                Try another keyword or remove a filter.
              </EmptyState>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Books;
