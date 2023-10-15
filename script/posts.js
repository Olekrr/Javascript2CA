import { getPosts } from "./api.mjs";

/**
 * Local store for posts.
 * @type {Array<Object>}
 */
let localPosts = [];

/**
 * Represents the Bootstrap modal used for editing posts.
 * @type {bootstrap.Modal}
 */
let editPostModal;

/**
 * Fetch posts from the API, transform them if needed, and then display.
 * Uses the access token from local storage.
 * @async
 */
async function fetchAndTransformPosts() {
  const token = localStorage.getItem("accessToken");
  const data = await getPosts(token);
  localPosts = data.map((post) => ({ ...post }));
  displayPosts(localPosts);
}

/**
 * Displays posts on the web page.
 *
 * @param {Array<Object>} posts - An array of post objects.
 */
function displayPosts(posts) {
  const postFeed = document.getElementById("postFeed");
  postFeed.innerHTML = "";

  posts.forEach(({ title, body, id }) => {
    const postCard = document.createElement("div");
    postCard.className = "card mb-4";

    const postCardBody = document.createElement("div");
    postCardBody.className = "card-body";

    const postTitle = document.createElement("h5");
    postTitle.className = "card-title";
    postTitle.textContent = title;

    const postContent = document.createElement("p");
    postContent.className = "card-text";
    postContent.textContent = body;

    const editButton = document.createElement("button");
    editButton.className = "btn btn-warning mr-2";
    editButton.textContent = "Edit";
    editButton.setAttribute("data-bs-toggle", "modal");
    editButton.setAttribute("data-bs-target", "#editPostModal");
    editButton.onclick = () => populateEditModal({ title, body, id });

    const deleteButton = document.createElement("button");
    deleteButton.className = "btn btn-danger ml-2";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => {
      const index = localPosts.findIndex((localPost) => localPost.id === id);
      if (index !== -1) {
        localPosts.splice(index, 1);
      }
      displayPosts(localPosts);
    });

    const viewButton = document.createElement("button");
    viewButton.className = "btn btn-info mr-2";
    viewButton.textContent = "View";
    viewButton.addEventListener("click", () => {
      window.location.href = `/postspecific/index.html?postId=${id}`;
    });

    postCardBody.appendChild(postTitle);
    postCardBody.appendChild(postContent);
    postCardBody.appendChild(viewButton);
    postCardBody.appendChild(editButton);
    postCardBody.appendChild(deleteButton);

    postCard.appendChild(postCardBody);
    postFeed.appendChild(postCard);
  });
}

/**
 * Populates the edit modal with the provided post data.
 *
 * @param {Object} post - Post object.
 * @param {string} post.title - Title of the post.
 * @param {string} post.body - Content/body of the post.
 * @param {number} post.id - ID of the post.
 */
function populateEditModal({ title, body, id }) {
  const updatePostTitle = document.getElementById("updatePostTitle");
  const updatePostContent = document.getElementById("updatePostContent");

  updatePostTitle.value = title;
  updatePostContent.value = body;

  const updateButton = document.querySelector(
    '#updatePostForm button[type="submit"]'
  );
  updateButton.onclick = (e) => {
    e.preventDefault();
    updatePostAndCloseModal(id, updatePostTitle.value, updatePostContent.value);
  };
}

/**
 * Update a post's details and close the modal.
 *
 * @param {number} id - ID of the post to update.
 * @param {string} updatedTitle - Updated title of the post.
 * @param {string} updatedContent - Updated content of the post.
 */
function updatePostAndCloseModal(id, updatedTitle, updatedContent) {
  const postToUpdate = localPosts.find((post) => post.id === id);

  if (postToUpdate) {
    postToUpdate.title = updatedTitle;
    postToUpdate.body = updatedContent;

    editPostModal.hide();

    displayPosts(localPosts);
  }
}

/**
 * Adds a new post to the local post store and updates the display.
 *
 * @param {string} title - Title of the new post.
 * @param {string} content - Content/body of the new post.
 */
function addPost(title, content) {
  const newId = Math.max(...localPosts.map((post) => post.id)) + 1;

  const newPost = {
    id: newId,
    title: title,
    body: content,
  };

  localPosts.unshift(newPost);
  displayPosts(localPosts);
}

/**
 * Filters the posts based on a search keyword and updates the display.
 *
 * @param {string} keyword - Keyword to filter by.
 */
function filterPostsBySearch(keyword) {
  const filteredPosts = localPosts.filter((post) =>
    post.title.toLowerCase().includes(keyword.toLowerCase())
  );
  displayPosts(filteredPosts);
}

/**
 * Filters the posts based on a dropdown value and updates the display.
 *
 * @param {string} value - Value from the dropdown to filter by. Possible values: 'recent', 'oldest', etc.
 */
function filterPostsByDropdown(value) {
  let filteredPosts;
  if (value === "recent") {
    filteredPosts = [...localPosts].sort((a, b) => b.id - a.id);
  } else if (value === "oldest") {
    filteredPosts = [...localPosts].sort((a, b) => a.id - b.id);
  } else {
    filteredPosts = [...localPosts];
  }
  displayPosts(filteredPosts);
}

document.addEventListener("DOMContentLoaded", () => {
  fetchAndTransformPosts();

  editPostModal = new bootstrap.Modal(document.getElementById("editPostModal"));

  document
    .getElementById("createPostForm")
    .addEventListener("submit", (event) => {
      event.preventDefault();

      const title = document.getElementById("createPostTitle").value;
      const content = document.getElementById("createPostContent").value;

      addPost(title, content);

      document.getElementById("createPostTitle").value = "";
      document.getElementById("createPostContent").value = "";
    });

  document.getElementById("searchPosts").addEventListener("input", (event) => {
    filterPostsBySearch(event.target.value);
  });

  document.getElementById("filterPosts").addEventListener("change", (event) => {
    filterPostsByDropdown(event.target.value);
  });
});