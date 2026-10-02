import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import http, { errorMessage, fieldErrors } from "../api/http";
import { BookCover } from "../components/BookCard";
import { Breadcrumb, ErrorState, Field, Loader, RequestBadge, useTitle } from "../components/ui";
import { useAuth } from "../context/AuthContext";
import useFetch from "../hooks/useFetch";
import NotFound from "./NotFound";

const EMPTY = {
  category_id: "",
  book_title: "",
  author: "",
  isbn: "",
  school_name: "",
  genre: "",
  description: "",
  selling_price: "",
  original_price: "",
  qty: 1,
  status: false,
  featured: false,
  popular: false,
};

const MAX_COVER_SIZE = 4 * 1024 * 1024;

const BookForm = ({ book, categories }) => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(() =>
    book
      ? {
          ...EMPTY,
          ...Object.fromEntries(Object.keys(EMPTY).map((key) => [key, book[key] ?? ""])),
          status: book.status === 1,
          featured: Boolean(book.featured),
          popular: Boolean(book.popular),
        }
      : EMPTY
  );
  const [cover, setCover] = useState(null);
  const [preview, setPreview] = useState(book?.cover_url || null);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  // Release the object URL of the local preview when it is replaced or the form closes.
  useEffect(() => () => preview?.startsWith("blob:") && URL.revokeObjectURL(preview), [preview]);

  const update = (event) => {
    const { name, type, value, checked } = event.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const pickCover = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > MAX_COVER_SIZE) {
      setErrors((prev) => ({ ...prev, cover_image: "The picture must be smaller than 4 MB." }));
      return;
    }
    setCover(file);
    setPreview(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, cover_image: undefined }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);

    const body = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (typeof value === "boolean") body.append(key, value ? "1" : "0");
      else body.append(key, value ?? "");
    });
    if (cover) body.append("cover_image", cover);

    try {
      const { data } = await http.post(book ? `/books/${book.id}` : "/books", body);
      toast.success(data.message);
      navigate(isAdmin && book ? -1 : "/dashboard");
    } catch (error) {
      const fields = fieldErrors(error);
      setErrors(fields);
      toast.error(Object.keys(fields).length ? "Please fix the highlighted fields." : errorMessage(error));
      setBusy(false);
    }
  };

  const input = (name, props = {}) => ({
    id: name,
    name,
    className: `input${errors[name] ? " invalid" : ""}`,
    value: form[name],
    onChange: update,
    ...props,
  });

  return (
    <form onSubmit={submit} className="form-layout" noValidate>
      <div className="card">
        <div className="card-body">
          <div className="form-grid">
            <Field label="Title *" htmlFor="book_title" error={errors.book_title} className="span-2">
              <input {...input("book_title", { placeholder: "Introduction to Algorithms", required: true })} />
            </Field>
            <Field label="Author" htmlFor="author" error={errors.author}>
              <input {...input("author", { placeholder: "Thomas H. Cormen" })} />
            </Field>
            <Field label="Collection *" htmlFor="category_id" error={errors.category_id}>
              <select
                id="category_id"
                name="category_id"
                className={`select${errors.category_id ? " invalid" : ""}`}
                value={form.category_id}
                onChange={update}
                required
              >
                <option value="">Choose a collection</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="ISBN" htmlFor="isbn" error={errors.isbn} hint="Printed on the back cover, above the barcode.">
              <input {...input("isbn", { placeholder: "978-0262033848" })} />
            </Field>
            <Field label="School" htmlFor="school_name" error={errors.school_name} hint="Where the book was used.">
              <input {...input("school_name", { placeholder: "EMINES - UM6P" })} />
            </Field>
            <Field label="Genre" htmlFor="genre" error={errors.genre}>
              <input {...input("genre", { placeholder: "Computer science" })} />
            </Field>
            <Field label="Quantity *" htmlFor="qty" error={errors.qty}>
              <input {...input("qty", { type: "number", min: 0, max: 999, required: true })} />
            </Field>
            <Field label="Selling price (DH) *" htmlFor="selling_price" error={errors.selling_price}>
              <input {...input("selling_price", { type: "number", min: 0, step: "0.01", placeholder: "150", required: true })} />
            </Field>
            <Field
              label="Price when new (DH)"
              htmlFor="original_price"
              error={errors.original_price}
              hint="Lets buyers see how much they save."
            >
              <input {...input("original_price", { type: "number", min: 0, step: "0.01", placeholder: "390" })} />
            </Field>
            <Field
              label="Description *"
              htmlFor="description"
              error={errors.description}
              hint={`${form.description.length}/2000 · Condition, edition, annotations…`}
              className="span-2"
            >
              <textarea
                id="description"
                name="description"
                className={`textarea${errors.description ? " invalid" : ""}`}
                placeholder="Good condition, a few pencil annotations in the first chapters."
                maxLength={2000}
                value={form.description}
                onChange={update}
                required
              />
            </Field>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)} disabled={busy}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={busy}>
              {busy ? "Saving…" : book ? "Save changes" : "Submit for review"}
            </button>
          </div>
        </div>
      </div>

      <aside className="form-side">
        <div className="card">
          <div className="card-body uploader">
            <span className="label">Cover picture</span>
            <BookCover book={{ ...form, cover_url: preview, book_title: form.book_title || "Your book title" }} />
            <label className="uploader-drop">
              <i className="bi bi-cloud-arrow-up" />
              <strong>{preview ? "Replace the picture" : "Upload a picture"}</strong>
              <span>JPG, PNG or WebP, up to 4 MB</span>
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={pickCover} hidden />
            </label>
            {errors.cover_image && <span className="field error">{errors.cover_image}</span>}
          </div>
        </div>

        <div className="card">
          <div className="card-body" style={{ display: "grid", gap: 14 }}>
            <span className="label">Visibility</span>
            {book && <RequestBadge request={book.request} />}
            <label className="check">
              <input type="checkbox" name="status" checked={form.status} onChange={update} />
              Hide this listing for now
            </label>
            {isAdmin && (
              <>
                <label className="check">
                  <input type="checkbox" name="featured" checked={form.featured} onChange={update} />
                  Featured on the home page
                </label>
                <label className="check">
                  <input type="checkbox" name="popular" checked={form.popular} onChange={update} />
                  Show in "Popular right now"
                </label>
              </>
            )}
          </div>
        </div>
      </aside>
    </form>
  );
};

const EditorShell = ({ title, subtitle, crumbs, children }) => (
  <>
    <div className="container page-head">
      <Breadcrumb items={crumbs} />
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </div>
    <div className="container section-tight">{children}</div>
  </>
);

export const AddBook = () => {
  useTitle("Sell a book");
  const categories = useFetch("/categories");

  return (
    <EditorShell
      title="Sell a book"
      subtitle="Describe your book honestly: a clear listing sells faster. An admin will review it before it goes live."
      crumbs={[{ label: "My books", to: "/dashboard" }, { label: "New listing" }]}
    >
      {categories.loading ? (
        <Loader />
      ) : categories.error ? (
        <ErrorState message={categories.error} onRetry={categories.reload} />
      ) : (
        <BookForm categories={categories.data.categories} />
      )}
    </EditorShell>
  );
};

export const EditBook = () => {
  const { id } = useParams();
  const { isAdmin } = useAuth();
  const book = useFetch(`/books/${id}`);
  // Admins may move a book to a hidden collection, so they get the full list.
  const categories = useFetch(isAdmin ? "/admin/categories" : "/categories");
  useTitle(book.data ? `Edit ${book.data.book.book_title}` : "Edit book");

  if (book.loading || categories.loading) return <Loader page />;
  if (book.status === 404 || (book.data && !book.data.can_manage)) return <NotFound />;
  if (book.error || categories.error) {
    return (
      <div className="container section">
        <ErrorState message={book.error || categories.error} onRetry={book.error ? book.reload : categories.reload} />
      </div>
    );
  }

  return (
    <EditorShell
      title="Edit listing"
      subtitle={
        <>
          You are editing <Link to={`/collections/${book.data.book.category.slug}/${id}`}>“{book.data.book.book_title}”</Link>.
        </>
      }
      crumbs={[{ label: "My books", to: "/dashboard" }, { label: "Edit listing" }]}
    >
      <BookForm book={book.data.book} categories={categories.data.categories} />
    </EditorShell>
  );
};
