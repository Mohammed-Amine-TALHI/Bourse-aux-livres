import { Link } from "react-router-dom";
import BookCard, { BookCover } from "../components/BookCard";
import { ErrorState, Loader, useTitle } from "../components/ui";
import { useAuth } from "../context/AuthContext";
import useFetch from "../hooks/useFetch";
import { categoryIcon } from "../utils/format";

const STEPS = [
  {
    icon: "bi-camera",
    title: "List your book",
    text: "Add a photo, a price and a short description. It takes less than two minutes.",
  },
  {
    icon: "bi-patch-check",
    title: "Get it approved",
    text: "An admin reviews every listing so the catalogue stays clean and trustworthy.",
  },
  {
    icon: "bi-people",
    title: "Meet on campus",
    text: "Buyers contact you directly. You agree on a place and hand over the book.",
  },
];

const BookRow = ({ title, subtitle, books }) =>
  books.length > 0 && (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="container">
        <div className="section-head">
          <div>
            <h2 className="section-title">{title}</h2>
            <p className="section-sub">{subtitle}</p>
          </div>
          <Link to="/books" className="link-arrow">
            View all <i className="bi bi-arrow-right" />
          </Link>
        </div>
        <div className="book-row">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </div>
    </section>
  );

const Home = () => {
  useTitle("");
  const { user } = useAuth();
  const highlights = useFetch("/books/highlights");
  const categories = useFetch("/categories");

  if (highlights.loading) return <Loader page />;
  if (highlights.error) {
    return (
      <div className="container section">
        <ErrorState message={highlights.error} onRetry={highlights.reload} />
      </div>
    );
  }

  const { popular, featured, latest, stats } = highlights.data;
  const heroBooks = [...popular, ...featured, ...latest]
    .filter((book, index, all) => book.cover_url && all.findIndex((b) => b.id === book.id) === index)
    .slice(0, 3);

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="eyebrow">
              <i className="bi bi-mortarboard-fill" /> The student book exchange
            </span>
            <h1>
              Give your books
              <br />a <em>second life.</em>
            </h1>
            <p className="hero-lead">
              Buy the textbooks you need for half the price and sell the ones gathering dust on your shelf, directly
              between students.
            </p>
            <div className="hero-cta">
              <Link to="/books" className="btn btn-primary btn-lg">
                Browse books <i className="bi bi-arrow-right" />
              </Link>
              <Link to={user ? "/add-book" : "/register"} className="btn btn-outline btn-lg">
                Sell a book
              </Link>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <strong>{stats.books}</strong>
                <span>books on sale</span>
              </div>
              <div className="hero-stat">
                <strong>{stats.sellers}</strong>
                <span>student sellers</span>
              </div>
              <div className="hero-stat">
                <strong>{stats.categories}</strong>
                <span>collections</span>
              </div>
            </div>
          </div>

          {heroBooks.length === 3 && (
            <div className="hero-art" aria-hidden="true">
              {heroBooks.map((book) => (
                <BookCover key={book.id} book={book} className="hero-cover" />
              ))}
              <div className="hero-tag">
                <i className="bi bi-piggy-bank" />
                <div>
                  <strong>Up to 60% cheaper</strong>
                  <span>than buying new</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="section" style={{ paddingTop: 8 }}>
        <div className="container">
          <div className="steps">
            {STEPS.map((step, index) => (
              <div className="step" key={step.title}>
                <span className="step-num">0{index + 1}</span>
                <i className={`bi ${step.icon}`} />
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <BookRow title="Popular right now" subtitle="The books students are looking at the most." books={popular} />

      {categories.data?.categories.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="container">
            <div className="section-head">
              <div>
                <h2 className="section-title">Browse by collection</h2>
                <p className="section-sub">From prépa maths to weekend novels.</p>
              </div>
              <Link to="/collections" className="link-arrow">
                All collections <i className="bi bi-arrow-right" />
              </Link>
            </div>
            <div className="category-grid">
              {categories.data.categories.slice(0, 8).map((category, index) => (
                <Link
                  key={category.id}
                  to={`/collections/${category.slug}`}
                  className={`category-card tone-${index % 4}`}
                >
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
          </div>
        </section>
      )}

      <BookRow title="Featured" subtitle="Hand-picked by the team." books={featured} />
      <BookRow title="Just added" subtitle="Fresh listings from other students." books={latest} />

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="cta-band">
            <div>
              <h2>Finished with last year's books?</h2>
              <p>Someone in the class below needs them. List them today and get paid on campus.</p>
            </div>
            <Link to={user ? "/add-book" : "/register"} className="btn btn-light btn-lg">
              Start selling <i className="bi bi-arrow-right" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
