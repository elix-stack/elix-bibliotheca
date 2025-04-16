const scriptURL = 'https://script.google.com/macros/s/AKfycbxcrqpLzKcaFkwnH2AaZCDxhFXpK_vAvG2dtavsTmIqECPcfuUdZ655eSGZCUdOT4S3Lw/exec';
const loanDataURL = 'https://script.google.com/macros/s/AKfycbzvWe9gvgrzitNKktt1Kl7NrgiY-0eUaNXKHXW1gfejvath6S33QX-DEHoTblTw8gVUIg/exec';

const form = document.forms['submit-to-google-sheet'];
let loanData = [];

// Ambil data peminjaman untuk ditampilkan di frontend
function fetchLoanData() {
  fetch(loanDataURL)
    .then(response => response.json())
    .then(data => {
      loanData = data;
      populateLoanTable(data);
    })
    .catch(error => {
      console.error('Gagal mengambil data peminjaman:', error);
    });
}

document.addEventListener("DOMContentLoaded", function () {
  fetchLoanData();
});

form.addEventListener('submit', e => {
  e.preventDefault();
  document.getElementById("loading").style.display = "block";

  const quantity = form.querySelector('#quantity').value;
  if (isNaN(quantity) || Number(quantity) <= 0) {
    alert("Quantity harus berupa angka dan lebih dari 0.");
    document.getElementById("loading").style.display = "none";
    return;
  }

  const idBook = form.querySelector('#idBook').value.trim();
  const bookTitle = form.querySelector('#bookTitle').value.trim();

  if (!idBook || !bookTitle) {
    alert("ID Book dan Book Title harus diisi.");
    document.getElementById("loading").style.display = "none";
    return;
  }

  // Lolos validasi dasar, kirim data ke backend
  const formData = new FormData(form);
  fetch(scriptURL, { method: 'POST', body: formData })
    .then(response => response.json())
    .then(data => {
      alert(data.message);
      form.reset();
      fetchLoanData();
      document.getElementById("loading").style.display = "none";
    })
    .catch(error => {
      console.error('Error!', error.message);
      alert("Terjadi kesalahan, silakan coba lagi.");
      document.getElementById("loading").style.display = "none";
    });
});

// Menampilkan data peminjaman ke tabel
function populateLoanTable(data) {
  const loanTableBody = document.getElementById("loanTableBody");
  loanTableBody.innerHTML = "";

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
    loanTableBody.appendChild(newRow);
  });
}

// Pencarian dengan highlight
let originalTableData = [];
function searchTable() {
  const searchValue = document.getElementById("searchInput").value.toLowerCase().trim();
  const tableBody = document.getElementById("tableBody");
  const rows = Array.from(tableBody.querySelectorAll("tr"));
  let found = false;

  rows.forEach((row, rowIndex) => {
    let match = false;
    Array.from(row.cells).forEach((cell, cellIndex) => {
      const originalText = originalTableData[rowIndex]?.[cellIndex] || "";
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

document.getElementById("searchButton").addEventListener("click", searchTable);
document.getElementById("searchInput").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    searchTable();
  }
});

document.getElementById("backToTop").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
