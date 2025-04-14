const scriptURL = 'https://script.google.com/macros/s/AKfycbxcrqpLzKcaFkwnH2AaZCDxhFXpK_vAvG2dtavsTmIqECPcfuUdZ655eSGZCUdOT4S3Lw/exec';
const form = document.forms['submit-to-google-sheet'];

form.addEventListener('submit', e => {
  e.preventDefault();

  // Tampilkan loader
  document.getElementById("loading").style.display = "block";

  // Validasi quantity
  const quantity = form.querySelector('#quantity').value;
  if (isNaN(quantity) || Number(quantity) <= 0) {
    alert("Quantity harus berupa angka dan lebih dari 0.");
    document.getElementById("loading").style.display = "none";
    return;
  }

  const formData = new FormData(form);

  // Kirim data ke Apps Script
  fetch(scriptURL, { method: 'POST', body: formData })
    .then(response => {
      console.log('Success!', response);
      form.reset();
      document.getElementById("loading").style.display = "none";
    })
    .catch(error => {
      console.error('Error!', error.message);
      document.getElementById("loading").style.display = "none";
    });
});

// Saat dokumen siap dimuat, ambil data dari Google Sheets
document.addEventListener("DOMContentLoaded", function () {
  const sheetURL = "https://script.google.com/macros/s/AKfycbzvWe9gvgrzitNKktt1Kl7NrgiY-0eUaNXKHXW1gfejvath6S33QX-DEHoTblTw8gVUIg/exec";
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
let originalTableData = []; // Pastikan ini dideklarasikan global
function populateTable(data) {
  const tableBody = document.getElementById("tableBody");
  tableBody.innerHTML = ""; // Kosongkan isi sebelumnya
  originalTableData = []; // Reset isi asli

  data.forEach(row => {
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
      <td>${row["timestamp"] || "-"}</td>
      <td>${row["ID Member"] || "-"}</td>
      <td>${row["Nama Peminjam"] || "-"}</td>
      <td>${row["Email Peminjam"] || "-"}</td>
      <td>${row["Telp Peminjam"] || "-"}</td>
      <td>${row["ID Book"] || "-"}</td>
      <td>${row["Book Title"] || "-"}</td>
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

  rows.forEach((row, rowIndex) => {
    let match = false;

    Array.from(row.cells).forEach((cell, cellIndex) => {
      const originalText = originalTableData[rowIndex][cellIndex];
      const lowerText = originalText.toLowerCase();

      if (lowerText.includes(searchValue)) {
        match = true;
        cell.innerHTML = originalText.replace(
          new RegExp(`(${searchValue})`, "gi"),
          `<span class="highlight">$1</span>`
        );
      } else {
        cell.innerHTML = originalText;
      }
    });

    if (match && !found) {
      row.scrollIntoView({ behavior: "smooth", block: "center" });
      found = true;
    }
  });

  if (!found) {
    alert(`Kata "${searchValue}" tidak ditemukan dalam daftar.`);
  }
}

// Tombol pencarian (klik)
document.getElementById("searchButton").addEventListener("click", searchTable);

// Tombol pencarian (tekan Enter)
document.getElementById("searchInput").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    searchTable();
  }
});

// Tombol back to top
document.getElementById("backToTop").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
