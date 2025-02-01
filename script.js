// script.js

// Global Variables
const budgetLimit = 48;
let budget = budgetLimit;
let picks = 0;
const maxPicks = 5;
let pairs = []; // This will be loaded from pairs.json

// DOM Elements
const budgetEl = document.getElementById("budget");
const picksEl = document.getElementById("picks");
const warningEl = document.getElementById("warning");
const grid = document.getElementById("playerGrid");
const submitBtn = document.getElementById("submitButton");
const darkModeToggle = document.getElementById("darkModeToggle");

// Load pairs from the JSON file
function loadPairs() {
  fetch("pairs.json")
    .then((response) => response.json())
    .then((data) => {
      pairs = data;
      populateGrid();
      updateBudgetUI();
    })
    .catch((error) => console.error("Error loading pairs:", error));
}

document.addEventListener("DOMContentLoaded", loadPairs);

// Update UI for budget, warning and pair availability
function updateBudgetUI() {
  const minPrice = Math.min(...pairs.map((p) => p.price));
  const remainingPicks = maxPicks - picks;
  const requiredBudget = remainingPicks * minPrice;
  warningEl.style.display = budget < requiredBudget ? "block" : "none";
  updatePairAvailability();
  toggleSubmitButton();
}

// Toggle selection of a pair card
function toggleSelection(cell, pair) {
  if (cell.classList.contains("disabled")) return;

  if (cell.classList.contains("selected")) {
    cell.classList.remove("selected");
    budget += pair.price;
    picks--;
  } else {
    if (budget < pair.price || picks >= maxPicks) return;
    cell.classList.add("selected");
    budget -= pair.price;
    picks++;
  }

  budgetEl.textContent = budget;
  picksEl.textContent = picks;
  updatePairAvailability();
}

// Reset all selections
function resetSelection() {
  document.querySelectorAll(".pair").forEach((cell) => cell.classList.remove("selected"));
  budget = budgetLimit;
  picks = 0;
  budgetEl.textContent = budget;
  picksEl.textContent = picks;
  updateBudgetUI();
}

// Dummy logout function (clears localStorage and reloads the page)
function logoutSelection() {
  localStorage.clear();
  location.reload();
}

// Sort the pairs into selected, available, and disabled arrays then update the grid order
function sortPairs(selected, available, disabled) {
  selected.sort((a, b) => b.dataset.price - a.dataset.price);
  available.sort((a, b) => b.dataset.price - a.dataset.price);
  disabled.sort((a, b) => b.dataset.price - a.dataset.price);

  grid.innerHTML = "";
  [...selected, ...available, ...disabled].forEach((cell) => grid.appendChild(cell));
}

// Update pair availability based on remaining budget and picks
function updatePairAvailability() {
  let selectedPairs = [];
  let availablePairs = [];
  let disabledPairs = [];
  const minPrice = Math.min(...pairs.map((p) => p.price));
  const remainingPicks = maxPicks - picks;
  const threshold = budget - (minPrice * (remainingPicks - 1));

  document.querySelectorAll(".pair").forEach((cell) => {
    const price = parseInt(cell.dataset.price, 10);
    if (cell.classList.contains("selected")) {
      selectedPairs.push(cell);
    } else if (price > threshold) {
      cell.classList.add("disabled");
      disabledPairs.push(cell);
    } else {
      cell.classList.remove("disabled");
      availablePairs.push(cell);
    }
  });

  sortPairs(selectedPairs, availablePairs, disabledPairs);
}

// Toggle the submit button based on the number of picks
function toggleSubmitButton() {
  submitBtn.style.display = picks === maxPicks ? "inline-block" : "none";
}

// Submit the selection after confirming the user’s name
function submitSelection() {
  let selectedPairs = [];
  document.querySelectorAll(".pair.selected").forEach((cell) => {
    // Use the first line (pair names) as the identifier
    selectedPairs.push(cell.innerText.split("\n")[0]);
  });

  if (selectedPairs.length === maxPicks) {
    let userName = prompt(
      `You have selected:\n\n${selectedPairs.join("\n")}\n\nEnter your name to confirm:`
    );

    if (!userName || userName.trim() === "") {
      alert("Submission canceled. Please enter your name.");
      return;
    }

    const submissionData = {
      name: userName.trim(),
      picks: selectedPairs,
    };

    console.log("Ready to send to backend:", submissionData);
    alert(`Thank you, ${userName}! Your selection has been recorded.`);
    // Future implementation: Send submissionData to the backend
  }
}

// Dynamically populate the grid with pairs from pairs.json
function populateGrid() {
  grid.innerHTML = "";

  pairs.forEach((pair, index) => {
    const cell = document.createElement("div");
    cell.classList.add("pair");
    cell.dataset.index = index;
    cell.dataset.price = pair.price;

    // Show the shorter name first
    const name1 = pair.player1;
    const name2 = pair.player2;
    const [firstName, secondName] = name1.length <= name2.length
      ? [name1, name2]
      : [name2, name1];

    cell.innerHTML = `
      <div class="pair-info">
        <div class="pair-names">
          <strong>${firstName}</strong><br>
          <strong>${secondName}</strong>
        </div>
      </div>
      <div class="price-tag">${pair.price}cr</div>
    `;
    cell.addEventListener("click", () => toggleSelection(cell, pair));
    grid.appendChild(cell);
  });

  updatePairAvailability();
}

// Dark Mode toggle functions
function toggleDarkMode() {
  const isDarkMode = document.body.classList.toggle("dark-mode");
  if (isDarkMode) {
    localStorage.setItem("darkMode", "enabled");
    document.getElementById("dark-mode-style").setAttribute("href", "dark-mode.css");
    darkModeToggle.innerText = "";
  } else {
    localStorage.setItem("darkMode", "disabled");
    document.getElementById("dark-mode-style").setAttribute("href", "");
    darkModeToggle.innerText = "";
  }
}

function checkDarkMode() {
  if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
    document.getElementById("dark-mode-style").setAttribute("href", "dark-mode.css");
    darkModeToggle.innerText = "";
  } else {
    darkModeToggle.innerText = "";
  }
}

checkDarkMode();
populateGrid();
updateBudgetUI();
