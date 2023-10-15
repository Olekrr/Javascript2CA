import { fetchData } from "./api.mjs";

/**
 * Fetch a specific post's details from the API using its ID.
 *
 * @async
 * @param {number} id - The post's ID.
 */
async function fetchSpecificPost(id) {
  const token = localStorage.getItem("accessToken");
  const post = await fetchData(`/social/posts/${id}`, "GET", null, token);
  displayPost(post);
}

/**
 * Display the details of a specific post on the web page.
 *
 * @param {Object} post - Post details.
 */

function displayPost({ title, body }) {
  document.title = title;

  const postContainer = document.getElementById("specificPost");
  postContainer.className = "container mt-5";

  const postRow = document.createElement("div");
  postRow.className = "row justify-content-center";
  postContainer.appendChild(postRow);

  const postCol = document.createElement("div");
  postCol.className = "col-md-8";
  postRow.appendChild(postCol);

  const postCard = document.createElement("div");
  postCard.className = "card";
  postCol.appendChild(postCard);

  const postCardBody = document.createElement("div");
  postCardBody.className = "card-body";
  postCard.appendChild(postCardBody);

  const postTitle = document.createElement("h1");
  postTitle.className = "card-title";
  postTitle.textContent = title;
  postCardBody.appendChild(postTitle);

  const postContent = document.createElement("p");
  postContent.className = "card-text";
  postContent.textContent = body;
  postCardBody.appendChild(postContent);

  const backButton = document.createElement("a");
  backButton.href = "../posts/index.html";
  backButton.className = "btn btn-secondary mb-3";
  backButton.textContent = "Back to Posts";

  postCol.insertBefore(backButton, postCard);
}

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get("postId");

  if (postId) {
    fetchSpecificPost(postId);
  } else {
  }
});