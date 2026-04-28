"use strict";

document.addEventListener("DOMContentLoaded", () => {
  initAddMatchModal();
  initDeleteMatchModal();
  initEditMatchModal();
});

// ====================================================== Modals ======================================================

function initAddMatchModal() {
  const modal = document.getElementById("addMatchModal");
  const addMatchBtn = document.getElementById("addMatchBtn");
  const closeModalBtn = document.querySelector(".close");
  const matchForm = document.getElementById("addMatchForm");

  // Modal öffnen
  addMatchBtn.addEventListener("click", () => {
    modal.style.display = "flex";
  });

  // Modal schließen
  closeModalBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Klick außerhalb schließt das Modal
  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  // AJAX submit des Formulars
  matchForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(matchForm);
    const matchData = Object.fromEntries(formData.entries());

    // Konvertiere win zu boolean und score/kills/deaths zu number
    matchData.win = matchData.win === "true";
    matchData.score = parseInt(matchData.score);
    matchData.kills = parseInt(matchData.kills);
    matchData.deaths = parseInt(matchData.deaths);

    try {
      const response = await fetch("/matches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(matchData),
      });
      const result = await response.json();
      console.log("Match added:", result);
      modal.style.display = "none";
      location.reload();
    } catch (error) {
      console.error("Error adding match:", error);
    }
  });
}

function initDeleteMatchModal() {
  const deleteModal = document.getElementById("deleteMatchModal");
  const closeDelete = document.getElementById("closeDeleteModal");
  const confirmDelete = document.getElementById("confirmDeleteBtn");
  const cancelDelete = document.getElementById("cancelDeleteBtn");

  let matchIdToDelete = null;

  document.addEventListener("click", (e) => {
    if (e.target.matches(".deleteMatchBtn")) {
      matchIdToDelete = e.target.dataset.id;
      deleteModal.style.display = "flex";
    }
  });

  // Schließen
  closeDelete.addEventListener(
    "click",
    () => (deleteModal.style.display = "none"),
  );
  cancelDelete.addEventListener(
    "click",
    () => (deleteModal.style.display = "none"),
  );

  // Klick außerhalb des Modals schließt es
  window.addEventListener("click", (e) => {
    if (e.target === deleteModal) deleteModal.style.display = "none";
  });

  // Confirm Delete via AJAX
  confirmDelete.addEventListener("click", async () => {
    if (!matchIdToDelete) return;

    try {
      const response = await fetch(`/matches/${matchIdToDelete}`, {
        method: "DELETE",
      });
      if (response.ok) {
        deleteModal.style.display = "none";
        location.reload();
      } else {
        console.error("Fehler beim Löschen des Matches");
      }
    } catch (err) {
      console.error(err);
    }
  });
}

function initEditMatchModal() {
  const editModal = document.getElementById("editMatchModal");
  const closeEdit = document.getElementById("closeEditModalBtn");
  const editForm = document.getElementById("editMatchForm");

  let matchIdToEdit = null;

  // Event Delegation für Edit Button
  document.addEventListener("click", async (e) => {
    if (e.target.classList.contains("editMatchBtn")) {
      matchIdToEdit = e.target.dataset.id;

      try {
        const response = await fetch(`/matches/${matchIdToEdit}`);
        const matchData = await response.json();

        // Modal öffnen und Daten setzen
        editModal.style.display = "flex";
        document.getElementById("editMap").value = matchData.map;
        document.getElementById("editMode").value = matchData.mode;
        document.getElementById("editWin").value = matchData.win;
        document.getElementById("editKills").value = matchData.kills;
        document.getElementById("editDeaths").value = matchData.deaths;
        document.getElementById("editScore").value = matchData.score;
      } catch (error) {
        console.error("Error fetching match data:", error);
      }
    }
  });

  // Schließen
  closeEdit.addEventListener("click", () => {
    editModal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === editModal) editModal.style.display = "none";
  });

  // Form submit via AJAX (PUT Request)
  editForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(editForm);
    const updatedData = Object.fromEntries(formData.entries());

    updatedData.win = updatedData.win === "true";
    updatedData.score = parseInt(updatedData.score);
    updatedData.kills = parseInt(updatedData.kills);
    updatedData.deaths = parseInt(updatedData.deaths);

    try {
      await fetch(`/matches/${matchIdToEdit}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      editModal.style.display = "none";
      location.reload();
    } catch (error) {
      console.error("Error updating match:", error);
    }
  });
}
