import { register } from './api.mjs';

document.addEventListener("DOMContentLoaded", function() {
    const registerForm = document.querySelector("#pills-register form");

    registerForm.addEventListener("submit", async function(submitEvent) {
        submitEvent.preventDefault();

        const username = document.getElementById("registerUsername").value;
        const email = document.getElementById("registerEmail").value;
        const password = document.getElementById("registerPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (username.includes(' ') || /[^a-zA-Z0-9_]/.test(username)) {
            alert("Username must not contain spaces or punctuation symbols apart from underscore (_).");
            return;
        }

        if (!email.endsWith("@stud.noroff.no") && !email.endsWith("@noroff.no")) {
            alert("Email must be a valid stud.noroff.no or noroff.no email address.");
            return;
        }

        if (password.length < 8) {
            alert("Password must be at least 8 characters.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        try {
            const data = await register(username, email, password, localStorage.getItem("accessToken"));

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
