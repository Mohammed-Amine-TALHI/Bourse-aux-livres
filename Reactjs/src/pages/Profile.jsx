import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import http, { errorMessage, fieldErrors } from "../api/http";
import { Badge, Field, useTitle } from "../components/ui";
import { useAuth } from "../context/AuthContext";
import { formatDate, initials } from "../utils/format";

const Profile = () => {
  useTitle("Profile");
  const { user, setUser, wishIds } = useAuth();
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    phonenumber: user.phonenumber,
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  const update = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const submit = async (event) => {
    event.preventDefault();

    if (form.password !== form.password_confirmation) {
      setErrors({ password_confirmation: "The two passwords do not match." });
      return;
    }

    setBusy(true);
    try {
      const { data } = await http.put("/me", form);
      setUser(data);
      setForm((prev) => ({ ...prev, password: "", password_confirmation: "" }));
      toast.success("Profile updated.");
    } catch (error) {
      const fields = fieldErrors(error);
      setErrors(fields);
      if (Object.keys(fields).length === 0) toast.error(errorMessage(error));
    } finally {
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
    <>
      <div className="container page-head">
        <span className="eyebrow">Your account</span>
        <h1>Profile</h1>
        <p>Your contact details are shown to students interested in your books.</p>
      </div>

      <div className="container section-tight">
        <div className="profile-grid">
          <div className="card profile-card">
            <span className="avatar lg">{initials(user.name)}</span>
            <h2>{user.name}</h2>
            <span className="muted">{user.email}</span>
            <div style={{ marginTop: 8 }}>
              <Badge tone={user.role === "admin" ? "accent" : "success"} plain>
                {user.role === "admin" ? "Administrator" : "Student"}
              </Badge>
            </div>
            <span className="muted" style={{ fontSize: "0.84rem", marginTop: 6 }}>
              Member since {formatDate(user.created_at)}
            </span>
            <div className="profile-numbers">
              <Link to="/dashboard">
                <strong>{user.books_count}</strong>
                <span>Listings</span>
              </Link>
              <Link to="/wishlist">
                <strong>{wishIds.length}</strong>
                <span>Wishlist</span>
              </Link>
            </div>
          </div>

          <form className="card" onSubmit={submit} noValidate>
            <div className="card-head">
              <h2 className="card-title">Personal information</h2>
            </div>
            <div className="card-body">
              <div className="form-grid">
                <Field label="Full name" htmlFor="name" error={errors.name} className="span-2">
                  <input {...input("name", { autoComplete: "name", required: true })} />
                </Field>
                <Field label="Email address" htmlFor="email" error={errors.email}>
                  <input {...input("email", { type: "email", autoComplete: "email", required: true })} />
                </Field>
                <Field label="Phone number" htmlFor="phonenumber" error={errors.phonenumber}>
                  <input {...input("phonenumber", { type: "tel", autoComplete: "tel", required: true })} />
                </Field>
                <Field
                  label="New password"
                  htmlFor="password"
                  error={errors.password}
                  hint="Leave empty to keep your current password."
                >
                  <input {...input("password", { type: "password", autoComplete: "new-password" })} />
                </Field>
                <Field label="Confirm new password" htmlFor="password_confirmation" error={errors.password_confirmation}>
                  <input {...input("password_confirmation", { type: "password", autoComplete: "new-password" })} />
                </Field>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={busy}>
                  {busy ? "Saving…" : "Save changes"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Profile;
