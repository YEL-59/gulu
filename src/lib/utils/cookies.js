/**
 * Set a cookie with the given name, value, and expiration days
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {number} days - Expiration in days (can be fractional, e.g., 2/24 for 2 hours)
 */
export function setCookie(name, value, days) {
  if (typeof document === "undefined") return;
  
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/";
}

/**
 * Get a cookie value by name
 * @param {string} name - Cookie name
 * @returns {string|null} - Cookie value or null if not found
 */
export function getCookie(name) {
  if (typeof document === "undefined") return null;
  
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
  }
  return null;
}

/**
 * Delete a cookie by name
 * @param {string} name - Cookie name
 */
export function deleteCookie(name) {
  if (typeof document === "undefined") return;
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

/**
 * Check if a cookie exists
 * @param {string} name - Cookie name
 * @returns {boolean}
 */
export function hasCookie(name) {
  return getCookie(name) !== null;
}

