// script.js untuk Buku Rusak

// URL Web App GAS untuk submit dan display data
const submitURL = 'https://script.google.com/macros/s/AKfycbzYnkJuY8EHRLbCvSBIM5MG3D0nWMpPQbEZusBVMWcsDcMZyXCkKAptyvl8awz4MaHXrA/exec';
const displayURL = 'https://script.google.com/macros/s/AKfycbyCBZj9S22NBbWZ-ZU6IdFQWJA45wSl3Oea2D4RLwiqWh7_oby5mNiOogj1kuN0evVzZw/exec';

const form = document.forms['submit-to-google-sheet'];

// Handle submit form
form.addEventListener('submit', e => {
  e.preventDefault();

  fetch(submitURL, { method: 'POST', body: new FormData(form) })
    .then(response => {
      alert("Data buku rusak berhasil disubmit.");
      form.reset();
      loadBrokenBooks(); // Refresh tampilan data
    })
    .catch(error => {
      console.error('Error!', error.message);
      alert("Terjadi kesalahan saat mengirim data.");
    });
});

// Fungsi untuk menampilkan data buku rusak ke halaman HTML
function loadBrokenBooks() {
  fetch(displayURL)
    .then(response => response.json())
    .then(data => {
      const tbody = document.getElementById('tableBody');
      tbody.innerHTML = ''; // Kosongkan isi sebelumnya

      if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7">Belum ada data buku rusak.</td></tr>';
        return;
      }

      data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${item['Timestamp'] || '-'}</td>
          <td>${item['ID Book']}</td>
          <td>${item['Book Title']}</td>
          <td>${item['Writer']}</td>
          <td>${item['Year of Publish']}</td>
          <td>${item['Quantity']}</td>
          <td>${item['Status']}</td>
        `;
        tbody.appendChild(row);
      });
    })
    .catch(error => {
      console.error('Gagal memuat data:', error);
      document.getElementById('tableBody').innerHTML = '<tr><td colspan="7">Gagal memuat data.</td></tr>';
    });
}

// Jalankan saat halaman dimuat
window.addEventListener('DOMContentLoaded', loadBrokenBooks);
