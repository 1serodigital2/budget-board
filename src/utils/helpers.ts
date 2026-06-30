export const setUserIdCookie = (userId: string, daysToLive: number) => {
  const date = new Date();

  date.setTime(date.getTime() + daysToLive * 24 * 60 * 60 * 1000);
  let expires = "expires=" + date.toUTCString();

  document.cookie = `userId=${userId}; ${expires}; path=/; SameSite=Lax; Secure`;
};

export const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-IN").replace(/\//g, "-");
};
export const getCurrentMonth = (date = new Date()) => {
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);

  return `${year}-${month}-01`;
};

export const getTimeStampFromMonth = (monthDate: string) => {
  const date = new Date(monthDate);

  const startDate = monthDate;

  const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 1)
    .toISOString()
    .split("T")[0];

  return {
    start: startDate,
    end: endDate,
  };
};

export const moneyFormat = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
};

export const capitalizeFirstLetter = (str: string) => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export type DateFilter =
  | "current-month"
  | "last-month"
  | "last-6-months"
  | "last-1-year"
  | "all-time";

export const getMonthRange = (filter: DateFilter) => {
  const now = new Date();

  const formatMonthDate = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0",
    )}-01`;
  };

  switch (filter) {
    case "current-month": {
      const date = new Date(now.getFullYear(), now.getMonth(), 1);

      return {
        startDate: formatMonthDate(date),
        endDate: formatMonthDate(date),
      };
    }

    case "last-month": {
      const date = new Date(now.getFullYear(), now.getMonth() - 1, 1);

      return {
        startDate: formatMonthDate(date),
        endDate: formatMonthDate(date),
      };
    }

    case "last-6-months": {
      const start = new Date(now.getFullYear(), now.getMonth() - 5, 1);
      const end = new Date(now.getFullYear(), now.getMonth(), 1);

      return {
        startDate: formatMonthDate(start),
        endDate: formatMonthDate(end),
      };
    }

    case "last-1-year": {
      const start = new Date(now.getFullYear() - 1, now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth(), 1);

      return {
        startDate: formatMonthDate(start),
        endDate: formatMonthDate(end),
      };
    }
  }
};

export const formatMonth = (date: Date) => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0",
  )}`;
};

export const formatInDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

// Usage
// formatDate("2026-06-24T14:03:27.669Z") // → "24-06-2026"

export const addDateInMonth = (month: string, date?: string) => {
  if (!date) {
    date = "-01";
  }
  if (date) {
    return month + date;
  }
  return month;
};
