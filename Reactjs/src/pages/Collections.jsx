import { Link, useParams } from "react-router-dom";
import BookCard from "../components/BookCard";
import { Breadcrumb, EmptyState, ErrorState, Loader, useTitle } from "../components/ui";
import useFetch from "../hooks/useFetch";
import { categoryIcon } from "../utils/format";
import NotFound from "./NotFound";

export const Collections = () => {
  useTitle("Collections");
  const { data, loading, error, reload } = useFetch("/categories");

  return (
    <>
      <div className="container page-head">
        <span className="eyebrow">Collections</span>
        <h1>Browse by collection</h1>
        <p>Pick a subject and see what other students are selling.</p>
      </div>

      <div className="container section-tight">
        {loading ? (
          <Loader />
        ) : error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : data.categories.length === 0 ? (
          <EmptyState icon="bi-collection" title="No collection yet">
            Collections will appear here as soon as an admin creates them.
          </EmptyState>
        ) : (
          <div className="category-grid">
            {data.categories.map((category, index) => (
              <Link key={category.id} to={`/collections/${category.slug}`} className={`category-card tone-${index % 4}`}>
                <span className="icon">
                  <i className={`bi ${categoryIcon(category.name)}`} />
                </span>
                <h3>{category.name}</h3>
                <p>{category.description}</p>
                <span className="count">
                  {category.books_count} {category.books_count === 1 ? "book" : "books"}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export const CollectionBooks = () => {
  const { slug } = useParams();
  const { data, loading, error, status, reload } = useFetch(`/categories/${slug}/books`);
  useTitle(data?.category.name || "Collection");

  if (loading) return <Loader page />;
  if (status === 404) return <NotFound />;
  if (error) {
    return (
      <div className="container section">
        <ErrorState message={error} onRetry={reload} />
      </div>
    );
  }

  const { category, books } = data;

  return (
    <>
      <div className="container page-head">
        <Breadcrumb items={[{ label: "Collections", to: "/collections" }, { label: category.name }]} />
        <h1>{category.name}</h1>
        {category.description && <p>{category.description}</p>}
      </div>

      <div className="container section-tight">
        {books.length > 0 ? (
          <div className="book-grid">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon="bi-journal-x"
            title="Nothing on sale here yet"
            action={
              <Link to="/add-book" className="btn btn-primary">
                Sell a book
              </Link>
            }
          >
            Be the first to list a book in {category.name}.
          </EmptyState>
        )}
      </div>
    </>
  );
};
