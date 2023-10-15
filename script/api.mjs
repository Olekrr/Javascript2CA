/** Base URL for the API */
const API_BASE_URL = "https://api.noroff.dev/api/v1";

/**
 * Fetch data from the API.
 *
 * @async
 * @param {string} url - The URL endpoint to hit.
 * @param {string} [method="GET"] - The HTTP method to use.
 * @param {Object} [body=null] - The body payload, if needed.
 * @param {string} [token=null] - The authentication token, if needed.
 * @returns {Promise<Object>} - The response data.
 * @throws {Error} - Throws an error if response is not ok.
 */
export async function fetchData(
  url,
  method = "GET",
  body = null,
  token = null
) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    method: method,
    headers: headers,
    body: body ? JSON.stringify(body) : null,
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Error fetching data");
  }

  return response.json();
}

/**
 * Login to the API.
 *
 * @async
 * @param {string} email - User's email.
 * @param {string} password - User's password.
 * @returns {Promise<Object>} - The response data.
 */
export async function login(email, password) {
  return fetchData("/social/auth/login", "POST", { email, password });
}

/**
 * Register a new user with the API.
 *
 * @async
 * @param {string} username - Username of the new user.
 * @param {string} email - Email of the new user.
 * @param {string} password - Password for the new user.
 * @param {string} token - The authentication token.
 * @returns {Promise<Object>} - The response data.
 */
export async function register(username, email, password, token) {
  return fetchData(
    "/social/auth/register",
    "POST",
    { name: username, email, password },
    token
  );
}

/**
 * Get posts from the API.
 *
 * @async
 * @param {string} token - The authentication token.
 * @returns {Promise<Array<Object>>} - An array of post objects.
 */
export async function getPosts(token) {
  return fetchData("/social/posts", "GET", null, token);
}