/**
 * Date helpers.
 *
 * Expense dates are calendar dates ("YYYY-MM-DD") and budget months are
 * "YYYY-MM". Everything here works in the user's local time and never goes
 * through `toISOString()`, which converts to UTC and shifts dates by a day for
 * users east or west of GMT.
 */

const pad = (n: number) => String(n).padStart(2, "0");

/** Local Date -> "YYYY-MM-DD" */
export const toDateKey = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const todayKey = () => toDateKey(new Date());

/** "YYYY-MM-DD" (or an ISO timestamp) -> local Date at midnight */
export const parseDateKey = (value: string) => {
  const [y, m, d] = value.slice(0, 10).split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
};

export const addDays = (dateKey: string, days: number) => {
  const date = parseDateKey(dateKey);
  date.setDate(date.getDate() + days);
  return toDateKey(date);
};

/** Local Date -> "YYYY-MM" */
export const toMonthKey = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;

export const currentMonthKey = () => toMonthKey(new Date());

export const isMonthKey = (value: string | null | undefined): value is string =>
  !!value && /^\d{4}-(0[1-9]|1[0-2])$/.test(value);

export const isDateKey = (value: string | null | undefined): value is string =>
  !!value && /^\d{4}-\d{2}-\d{2}$/.test(value);

export const shiftMonth = (monthKey: string, delta: number) => {
  const [y, m] = monthKey.split("-").map(Number);
  return toMonthKey(new Date(y, m - 1 + delta, 1));
};

/** First day of the month and first day of the next month (exclusive end). */
export const monthBounds = (monthKey: string) => ({
  start: `${monthKey}-01`,
  endExclusive: `${shiftMonth(monthKey, 1)}-01`,
});

export const lastDayOfMonth = (monthKey: string) =>
  addDays(monthBounds(monthKey).endExclusive, -1);

export const daysInMonth = (monthKey: string) =>
  Number(lastDayOfMonth(monthKey).slice(8, 10));

export const formatMonth = (
  monthKey: string,
  style: "long" | "short" = "long",
) => {
  const [y, m] = monthKey.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-IN", {
    month: style,
    year: "numeric",
  });
};

export const formatDate = (
  dateKey: string,
  options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  },
) => {
  if (!dateKey) return "—";
  return parseDateKey(dateKey).toLocaleDateString("en-IN", options);
};

export const formatDateTime = (iso: string) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

/** Money */
const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});
const currencyWhole = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});
const currencyCompact = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  notation: "compact",
  maximumFractionDigits: 1,
});

export const formatMoney = (
  amount: number,
  variant: "default" | "whole" | "compact" = "default",
) => {
  const value = Number.isFinite(amount) ? amount : 0;
  if (variant === "compact") return currencyCompact.format(value);
  if (variant === "whole") return currencyWhole.format(value);
  return currency.format(value);
};

export const formatPercent = (value: number) =>
  `${Number.isFinite(value) ? Math.round(value) : 0}%`;

export const normalizeName = (name: string) => name.trim().toLowerCase();

export const slugify = (name: string) =>
  normalizeName(name)
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

export const getErrorMessage = (error: unknown, fallback = "Something went wrong") => {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "object" && error && "message" in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === "string" && message) return message;
  }
  return fallback;
};
