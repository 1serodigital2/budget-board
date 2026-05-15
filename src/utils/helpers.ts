function setUserIdCookie(userId, daysToLive) {
  const date = new Date();
  // Set the expiration date
  date.setTime(date.getTime() + daysToLive * 24 * 60 * 60 * 1000);
  let expires = "expires=" + date.toUTCString();

  // Set the cookie with security attributes
  document.cookie = `userId=${userId}; ${expires}; path=/; SameSite=Lax; Secure`;
}

// Usage: Set user ID "user_99" to expire in 7 days
// setUserIdCookie("user_99", 7);
