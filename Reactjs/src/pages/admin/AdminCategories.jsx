import { useState } from "react";
import { toast } from "react-toastify";
import http, { errorMessage, fieldErrors } from "../../api/http";
import { Badge, ConfirmDialog, Dialog, EmptyState, ErrorState, Field, Loader, useTitle } from "../../components/ui";
import useFetch from "../../hooks/useFetch";
import { categoryIcon } from "../../utils/format";

const slugify = (text) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const CategoryDialog = ({ category, onClose, onSaved }) => {
  const [form, setForm] = useState({
    name: category?.name || "",
    slug: category?.slug || "",
    description: category?.description || "",
    status: category?.status === 1,
  });
  // Until the admin types a slug, it follows the name.
  const [slugTouched, setSlugTouched] = useState(Boolean(category));
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  const update = (event) => {
    const { name, type, value, checked } = event.target;
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    if (name === "slug") setSlugTouched(true);
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "name" && !slugTouched ? { slug: slugify(value) } : {}),
    }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    try {
      const { data } = category
        ? await http.put(`/admin/categories/${category.id}`, form)
        : await http.post("/admin/categories", form);
      toast.success(data.message);
      onSaved();
    } catch (error) {
      const fields = fieldErrors(error);
      setErrors(fields);
      if (Object.keys(fields).length === 0) toast.error(errorMessage(error));
      setBusy(false);
    }
  };

  return (
    <Dialog title={category ? "Edit collection" : "New collection"} onClose={onClose}>
      <form onSubmit={submit} noValidate>
        <Field label="Name" htmlFor="name" error={errors.name}>
          <input
            id="name"
            name="name"
            className={`input${errors.name ? " invalid" : ""}`}
            placeholder="Sciences & Engineering"
            value={form.name}
            onChange={update}
            autoFocus
            required
          />
        </Field>
        <Field label="Slug" htmlFor="slug" error={errors.slug} hint={`Used in the address: /collections/${form.slug || "…"}`}>
          <input
            id="slug"
            name="slug"
            className={`input${errors.slug ? " invalid" : ""}`}
            value={form.slug}
            onChange={update}
            required
          />
        </Field>
        <Field label="Description" htmlFor="description" error={errors.description}>
          <textarea
            id="description"
            name="description"
            className="textarea"
            style={{ minHeight: 84 }}
            value={form.description}
            onChange={update}
          />
        </Field>
        <label className="check">
          <input type="checkbox" name="status" checked={form.status} onChange={update} />
          Hide this collection (and its books) from the site
        </label>
        <div className="dialog-actions" style={{ marginTop: 6 }}>
          <button type="button" className="btn btn-ghost" onClick={onClose} disabled={busy}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={busy}>
            {busy ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </Dialog>
  );
};

const AdminCategories = () => {
  useTitle("Collections · Admin");
  const { data, loading, error, reload } = useFetch("/admin/categories");
  const [editing, setEditing] = useState(undefined); // undefined = closed, null = new, object = edit
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      const { data: result } = await http.delete(`/admin/categories/${toDelete.id}`);
      toast.success(result.message);
      reload();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setDeleting(false);
      setToDelete(null);
    }
  };

  if (loading && !data) return <Loader page />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>Collections</h1>
          <p>The subjects sellers can file their books under.</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => setEditing(null)}>
          <i className="bi bi-plus-lg" /> New collection
        </button>
      </div>

      {data.categories.length === 0 ? (
        <EmptyState icon="bi-collection" title="No collection yet">
          Create the first collection so sellers can start listing books.
        </EmptyState>
      ) : (
        <div className="card">
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Collection</th>
                  <th>Slug</th>
                  <th>Books</th>
                  <th>Visibility</th>
                  <th className="right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.categories.map((category) => (
                  <tr key={category.id}>
                    <td>
                      <div className="cell-book">
                        <span className="avatar" style={{ borderRadius: 10, background: "var(--primary-soft)", color: "var(--primary)" }}>
                          <i className={`bi ${categoryIcon(category.name)}`} />
                        </span>
                        <div>
                          <strong>{category.name}</strong>
                          <span>{category.description}</span>
                        </div>
                      </div>
                    </td>
                    <td className="muted">/{category.slug}</td>
                    <td>{category.books_count}</td>
                    <td>
                      {category.status === 0 ? <Badge tone="success">Visible</Badge> : <Badge tone="neutral">Hidden</Badge>}
                    </td>
                    <td>
                      <div className="cell-actions">
                        <button
                          type="button"
                          className="icon-btn"
                          onClick={() => setEditing(category)}
                          aria-label="Edit"
                          title="Edit"
                        >
                          <i className="bi bi-pencil" />
                        </button>
                        <button
                          type="button"
                          className="icon-btn danger"
                          onClick={() => setToDelete(category)}
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
      )}

      {editing !== undefined && (
        <CategoryDialog
          category={editing}
          onClose={() => setEditing(undefined)}
          onSaved={() => {
            setEditing(undefined);
            reload();
          }}
        />
      )}

      {toDelete && (
        <ConfirmDialog
          title="Delete this collection?"
          description={`"${toDelete.name}" will be removed. Collections that still contain books cannot be deleted.`}
          busy={deleting}
          onConfirm={confirmDelete}
          onClose={() => setToDelete(null)}
        />
      )}
    </>
  );
};

export default AdminCategories;
