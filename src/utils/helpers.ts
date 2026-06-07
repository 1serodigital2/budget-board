export const setUserIdCookie = (userId: string, daysToLive: number) => {
  const date = new Date();

  date.setTime(date.getTime() + daysToLive * 24 * 60 * 60 * 1000);
  let expires = "expires=" + date.toUTCString();

  document.cookie = `userId=${userId}; ${expires}; path=/; SameSite=Lax; Secure`;
};

export const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-IN").replace(/\//g, "-");
};
export const getMonthYear = (date = new Date()) => {
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);

  return `${year}-${month}`;
};
