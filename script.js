const API_URL =
    "https://script.google.com/macros/s/AKfycbyIakCEBoezqnxfpj2PYO6R5ImkmN2RF3DpLwc1nYf0Mc6cLRA7NaQocB4eXxn2hJDn/exec";

const form = document.getElementById("transactionForm");
const yeetBtn = document.getElementById("yeetBtn");
const historyContainer = document.getElementById("historyContainer");
const emptyMsg = document.getElementById("emptyMsg");

let transactions = [];

window.addEventListener("DOMContentLoaded", fetchTransactions);

async function fetchTransactions() {
    emptyMsg.innerText = "Loading transactions...";
    try {
        const response = await fetch(API_URL);
        transactions = await response.json();
        transactions.sort(
            (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        renderHistory();
    } catch (error) {
        console.error("Error fetching data:", error);
        emptyMsg.innerText = "Failed to load data.";
    }
}

form.addEventListener("input", () => {
    yeetBtn.disabled = !form.checkValidity();
});

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    yeetBtn.disabled = true;
    yeetBtn.innerText = "YEETING...";

    const newEntry = {
        date: document.getElementById("date").value,
        amount: parseFloat(document.getElementById("amount").value).toFixed(2),
        description:
            document.getElementById("description").value || "No Description",
        SouceOfPayment: document.getElementById("source").value, // Mapping to the specific column name
        category: document.getElementById("category").value,
    };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            body: JSON.stringify(newEntry),
        });

        if (response.ok) {
            await fetchTransactions();
            form.reset();
            yeetBtn.disabled = true;
        }
    } catch (error) {
        alert("Yeet failed! Check your connection.");
        console.error(error);
    } finally {
        yeetBtn.innerText = "YEET!";
    }
});

function renderHistory() {
    if (transactions.length > 0) {
        emptyMsg.classList.add("hidden");
    } else {
        emptyMsg.classList.remove("hidden");
    }

    const groups = {};
    transactions.forEach((t) => {
        const dateObj = new Date(t.date);
        const monthYear = dateObj.toLocaleString("default", {
            month: "long",
            year: "numeric",
        });
        if (!groups[monthYear]) groups[monthYear] = [];
        groups[monthYear].push(t);
    });

    historyContainer.innerHTML = "";

    Object.keys(groups).forEach((month) => {
        const details = document.createElement("details");
        details.open = true;
        details.className = "group mb-4";

        const summary = document.createElement("summary");
        summary.className =
            "bg-gray-400 text-white p-3 rounded-lg cursor-pointer font-bold list-none flex justify-between items-center mb-2";
        summary.innerHTML = `${month} <span class="text-xs">▼</span>`;

        const listContainer = document.createElement("div");
        listContainer.className = "space-y-2";

        groups[month].forEach((t) => {
            const card = document.createElement("div");
            card.className =
                "bg-custom-card p-4 rounded-xl flex justify-between items-center shadow-sm";
            // Note: In history, we check for both spelling variants in case old data exists
            const sourceDisplay = t.SouceOfPayment || t.source || "Unknown";

            card.innerHTML = `
                <div class="text-sm">
                    <p class="font-bold">${new Date(t.date).toLocaleDateString(
                        "en-GB",
                        { day: "numeric", month: "short", year: "numeric" }
                    )}</p>
                    <p class="text-gray-600">${t.description}</p>
                    <p class="text-xs text-gray-500">${sourceDisplay} • ${
                t.category
            }</p>
                </div>
                <div class="text-2xl font-bold">$${parseFloat(t.amount).toFixed(
                    2
                )}</div>
            `;
            listContainer.appendChild(card);
        });

        details.appendChild(summary);
        details.appendChild(listContainer);
        historyContainer.appendChild(details);
    });
}
