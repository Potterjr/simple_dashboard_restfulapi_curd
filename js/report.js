document.addEventListener("DOMContentLoaded", function () {
    const tableBody = document.querySelector("#myTable tbody");
    fetch("../api/showreport.php")
        .then((response) => response.json())
        .then((data) => {
            tableBody.innerHTML = "";

            data.forEach((row) => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
          <td>${row.id_product}</td>
          <td>${row.name_spare}</td>
          <td>${row.name_machine}</td>
          <td>${row.type}</td>
          <td>${row.report_total}</td>
          <td>${row.product_total}</td>
          <td>${row.report_timestamp}</td>
            
                  `;
                tableBody.appendChild(tr);
            });
        });
  
    const searchInput = document.getElementById("searchInput");

    function filterTable(query) {
        const rows = tableBody.getElementsByTagName("tr");

        for (const row of rows) {
            const cells = row.getElementsByTagName("td");
            let shouldShow = false;

            for (const cell of cells) {
                if (cell.textContent.toLowerCase().includes(query.toLowerCase())) {
                    shouldShow = true;
                    break;
                }
            }

            row.style.display = shouldShow ? "" : "none";
        }
    }

    searchInput.addEventListener("input", function () {
        filterTable(this.value);
    });
});