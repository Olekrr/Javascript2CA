const API_BASE_URL = "https://api.noroff.dev/api/v1";

async function fetchData(url, method = "GET", body = null, token = null) {
    const headers = {
        "Content-Type": "application/json"
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${url}`, {
        method: method,
        headers: headers,
        body: body ? JSON.stringify(body) : null
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error fetching data');
    }

    return response.json();
}

export async function login(email, password) {
    return fetchData("/social/auth/login", "POST", { email, password });
}

export async function register(username, email, password, token) {
    return fetchData("/social/auth/register", "POST", { name: username, email, password }, token);
}
