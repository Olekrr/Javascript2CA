import { login } from "./api.mjs";

/**
 * Event listener function for the login form.
 *
 * @async
 * @param {Event} event - The submit event.
 * @throws {Error} - Alerts the error message if any occurs during the login process.
 */
document
  .querySelector("#pills-login form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    /** @type {string} */
    const email = document.querySelector("#loginEmail").value;

    /** @type {string} */
    const password = document.querySelector("#loginPassword").value;

    try {
      /** @type {Object} */
      const userResponse = await login(email, password);

      /** Destructure relevant properties from the response */
      const { accessToken, email: userEmail, name } = userResponse;

      /** Store user details in local storage */
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("userEmail", userEmail);
      localStorage.setItem("userName", name);

      /** Redirect to posts page */
      window.location.href = "/posts/index.html";
    } catch (error) {
      alert("An error occurred: " + error.message);
    }
  });