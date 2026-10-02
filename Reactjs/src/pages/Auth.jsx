import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { errorMessage, fieldErrors } from "../api/http";
import { Brand } from "../components/layout/Header";
import { Field, useTitle } from "../components/ui";
import { useAuth } from "../context/AuthContext";

const AuthShell = ({ title, subtitle, children }) => (
  <div className="auth">
    <div className="auth-card">
      <aside className="auth-aside">
        <Brand />
        <div>
          <h2>Books deserve more than one reader.</h2>
          <ul>
            <li>
              <i className="bi bi-check-circle-fill" /> Textbooks at student prices
            </li>
            <li>
              <i className="bi bi-check-circle-fill" /> Every listing reviewed by an admin
            </li>
            <li>
              <i className="bi bi-check-circle-fill" /> Hand-to-hand exchange on campus
            </li>
          </ul>
        </div>
      </aside>
      <div className="auth-form">
        <h1>{title}</h1>
        <p>{subtitle}</p>
        {children}
      </div>
    </div>
  </div>
);

const PasswordInput = ({ id, value, onChange, invalid, ...props }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <input
        id={id}
        type={visible ? "text" : "password"}
        className={`input${invalid ? " invalid" : ""}`}
        style={{ paddingRight: 44 }}
        value={value}
        onChange={onChange}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 44,
          height: "100%",
          background: "none",
          border: 0,
          color: "var(--muted)",
        }}
      >
        <i className={`bi ${visible ? "bi-eye-slash" : "bi-eye"}`} />
      </button>
    </div>
  );
};

const DEMO_ACCOUNTS = [
  { label: "Admin", email: "admin@bourse.test" },
  { label: "Student", email: "salma@bourse.test" },
];

export const Login = () => {
  useTitle("Log in");
  const { login } = useAuth();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const update = (event) => setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const user = await login(form);
      toast.success(`Welcome back, ${user.name.split(" ")[0]}!`);
      // <GuestOnly> redirects to the page the user came from.
    } catch (err) {
      setError(errorMessage(err, "Incorrect email or password."));
      setBusy(false);
    }
  };

  return (
    <AuthShell title="Welcome back" subtitle="Log in to sell books and manage your wishlist.">
      <form onSubmit={submit} noValidate>
        {error && (
          <div className="notice notice-danger" role="alert">
            <i className="bi bi-exclamation-circle" />
            <span>{error}</span>
          </div>
        )}
        <Field label="Email address" htmlFor="email">
          <input
            id="email"
            name="email"
            type="email"
            className="input"
            placeholder="you@example.com"
            autoComplete="email"
            value={form.email}
            onChange={update}
            required
          />
        </Field>
        <Field label="Password" htmlFor="password">
          <PasswordInput
            id="password"
            name="password"
            placeholder="Your password"
            autoComplete="current-password"
            value={form.password}
            onChange={update}
            required
          />
        </Field>
        <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={busy || !form.email || !form.password}>
          {busy ? "Logging in…" : "Log in"}
        </button>
      </form>

      {import.meta.env.DEV && (
        <div className="demo-box">
          <strong>Demo accounts (seeded data)</strong>
          <div className="row">
            {DEMO_ACCOUNTS.map((account) => (
              <button
                key={account.email}
                type="button"
                className="chip"
                onClick={() => setForm({ email: account.email, password: "password" })}
              >
                {account.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <p className="auth-switch">
        New here?{" "}
        <Link to="/register" state={location.state}>
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
};

export const Register = () => {
  useTitle("Create an account");
  const { register } = useAuth();
  const location = useLocation();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phonenumber: "",
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
      const user = await register(form);
      toast.success(`Welcome, ${user.name.split(" ")[0]}! Your account is ready.`);
    } catch (err) {
      const fields = fieldErrors(err);
      setErrors(fields);
      if (Object.keys(fields).length === 0) toast.error(errorMessage(err));
      setBusy(false);
    }
  };

  return (
    <AuthShell title="Create your account" subtitle="It is free and takes less than a minute.">
      <form onSubmit={submit} noValidate>
        <Field label="Full name" htmlFor="name" error={errors.name}>
          <input
            id="name"
            name="name"
            className={`input${errors.name ? " invalid" : ""}`}
            placeholder="Salma Bennani"
            autoComplete="name"
            value={form.name}
            onChange={update}
            required
          />
        </Field>
        <div className="form-grid">
          <Field label="Email address" htmlFor="email" error={errors.email}>
            <input
              id="email"
              name="email"
              type="email"
              className={`input${errors.email ? " invalid" : ""}`}
              placeholder="you@example.com"
              autoComplete="email"
              value={form.email}
              onChange={update}
              required
            />
          </Field>
          <Field
            label="Phone number"
            htmlFor="phonenumber"
            error={errors.phonenumber}
            hint="Shown to buyers so they can reach you."
          >
            <input
              id="phonenumber"
              name="phonenumber"
              type="tel"
              className={`input${errors.phonenumber ? " invalid" : ""}`}
              placeholder="06 12 34 56 78"
              autoComplete="tel"
              value={form.phonenumber}
              onChange={update}
              required
            />
          </Field>
          <Field label="Password" htmlFor="password" error={errors.password} hint="At least 8 characters.">
            <PasswordInput
              id="password"
              name="password"
              autoComplete="new-password"
              invalid={Boolean(errors.password)}
              value={form.password}
              onChange={update}
              required
            />
          </Field>
          <Field label="Confirm password" htmlFor="password_confirmation" error={errors.password_confirmation}>
            <PasswordInput
              id="password_confirmation"
              name="password_confirmation"
              autoComplete="new-password"
              invalid={Boolean(errors.password_confirmation)}
              value={form.password_confirmation}
              onChange={update}
              required
            />
          </Field>
        </div>
        <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={busy}>
          {busy ? "Creating your account…" : "Create account"}
        </button>
      </form>

      <p className="auth-switch">
        Already have an account?{" "}
        <Link to="/login" state={location.state}>
          Log in
        </Link>
      </p>
    </AuthShell>
  );
};
