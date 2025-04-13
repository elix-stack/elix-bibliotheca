// Saat dokumen siap, ambil data dari Google Sheet
// document.addEventListener("DOMContentLoaded", function () {
//   const sheetURL = "https://script.google.com/macros/s/AKfycbzNLsrXkouOGhmrQ59hDRoKAzSBZw1hwOewxUOfIrnIY_DGrtZx2pK3MqPaCBQOhsf2YQ/exec";
//   fetchData(sheetURL);
// });

// Mengambil data CSV dari Google Sheets
// function fetchData(sheetURL) {
// fetch(sheetURL)
// .then(response => response.json())
// .then(data => populateTable(data))
// .catch(error => console.error("Gagal mengambil data:", error));
// }

// Mengisi tabel dengan data yang diambil
// function populateTable(data) {
// const tableBody = document.getElementById("tableBody");
// tableBody.innerHTML = "";

// data.forEach(row => {
// const newRow = document.createElement("tr");
// newRow.innerHTML = `
//   <td>${row["timestamp"] || "-"}</td>
//   <td>${row["ID Book"] || "-"}</td>
//   <td>${row["Book Title"] || "-"}</td>
//   <td>${row["Writter"] || "-"}</td>
//   <td>${row["Year of Publish"] || "-"}</td>
//   <td>${row["Quantity"] || "-"}</td>
// `;
// tableBody.appendChild(newRow);
// });
// }


// function searchTable() {
//   const searchValue = document.getElementById("searchInput").value.toLowerCase().trim();
//   const tableBody = document.getElementById("tableBody");
//   const rows = Array.from(tableBody.querySelectorAll("tr"));

//   let found = false;

//   rows.forEach(row => {
//     let cells = row.getElementsByTagName("td");
//     let match = false;

//     for (let cell of cells) {
//       let newText = cell.textContent;
//         if (newText.toLowerCase().includes(searchValue)) {
//         match = true;
//         newText = newText.replace(
//         new RegExp(`(${searchValue})`, "gi"),
//         `<span class="highlight">$1</span>`
//         );
//         }
//       cell.innerHTML = newText;
//     }

//     if (match && !found) {
//       row.scrollIntoView({ behavior: "smooth", block: "center" });
//       found = true;
//     }
//   });

//   if (!found) {
//     alert(`Kata "${searchValue}" tidak ditemukan dalam daftar.`);
//   }
// }

// document.getElementById("searchButton").addEventListener("click", searchTable);
// document.getElementById("backToTop").addEventListener("click", () => {
//   window.scrollTo({ top: 0, behavior: 'smooth' });
// });

// Variabel global untuk menyimpan isi asli setiap sel tabel
let originalTableData = [];

// Saat dokumen siap dimuat, ambil data dari Google Sheets
document.addEventListener("DOMContentLoaded", function () {
  const sheetURL = "https://script.google.com/macros/s/AKfycbzNLsrXkouOGhmrQ59hDRoKAzSBZw1hwOewxUOfIrnIY_DGrtZx2pK3MqPaCBQOhsf2YQ/exec";
  fetchData(sheetURL);
});

// Fungsi untuk mengambil data dari Google Sheets dalam format JSON
function fetchData(sheetURL) {
  fetch(sheetURL)
    .then(response => response.json())
    .then(data => populateTable(data))
    .catch(error => console.error("Gagal mengambil data:", error));
}

// Fungsi untuk mengisi tabel dengan data yang diambil dan menyimpan versi asli-nya
function populateTable(data) {
  const tableBody = document.getElementById("tableBody");
  tableBody.innerHTML = ""; // Kosongkan isi sebelumnya
  originalTableData = []; // Reset isi asli

  data.forEach(row => {
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
      <td>${row["timestamp"] || "-"}</td>
      <td>${row["ID Book"] || "-"}</td>
      <td>${row["Book Title"] || "-"}</td>
      <td>${row["Writter"] || "-"}</td>
      <td>${row["Year of Publish"] || "-"}</td>
      <td>${row["Quantity"] || "-"}</td>
    `;
    tableBody.appendChild(newRow);

    // Simpan isi asli dari setiap sel untuk kebutuhan highlight pencarian
    const cellContents = Array.from(newRow.cells).map(cell => cell.innerHTML);
    originalTableData.push(cellContents);
  });
}

// Fungsi untuk mencari teks dalam tabel dan memberi highlight
function searchTable() {
  const searchValue = document.getElementById("searchInput").value.toLowerCase().trim();
  const tableBody = document.getElementById("tableBody");
  const rows = Array.from(tableBody.querySelectorAll("tr"));

  let found = false;

  // Loop melalui setiap baris tabel
  rows.forEach((row, rowIndex) => {
    let match = false;

    // Loop melalui setiap sel dalam baris
    Array.from(row.cells).forEach((cell, cellIndex) => {
      // Ambil isi asli cell (tanpa highlight)
      const originalText = originalTableData[rowIndex][cellIndex];
      const lowerText = originalText.toLowerCase();

      if (lowerText.includes(searchValue)) {
        match = true;
        // Ganti bagian teks yang cocok dengan elemen highlight
        cell.innerHTML = originalText.replace(
          new RegExp(`(${searchValue})`, "gi"),
          `<span class="highlight">$1</span>`
        );
      } else {
        // Jika tidak cocok, kembalikan ke isi asli (tanpa highlight)
        cell.innerHTML = originalText;
      }
    });

    // Jika baris cocok dan belum ada hasil sebelumnya, scroll ke sana
    if (match && !found) {
      row.scrollIntoView({ behavior: "smooth", block: "center" });
      found = true;
    }
  });

  // Jika tidak ditemukan sama sekali, tampilkan alert
  if (!found) {
    alert(`Kata "${searchValue}" tidak ditemukan dalam daftar.`);
  }
}

// Tombol pencarian (klik)
document.getElementById("searchButton").addEventListener("click", searchTable);

// Tombol pencarian (tekan Enter)
document.getElementById("searchInput").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    searchTable();
  }
});

// Tombol back to top
document.getElementById("backToTop").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
