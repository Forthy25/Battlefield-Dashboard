"use strict";

document.addEventListener("DOMContentLoaded", () => {
  initUserSearch();
  initAddUserModal();
  initDeleteUserModal();
  initEditUserModal();
});

// ================================================ Search Bar ================================================

function initUserSearch() {
  const searchInput = document.getElementById("searchInput");
  const rows = document.querySelectorAll("#userTableBody tr");
  const noResults = document.getElementById("noResults");

  let debounceTimer;

  searchInput.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const searchTerm = searchInput.value.toLowerCase();
      let hasResults = false;

      rows.forEach((row) => {
        const username = row
          .querySelector("td:nth-child(1)")
          .textContent.toLowerCase();
        const email = row
          .querySelector("td:nth-child(2)")
          .textContent.toLowerCase();

        if (username.includes(searchTerm) || email.includes(searchTerm)) {
          row.style.display = "";
          hasResults = true;
        } else {
          row.style.display = "none";
        }
      });

      noResults.style.display = hasResults ? "none" : "block";
    }, 300);
  });
}

// ====================================================== Modals ======================================================
function initAddUserModal() {
  const modal = document.getElementById("addUserModal");
  const openBtn = document.getElementById("openAddUserModal");
  const closeBtn = document.getElementById("closeAddUserModal");
  const cancelBtn = document.getElementById("cancelAddUserBtn");
  const form = document.getElementById("addUserForm");

  // Open modal
  openBtn.addEventListener("click", () => {
    modal.style.display = "flex";
  });

  // Close modal
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  cancelBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Click outside closes modal
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  // AJAX form submit
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const data = {
      username: formData.get("username"),
      email: formData.get("email"),
      password: formData.get("password"),
      role: formData.get("role"),
    };
    try {
      const response = await fetch("/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        modal.style.display = "none";
        location.reload();
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
  });
}

function initEditUserModal() {
  const modal = document.getElementById("editUserModal");
  const closeBtn = document.getElementById("closeEditUser");
  const cancelBtn = document.getElementById("cancelEditUserBtn");
  const form = document.getElementById("editUserForm");

  let userIdToEdit = null;

  // Open modal
  document.addEventListener("click", async (event) => {
    if (event.target.matches(".editUserBtn")) {
      userIdToEdit = event.target.getAttribute("data-id");

      // Populate form with current user data
      try {
        const response = await fetch(`/users/${userIdToEdit}`);
        if (!response.ok) throw new Error("Failed to fetch user data");

        const userData = await response.json();

        document.getElementById("editUsername").value = userData.username;
        document.getElementById("editEmail").value = userData.email;
        document.getElementById("editRole").value = userData.role;

        modal.style.display = "flex";
      } catch (error) {
        console.log("Failed fetching user data", error);
      }
    }
  });

  // Close modal
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Cancel
  cancelBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Click outside closes modal
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  // AJAX submit des Formulars
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!userIdToEdit) return;

    const data = {
      username: document.getElementById("editUsername").value,
      email: document.getElementById("editEmail").value,
      role: document.getElementById("editRole").value,
    };

    try {
      const response = await fetch(`/users/${userIdToEdit}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        modal.style.display = "none";
        location.reload();
      }
    } catch (error) {
      console.log("Error updating user:", error);
    }
  });
}

function initDeleteUserModal() {
  const modal = document.getElementById("deleteUserModal");
  const closeModalBtn = modal.querySelector(".close");
  const confirmDeleteBtn = document.getElementById("confirmDeleteUser");
  const cancelDeleteBtn = document.getElementById("cancelDeleteUser");

  let userIdToDelete = null;

  // Delete
  document.addEventListener("click", (event) => {
    if (event.target.matches(".deleteUserBtn")) {
      userIdToDelete = event.target.getAttribute("data-id");
      modal.style.display = "flex";
    }
  });

  // Close
  closeModalBtn.addEventListener("click", () => {
    modal.style.display = "none";
    userIdToDelete = null;
  });

  // Cancel
  cancelDeleteBtn.addEventListener("click", () => {
    modal.style.display = "none";
    userIdToDelete = null;
  });

  // Click outside
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
      userIdToDelete = null;
    }
  });

  // Confirm delete
  confirmDeleteBtn.addEventListener("click", async () => {
    if (!userIdToDelete) return;

    try {
      const response = await fetch(`/users/${userIdToDelete}`, {
        method: "DELETE",
      });

      if (response.ok) {
        modal.style.display = "none";
        location.reload();
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  });
}
