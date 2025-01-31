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

const pairs = [
    { player1: "Βρούστης", player2: "Δελημπαλταδάκης", price: 15 },
    { player1: "Δοξιάδης", player2: "Ρούσσος", price: 14 },
    { player1: "Παπακυριακόπουλος", player2: "Φίλιος", price: 14 },
    { player1: "Καναβός", player2: "Ζώτος", price: 13 },
    { player1: "Παπαγιάννης", player2: "Μπανίκας", price: 13 },
    { player1: "Σαπουνάκης", player2: "Πρωτονοτάριος", price: 12 },
    { player1: "Καραμανλής", player2: "Κουκουσέλης", price: 12 },
    { player1: "Μπόζεμπερκ", player2: "Διονυσόπουλος", price: 12 },
    { player1: "Αγγελόπουλος", player2: "Μπαλόκας", price: 11 },
    { player1: "Ματζιάρης", player2: "Κοντομήτρος", price: 11 },
    { player1: "Οικονομόπουλος", player2: "Αθανασιάδης", price: 11 },
    { player1: "Λέφας", player2: "Μαρκάκης", price: 10 },
    { player1: "Ταγαράς", player2: "Σταυρινός", price: 10 },
    { player1: "Δογάνη", player2: "Παπασπύρου", price: 9 },
    { player1: "Καπαγιαννίδη", player2: "Κανελοπούλου", price: 9 },
    { player1: "Κονιδιάρης", player2: "Τσέβης", price: 9 },
    { player1: "Σιδέρης", player2: "Κάσσανδρος", price: 9 },
    { player1: "Σούμπλης", player2: "Καπίρης", price: 9 },
    { player1: "Βελαΐτη", player2: "Παπαχατζής", price: 8 },
    { player1: "Πανόπουλος", player2: "Λαγγουράνης", price: 8 },
    { player1: "Παπαπέτρος", player2: "Μωυσίδης", price: 8 },
    { player1: "Κάτσαρης", player2: "Σοφιός", price: 7 },
    { player1: "Λιακοπούλου", player2: "Χατζηδάκης", price: 7 },
    { player1: "Μπομπολάκης", player2: "Ρούσογλου", price: 7 },
    { player1: "Ράμος", player2: "Καβαλάκης", price: 7 },
    { player1: "Κωστόπουλος", player2: "Στεφανόπουλος", price: 6 },
    { player1: "Παπακωνσταντίνου", player2: "Βλοχαιτόπουλος", price: 6 },
    { player1: "Γεμίδης1", player2: "Γεμίδης2", price: 5 },
    { player1: "Γεμίδης3", player2: "Γεμίδης4", price: 5 },
    { player1: "Γεμίδης5", player2: "Γεμίδης6", price: 5 },
    { player1: "Γεμίδης7", player2: "Γεμίδης8", price: 5 },
    { player1: "Γεμίδης9", player2: "Γεμίδης10", price: 5 },
    { player1: "Θεοδωρίδης", player2: "Παπαματθαίου", price: 5 },
    { player1: "Κασιμοπούλου", player2: "Καρατζά", price: 5 },
    { player1: "Γεμίδης11", player2: "Γεμίδης12", price: 4 },
    { player1: "Γεμίδης13", player2: "Γεμίδης14", price: 4 },
    { player1: "Γεμίδης15", player2: "Γεμίδης16", price: 4 },
    { player1: "Σιδηρόπουλος", player2: "Καπράκης", price: 4 },
    { player1: "Μαγκαφίνη", player2: "Κουλούσης", price: 4 },
    { player1: "Πετράκη", player2: "Ζερβογιάννης", price: 4 }
];

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
    updateBudgetUI();
}

function resetSelection() {
    document.querySelectorAll(".player").forEach(cell => cell.classList.remove("selected"));
    budget = budgetLimit;
    picks = 0;
    budgetEl.textContent = budget;
    picksEl.textContent = picks;
    updateBudgetUI();
}

function updatePairAvailability(minPrice, remainingPicks) {
    let enabledPairs = [];
    let disabledPairs = [];

    document.querySelectorAll(".player").forEach(cell => {
        const price = parseInt(cell.dataset.price);
        const affordableThreshold = budget - (remainingPicks - 1) * minPrice;
        if ((warningEl.style.display === "block" || price > affordableThreshold) && !cell.classList.contains("selected")) {
            cell.classList.add("disabled");
            disabledPairs.push(cell);
        } else {
            cell.classList.remove("disabled");
            enabledPairs.push(cell);
        }
    });

    grid.innerHTML = "";
    [...enabledPairs, ...disabledPairs].forEach(cell => grid.appendChild(cell));
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
    let enabledPairs = [];
    let disabledPairs = [];

    pairs.forEach((pair, index) => {
        const cell = document.createElement("div");
        cell.classList.add("player");
        cell.innerHTML = `<strong>${pair.player1}<br>${pair.player2}</strong><br> Price: ${pair.price}cr`;
        cell.dataset.index = index;
        cell.dataset.price = pair.price;

        const price = pair.price;
        if (budget < price) {
            cell.classList.add("disabled");
            disabledPairs.push(cell);
        } else {
            enabledPairs.push(cell);
        }

        cell.addEventListener("click", () => toggleSelection(cell, pair));
    });

    [...enabledPairs, ...disabledPairs].forEach(cell => grid.appendChild(cell));

    updatePairAvailability(Math.min(...pairs.map(p => p.price)), maxPicks);
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
