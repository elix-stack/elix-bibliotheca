// Saat dokumen siap, ambil data dari Google Sheet
document.addEventListener("DOMContentLoaded", function () {
  const sheetURL = "https://script.google.com/macros/s/AKfycbwh6jag6I3XmWI2nGRJ7XpzAksLs0zx5iBagTLfdg56o878iOEAbpj6e41wyDpv28cn8w/exec";
  fetchData(sheetURL);
});

// Mengambil data CSV dari Google Sheets
function fetchData(sheetURL) {
fetch(sheetURL)
.then(response => response.json())
.then(data => populateTable(data))
.catch(error => console.error("Gagal mengambil data:", error));
}

// Mengisi tabel dengan data yang diambil
function populateTable(data) {
const tableBody = document.getElementById("tableBody");
tableBody.innerHTML = "";

data.forEach(row => {
const newRow = document.createElement("tr");
newRow.innerHTML = `
  <td>${row["Book Title"] || "-"}</td>
  <td>${row["Writter"] || "-"}</td>
  <td>${row["Year of Publish"] || "-"}</td>
  <td>${row["SUM of Quantity"] || "-"}</td>
`;
tableBody.appendChild(newRow);
});
}


function searchTable() {
  const searchValue = document.getElementById("searchInput").value.toLowerCase().trim();
  const tableBody = document.getElementById("tableBody");
  const rows = Array.from(tableBody.querySelectorAll("tr"));

  let found = false;

  rows.forEach(row => {
    let cells = row.getElementsByTagName("td");
    let match = false;

    for (let cell of cells) {
      let newText = cell.textContent;
        if (newText.toLowerCase().includes(searchValue)) {
        match = true;
        newText = newText.replace(
        new RegExp(`(${searchValue})`, "gi"),
        `<span class="highlight">$1</span>`
        );
        }
      cell.innerHTML = newText;
    }

    if (match && !found) {
      row.scrollIntoView({ behavior: "smooth", block: "center" });
      found = true;
    }
  });

  if (!found) {
    alert(`Kata "${searchValue}" tidak ditemukan dalam daftar.`);
  }
}

document.getElementById("searchButton").addEventListener("click", searchTable);
document.getElementById("backToTop").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});