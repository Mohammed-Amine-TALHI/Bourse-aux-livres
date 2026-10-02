import { useEffect } from "react";
import { Link } from "react-router-dom";
import { requestLabel, requestTone } from "../utils/format";

export const Loader = ({ page = false }) => (
  <div className={`loader${page ? " page" : ""}`} role="status" aria-label="Loading">
    <div className="spinner" />
  </div>
);

export const EmptyState = ({ icon = "bi-inbox", title, children, action }) => (
  <div className="empty">
    <i className={`bi ${icon}`} />
    <h3>{title}</h3>
    {children && <p>{children}</p>}
    {action}
  </div>
);

export const ErrorState = ({ message, onRetry }) => (
  <EmptyState
    icon="bi-wifi-off"
    title="We could not load this page"
    action={
      onRetry && (
        <button type="button" className="btn btn-outline" onClick={onRetry}>
          <i className="bi bi-arrow-clockwise" /> Try again
        </button>
      )
    }
  >
    {message}
  </EmptyState>
);

export const Badge = ({ tone = "neutral", plain = false, children }) => (
  <span className={`badge badge-${tone}${plain ? " plain" : ""}`}>{children}</span>
);

export const RequestBadge = ({ request }) => <Badge tone={requestTone(request)}>{requestLabel(request)}</Badge>;

export const StockBadge = ({ qty }) =>
  Number(qty) > 0 ? <Badge tone="success">In stock · {qty}</Badge> : <Badge tone="danger">Out of stock</Badge>;

export const Breadcrumb = ({ items }) => (
  <nav className="breadcrumb" aria-label="Breadcrumb">
    {items.map((item, index) => (
      <span key={item.label} style={{ display: "contents" }}>
        {index > 0 && <i className="bi bi-chevron-right" style={{ fontSize: "0.7rem" }} />}
        {item.to ? <Link to={item.to}>{item.label}</Link> : <span className="current">{item.label}</span>}
      </span>
    ))}
  </nav>
);

export const Field = ({ label, error, hint, htmlFor, className = "", children }) => (
  <div className={`field ${className}`}>
    {label && <label htmlFor={htmlFor}>{label}</label>}
    {children}
    {error ? <span className="error">{error}</span> : hint ? <span className="hint">{hint}</span> : null}
  </div>
);

export const Dialog = ({ title, description, onClose, children }) => {
  useEffect(() => {
    const onKey = (event) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="dialog-backdrop" onMouseDown={onClose}>
      <div className="dialog" role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}>
        <h3>{title}</h3>
        {description && <p>{description}</p>}
        {children}
      </div>
    </div>
  );
};

export const ConfirmDialog = ({ title, description, confirmLabel = "Delete", busy, onConfirm, onClose }) => (
  <Dialog title={title} description={description} onClose={onClose}>
    <div className="dialog-actions">
      <button type="button" className="btn btn-ghost" onClick={onClose} disabled={busy}>
        Cancel
      </button>
      <button type="button" className="btn btn-danger" onClick={onConfirm} disabled={busy}>
        {busy ? "Please wait…" : confirmLabel}
      </button>
    </div>
  </Dialog>
);

/** Sets the browser tab title for the current page. */
export const useTitle = (title) => {
  useEffect(() => {
    document.title = title ? `${title} · Bourse aux Livres` : "Bourse aux Livres";
  }, [title]);
};
