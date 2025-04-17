// Endpoint GAS
        const formSubmitURL = 'https://script.google.com/macros/s/AKfycbzYnkJuY8EHRLbCvSBIM5MG3D0nWMpPQbEZusBVMWcsDcMZyXCkKAptyvl8awz4MaHXrA/exec';
        const brokenDataURL = 'https://script.google.com/macros/s/AKfycbyCBZj9S22NBbWZ-ZU6IdFQWJA45wSl3Oea2D4RLwiqWh7_oby5mNiOogj1kuN0evVzZw/exec';
        
        
        let originalTableData = [];
        
        document.addEventListener("DOMContentLoaded", () => {
          fetchData(brokenDataURL);
          initFormSubmit();
          initSearch();
          initBackToTop();
        });
        
        function fetchData(url) {
          fetch(url)
            .then(res => res.json())
            .then(data => populateTable(data))
            .catch(err => console.error("Gagal fetch data:", err));
        }
        
        function populateTable(data) {
          const tbody = document.getElementById("tableBody");
          tbody.innerHTML = "";
          originalTableData = [];
        
          data.forEach(row => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
              <td>${row["timestamp"] || "-"}</td>
              <td>${row["ID Book"] || "-"}</td>
              <td>${row["Book Title"] || "-"}</td>
              <td>${row["Writer"] || "-"}</td>
              <td>${row["Year of Publish"] || "-"}</td>
              <td>${row["Quantity"] || "-"}</td>
              <td>${row["Condition"] || "-"}</td>
            `;
            tbody.appendChild(tr);
            originalTableData.push(Array.from(tr.cells).map(cell => cell.innerHTML));
          });
        }
        
        function initFormSubmit() {
          const form = document.forms['submit-to-google-sheet'];
          form.addEventListener('submit', e => {
            e.preventDefault();
            fetch(formSubmitURL, { method: 'POST', body: new FormData(form) })
              .then(() => {
                form.reset();
                fetchData(loanDataURL);  // Panggil ulang fetchData setelah data berhasil ditambahkan
                alert("Data berhasil ditambahkan!");
                messageDiv.innerHTML = 'Data berhasil disubmit!';
              })
              .catch(error => {
                console.error(error);
                alert("Gagal mengirim data.");
              });
          });
        }
        
        function initSearch() {
          const input = document.getElementById("searchInput");
          const button = document.getElementById("searchButton");
        
          function search() {
            const keyword = input.value.toLowerCase();
            const rows = document.querySelectorAll("#tableBody tr");
            let found = false;
        
            rows.forEach((row, rowIndex) => {
              let match = false;
              Array.from(row.cells).forEach((cell, cellIndex) => {
                const original = originalTableData[rowIndex][cellIndex];
                const text = original.toLowerCase();
                if (text.includes(keyword)) {
                  match = true;
                  cell.innerHTML = original.replace(
                    new RegExp(`(${keyword})`, "gi"),
                    `<span class="highlight">$1</span>`
                  );
                } else {
                  cell.innerHTML = original;
                }
              });
              if (match && !found) {
                row.scrollIntoView({ behavior: "smooth", block: "center" });
                found = true;
              }
            });
        
            if (!found) alert(`Tidak ditemukan: "${keyword}"`);
          }
        
          button.addEventListener("click", search);
          input.addEventListener("keypress", e => {
            if (e.key === "Enter") search();
          });
        }
        
        function initBackToTop() {
          document.getElementById("backToTop").addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          });
        }