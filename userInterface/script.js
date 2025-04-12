    // Saat dokumen siap, ambil data dari Google Sheet
    document.addEventListener("DOMContentLoaded", function () {
      const sheetURL = "https://docs.google.com/spreadsheets/d/10ZCSRTx28XfooFFQGueu6B0_qe18sSlt2MRGHjuL7GM/edit?usp=sharing";
      fetchData(sheetURL);
    });

    // Mengambil data CSV dari Google Sheets
    function fetchData(sheetURL) {
      fetch(sheetURL)
        .then(response => response.text())
        .then(data => populateTable(data))
        .catch(error => console.error("Gagal mengambil data:", error));
    }

    // Mengisi tabel dengan data yang diambil
    function populateTable(data) {
      const tableBody = document.getElementById("tableBody");
      tableBody.innerHTML = "";

      const rows = data.split("\n").slice(1); // Lewati header
      rows.forEach(row => {
        const columns = row.split(",");
        const newRow = document.createElement("tr");

        columns.forEach(column => {
          const cell = document.createElement("td");
          cell.textContent = column.trim();
          newRow.appendChild(cell);
        });

        tableBody.appendChild(newRow);
      });
    }

    // Fungsi pencarian dan scroll otomatis ke hasil
    function searchTable() {
      const searchValue = document.getElementById("searchInput").value.toLowerCase().trim();
      const tableBody = document.getElementById("tableBody");
      const rows = Array.from(tableBody.querySelectorAll("tr"));

      let found = false;

      rows.forEach(row => {
        let cells = row.getElementsByTagName("td");
        let match = false;

        // Highlight jika ada kecocokan
        for (let cell of cells) {
          let words = cell.textContent.split(" ");
          let newText = words.map(word => {
            if (word.toLowerCase() === searchValue) {
              match = true;
              return `<span class="highlight">${word}</span>`;
            }
            return word;
          }).join(" ");

          cell.innerHTML = newText;
        }

        // Scroll ke hasil pertama yang cocok
        if (match && !found) {
          row.scrollIntoView({ behavior: "smooth", block: "center" });
          found = true;
        }
      });

      if (!found) {
        alert(`Kata "${searchValue}" tidak ditemukan dalam daftar.`);
      }
    }

    // Tombol pencarian diklik
    document.getElementById("searchButton").addEventListener("click", searchTable);

    // Tombol untuk kembali ke atas
    document.getElementById("backToTop").addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });