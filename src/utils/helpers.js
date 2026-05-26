export const setUserIdCookie = (userId, daysToLive) => {
    const date = new Date();
    date.setTime(date.getTime() + daysToLive * 24 * 60 * 60 * 1000);
    let expires = "expires=" + date.toUTCString();
    document.cookie = `userId=${userId}; ${expires}; path=/; SameSite=Lax; Secure`;
};
