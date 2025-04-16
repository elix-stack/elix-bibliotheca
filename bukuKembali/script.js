// Tetap menggunakan scriptURL di sini
const scriptURL = 'https://script.google.com/macros/s/AKfycbzoa8F7RBRTW1NZVBmHBh2hVHr_1HtYYUB570en2MTJ5JFJGJv98-y53eTVhCX0df-Dfg/exec';
const form = document.forms['submit-to-google-sheet'];
const messageDiv = document.getElementById('message');
let originalTableData = [];

// Submit form tanpa validasi manual
form.addEventListener('submit', e => {
  e.preventDefault();
  messageDiv.innerHTML = '';

  const formData = new FormData(form);

  fetch(scriptURL, { method: 'POST', body: formData })
    .then(response => {
      messageDiv.innerHTML = 'Data berhasil disubmit!';
      form.reset();
      fetchData(); // Auto-refresh data setelah submit
    })
    .catch(error => {
      messageDiv.innerHTML = 'Terjadi kesalahan saat mengirim data.';
      console.error('Error!', error.message);
    });
});

// Ambil data saat halaman dimuat
document.addEventListener("DOMContentLoaded", function () {
  fetchData();
});

// Ambil data dari Google Sheets
function fetchData() {
  const sheetURL = "https://script.google.com/macros/s/AKfycbxEfbg9OHiy_wxJwlBAToePcxQTQAcls2eWSofYjqjwYMov0DfeDXVzysiQ0ki4X48_bw/exec";
  fetch(sheetURL)
    .then(response => response.json())
    .then(response => {
      const data = response.data || response;
      if (Array.isArray(data)) {
        populateTable(data);
      } else {
        console.error("Format response tidak sesuai:", response);
      }
    })
    .catch(error => console.error("Gagal mengambil data:", error));
}

// Tampilkan data di tabel
function populateTable(data) {
  const tableBody = document.getElementById("tableBody");
  tableBody.innerHTML = "";
  originalTableData = [];

  data.forEach(row => {
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
      <td>${row.Timestamp || "-"}</td>
      <td>${row["ID Member"] || "-"}</td>
      <td>${row["Nama Peminjam"] || "-"}</td>
      <td>${row["Email Peminjam"] || "-"}</td>
      <td>${row["Telp Peminjam"] || "-"}</td>
      <td>${row["ID Book"] || "-"}</td>
      <td>${row["Book Title"] || "-"}</td>
      <td>${row.Quantity || "-"}</td>
    `;
    tableBody.appendChild(newRow);

    const cellContents = Array.from(newRow.cells).map(cell => cell.innerHTML);
    originalTableData.push(cellContents);
  });
}

// Fungsi pencarian + highlight
function searchTable() {
  const searchValue = document.getElementById("searchInput").value.toLowerCase().trim();
  const tableBody = document.getElementById("tableBody");
  const rows = Array.from(tableBody.querySelectorAll("tr"));

  if (!originalTableData.length) {
    alert("Data belum dimuat. Coba refresh halaman.");
    return;
  }

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

// Event pencarian
document.getElementById("searchButton").addEventListener("click", searchTable);
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
