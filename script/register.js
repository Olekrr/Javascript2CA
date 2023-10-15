import { register } from "./api.mjs";

/**
 * Initialize registration functionality after the DOM content has been loaded.
 */
document.addEventListener("DOMContentLoaded", function () {
  /** @type {HTMLFormElement} */
  const registerForm = document.querySelector("#pills-register form");

  /**
   * Event listener function for the registration form.
   *
   * @async
   * @param {Event} submitEvent - The submit event.
   * @throws {Error} - Logs the error to the console and alerts the user if any error occurs during the registration process.
   */
  registerForm.addEventListener("submit", async function (submitEvent) {
    submitEvent.preventDefault();

    /** Destructure values from the form elements */
    const {
      registerUsername: { value: username },
      registerEmail: { value: email },
      registerPassword: { value: password },
      confirmPassword: { value: confirmPassword },
    } = registerForm.elements;

    /** Validate username */
    if (username.includes(" ") || /[^a-zA-Z0-9_]/.test(username)) {
      alert(
        "Username must not contain spaces or punctuation symbols apart from underscore (_)."
      );
      return;
    }

    /** Validate email */
    if (!email.endsWith("@stud.noroff.no") && !email.endsWith("@noroff.no")) {
      alert("Email must be a valid stud.noroff.no or noroff.no email address.");
      return;
    }

    /** Validate password length */
    if (password.length < 8) {
      alert("Password must be at least 8 characters.");
      return;
    }

    /** Validate password confirmation */
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    /** Try to register the user */
    try {
      /** @type {Object} */
      const data = await register(
        username,
        email,
        password,
        localStorage.getItem("accessToken")
      );

      if (data.id) {
        alert("Registration successful!");
      } else {
        alert(data.message || "Registration failed!");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("There was an error processing your registration.");
    }
  });
});