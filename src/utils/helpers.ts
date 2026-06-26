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

  return `${year}-${month}`;
};

export const getTimeStampFromMonth = (monthYear: string) => {
  const [yearStr, monthStr] = monthYear.split("-");

  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10) - 1;

  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 1);

  return {
    startDate,
    endDate,
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

  switch (filter) {
    case "current-month": {
      const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
        2,
        "0",
      )}`;

      return { startMonth: month, endMonth: month };
    }

    case "last-month": {
      const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);

      const month = `${prev.getFullYear()}-${String(
        prev.getMonth() + 1,
      ).padStart(2, "0")}`;

      return { startMonth: month, endMonth: month };
    }

    case "last-6-months": {
      const start = new Date(now.getFullYear(), now.getMonth() - 5, 1);

      return {
        startMonth: `${start.getFullYear()}-${String(
          start.getMonth() + 1,
        ).padStart(2, "0")}`,
        endMonth: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
          2,
          "0",
        )}`,
      };
    }

    case "last-1-year": {
      const start = new Date(now.getFullYear() - 1, now.getMonth(), 1);

      return {
        startMonth: `${start.getFullYear()}-${String(
          start.getMonth() + 1,
        ).padStart(2, "0")}`,
        endMonth: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
          2,
          "0",
        )}`,
      };
    }
  }
};


export const formatMonth = (date: Date) => {
  return `${date.getFullYear()}-${String(
    date.getMonth() + 1,
  ).padStart(2, "0")}`;
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