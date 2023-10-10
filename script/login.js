import { login } from './api.mjs';

document.querySelector("#pills-login form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.querySelector("#loginEmail").value;
    const password = document.querySelector("#loginPassword").value;

    try {
        const data = await login(email, password);

        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("userEmail", data.email);
        localStorage.setItem("userName", data.name);

        alert("Logged in successfully!");
    } catch (error) {
        alert("An error occurred: " + error.message);
    }
});
