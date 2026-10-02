export const formatPrice = (value) => {
  const number = Number(value);
  if (Number.isNaN(number)) return "";
  return `${number.toLocaleString("fr-MA", { maximumFractionDigits: 2 })} DH`;
};

/** Percentage saved compared to the price of a new copy, or null when it does not apply. */
export const discount = (book) => {
  const original = Number(book.original_price);
  const selling = Number(book.selling_price);
  if (!original || selling >= original) return null;
  return Math.round((1 - selling / original) * 100);
};

export const initials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");

export const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "";

export const REQUEST = { PENDING: 0, APPROVED: 1, REJECTED: 2 };

export const requestLabel = (request) =>
  ({ 0: "Pending review", 1: "Approved", 2: "Rejected" }[Number(request)] || "Unknown");

export const requestTone = (request) => ({ 0: "warning", 1: "success", 2: "danger" }[Number(request)] || "neutral");

/** Moroccan numbers are stored as 06XXXXXXXX; WhatsApp wants the international format. */
export const whatsappLink = (phone, text) => {
  let digits = String(phone || "").replace(/\D/g, "");
  if (digits.startsWith("0")) digits = `212${digits.slice(1)}`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
};

const CATEGORY_ICONS = [
  [/scien|engineer|math|tech|info/i, "bi-cpu"],
  [/prep|cpge|concours|class/i, "bi-mortarboard"],
  [/business|financ|econom|manag/i, "bi-graph-up-arrow"],
  [/develop|self|personal/i, "bi-lightbulb"],
  [/novel|roman|fiction|litt/i, "bi-book-half"],
  [/lang|english|fran/i, "bi-translate"],
];

export const categoryIcon = (name = "") => CATEGORY_ICONS.find(([pattern]) => pattern.test(name))?.[1] || "bi-bookmark";
