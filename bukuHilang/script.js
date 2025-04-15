const submitURL = 'https://script.google.com/macros/s/AKfycbynfcO5xFbL4BBIdV-JaMZ3z-a-UQiQF-SJD3-8CBvvtHKbqxvLz8r01jl4bPnjF6abhQ/exec'; // URL Web App untuk submit
const displayURL = 'https://script.google.com/macros/s/AKfycbyFVKd3wwmsgCCSK0yNaMGjjNzmi0Ky1Ju4diuINFqEFId4KJYRjFYQpLJZZNvahVhQtw/exec'; // URL Web App untuk display

const form = document.forms['submit-to-google-sheet'];

// Handle submit form
form.addEventListener('submit', e => {
  e.preventDefault();

  // Ambil data form
  const formData = new FormData(form);
  const data = {};

  // Menyusun data menjadi object JSON
  formData.forEach((value, key) => {
    data[key] = value;
  });

  // Kirim data sebagai JSON ke backend
  fetch(submitURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', // Menyatakan bahwa data yang dikirim dalam format JSON
    },
    body: JSON.stringify(data), // Kirim data sebagai JSON string
  })
    .then(response => {
      return response.json();
    })
    .then(responseData => {
      alert("Data buku hilang berhasil disubmit.");
      form.reset();
      loadLostBooks(); // Refresh tampilan data
    })
    .catch(error => {
      console.error('Error!', error.message);
      alert("Terjadi kesalahan saat mengirim data.");
    });
});

// Fungsi untuk menampilkan data buku hilang ke tabel
function loadLostBooks() {
  fetch(displayURL)
    .then(response => response.json())
    .then(data => {
      const tbody = document.getElementById('tableBody');
      tbody.innerHTML = '';

      if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7">Belum ada data buku hilang.</td></tr>';
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
window.addEventListener('DOMContentLoaded', loadLostBooks);
