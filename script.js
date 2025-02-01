// script.js

const budgetLimit = 48;
let budget = budgetLimit;
let picks = 0;
const maxPicks = 5;

const budgetEl = document.getElementById("budget");
const picksEl = document.getElementById("picks");
const warningEl = document.getElementById("warning");
const grid = document.getElementById("playerGrid");
const submitBtn = document.getElementById("submitButton");
const darkModeToggle = document.getElementById("darkModeToggle");

let pairs = []; // Empty array, will be filled with JSON data

// Fetch the pairs.json file and populate the grid dynamically
function loadPairs() {
    fetch("pairs.json")
        .then(response => response.json())
        .then(data => {
            pairs = data; // Store loaded data in the pairs variable
            populateGrid(); // Populate grid with loaded pairs
            updateBudgetUI(); // Update UI after loading data
        })
        .catch(error => console.error("Error loading pairs:", error));
}

// Call the function to load pairs when the page loads
document.addEventListener("DOMContentLoaded", loadPairs);


function updateBudgetUI() {
    const minPrice = Math.min(...pairs.map(p => p.price));
    const remainingPicks = maxPicks - picks;
    const requiredBudget = remainingPicks * minPrice;
    warningEl.style.display = budget < requiredBudget ? "block" : "none";
    updatePairAvailability(minPrice, remainingPicks);
    toggleSubmitButton();
}

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
    
    updatePairAvailability(); // Update disabled pairs dynamically
}



function resetSelection() {
    document.querySelectorAll(".player").forEach(cell => cell.classList.remove("selected"));
    budget = budgetLimit;
    picks = 0;
    budgetEl.textContent = budget;
    picksEl.textContent = picks;
    updateBudgetUI();
}

function sortPairs(selected, available, disabled) {
    // Sort each category by price (most to least expensive)
    selected.sort((a, b) => b.dataset.price - a.dataset.price);
    available.sort((a, b) => b.dataset.price - a.dataset.price);
    disabled.sort((a, b) => b.dataset.price - a.dataset.price);

    // Clear and repopulate the grid
    grid.innerHTML = "";
    [...selected, ...available, ...disabled].forEach(cell => grid.appendChild(cell));
}


function updatePairAvailability() {
    let selectedPairs = [];
    let availablePairs = [];
    let disabledPairs = [];

    const minPrice = Math.min(...pairs.map(p => p.price)); // Find the lowest price
    const remainingPicks = maxPicks - picks; // Remaining selections allowed
    const threshold = budget - (minPrice * (remainingPicks - 1)); // Adjusted budget threshold

    document.querySelectorAll(".player").forEach(cell => {
        const price = parseInt(cell.dataset.price);

        if (cell.classList.contains("selected")) {
            selectedPairs.push(cell); // Already selected, keep it in selected list
        } else if (price > threshold) { 
            // If price exceeds what we can afford while keeping budget for other picks
            cell.classList.add("disabled");
            disabledPairs.push(cell);
        } else {
            cell.classList.remove("disabled");
            availablePairs.push(cell);
        }
    });

    sortPairs(selectedPairs, availablePairs, disabledPairs);
}



function toggleSubmitButton() {
    if (picks === maxPicks) {
        submitBtn.style.display = "inline-block";
    } else {
        submitBtn.style.display = "none";
    }
}

function submitSelection() {
    let selectedPairs = [];
    document.querySelectorAll(".player.selected").forEach(cell => {
        selectedPairs.push(cell.innerText.split("\n")[0]);
    });

    if (selectedPairs.length === maxPicks) {
        let userName = prompt(
            `You have selected:\n\n${selectedPairs.join("\n")}\n\nEnter your name to confirm:`
        );

        // if (userName === null || userName.trim() === "") {
        //     alert("Submission canceled. Please enter your name.");
        //     return;
        // }

        // alert(`Thank you, ${userName}! Your selection has been recorded.`);
        
        // Future: Send data to a backend
        const submissionData = {
            name: userName.trim(),
            picks: selectedPairs,
        };

        console.log("Ready to send to backend:", submissionData);
        // Example API call (not implemented yet)
        // sendToBackend(submissionData);
    }
}

function populateGrid() {
    grid.innerHTML = "";

    pairs.forEach((pair, index) => {
        const cell = document.createElement("div");
        cell.classList.add("player");
        cell.innerHTML = `<strong>${pair.player1}<br>${pair.player2}</strong><br> Price: ${pair.price}cr`;
        cell.dataset.index = index;
        cell.dataset.price = pair.price;

        cell.addEventListener("click", () => toggleSelection(cell, pair));
        grid.appendChild(cell);
    });

    updatePairAvailability(); // Apply the updated sorting and disabling logic
}

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
