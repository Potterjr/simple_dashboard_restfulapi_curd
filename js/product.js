import { url } from './url.js';

function generateQRCode(data, container) {
  const urlget = url();
  const api = "/project/exdashboard/api/selectdata.php?id_product=";
  var qrcode = new QRCode(container, {
    text: urlget + api + data,
    width: 100,
    height: 100,
  });
}

function editRow(btn) {
  const row = btn.closest("tr");
  const cells = row.getElementsByTagName("td");

  cells[1].innerHTML = `<input class="form-control" type="text" value="${cells[1].textContent}">`;
  cells[2].innerHTML = `<input class="form-control" type="text" value="${cells[2].textContent}">`;
  cells[3].innerHTML = `<select class="form-select">
                            <option value="1">1</option>
                            <option value="2">2</option>
                          </select>`;
  cells[4].innerHTML = `<input class="form-control" type="text" value="${cells[4].textContent}">`;
  cells[5].innerHTML = `<input class="form-control" type="text" value="${cells[5].textContent}">`;
  cells[6].innerHTML = `<input class="form-control" type="text" value="${cells[6].textContent}">`;
  cells[7].innerHTML = `<input class="form-control" type="text" value="${cells[7].textContent}">`;

  cells[10].innerHTML = `<button class="btn btn-success btn-rounded mb-2 save-btn">Save</button>`;
  cells[11].innerHTML = `<button class="btn btn-info btn-rounded mb-2 cancel-btn">Cancel</button>`;
}
function saveRow(btn) {
  const row = btn.closest("tr");
  const cells = row.getElementsByTagName("td");

  const id_product = cells[0].textContent;
  const name_spare = cells[1].querySelector("input").value;
  const name_machine = cells[2].querySelector("input").value;
  const type = cells[3].querySelector("select").value;
  const total = cells[4].querySelector("input").value;
  const location = cells[5].querySelector("input").value;
  const price = cells[6].querySelector("input").value;
  const distribution = cells[7].querySelector("input").value;

  console.log("id_product:", id_product);
  console.log("name_spare:", name_spare);
  console.log("name_machine:", name_machine);
  console.log("type:", type);
  console.log("total:", total);
  console.log("location:", location);
  console.log("price:", price);
  console.log("distribution:", distribution);

  const updatedData = {
    id_product: id_product,
    name_spare: name_spare,
    name_machine: name_machine,
    type: type,
    total: total,
    location: location,
    price: price,
    distribution: distribution,
  };

  const apiUrl = `../api/editproduct.php`;

  fetch(apiUrl, {
    method: "PUT",
    body: JSON.stringify(updatedData),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error('Error:', error);
    }).finally(() => {

      for (let i = 1; i <= 7; i++) {
        cells[i].innerHTML = cells[i].querySelector("input, select").value;
      }

      cells[10].innerHTML = `<button class="btn btn-warning btn-rounded mb-2 edit-btn">Change</button>`;
      cells[11].innerHTML = `<button type="button" class="btn btn-danger btn-rounded mb-2 delete-btn">Delete</button>`;
    });

}


function deleteRow(btn) {
  const row = btn.closest("tr");
  const cells = row.getElementsByTagName("td");
  const id_product = cells[0].textContent;
  const apiUrl = `../api/deleteproduct.php?id_product=${id_product}`;

  fetch(apiUrl, {
    method: "DELETE"
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Data updated successfully:", data);
      row.remove();
    })
    .catch((error) => {
      window.alert("ลบไม่ได้เนื่องจากมีการสั่งorderสินค้าแล้ว")

    });
}


function cancelEdit(btn) {
  const row = btn.closest("tr");
  const cells = row.getElementsByTagName("td");


  for (let i = 1; i <= 7; i++) {
    cells[i].innerHTML = cells[i].querySelector("input, select").value;
  }

  cells[10].innerHTML = `<button class="btn btn-warning btn-rounded mb-2 edit-btn">Change</button>`;
  cells[11].innerHTML = `<button type="button" class="btn btn-danger btn-rounded mb-2 delete-btn">Delete</button>`;
}


document.addEventListener("DOMContentLoaded", function () {
  const tableBody = document.querySelector("#myTable tbody");
  fetch("../api/showproduct.php")
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
                    <td>${row.total}</td>
                    <td>${row.location}</td>
                    <td>${row.distribution}</td>
                    <td>${row.price}</td>
                    <td><img src="data:image/jpg;charset=utf8;base64,${row.picture}" alt="Product Image" width="100" height="100"></td>
                    <td></td>
                    <td><button type="button" class="btn btn-warning btn-rounded mb-2 edit-btn">Change</button></td>
                    <td>  <button type="button" class="btn btn-danger btn-rounded mb-2 delete-btn">Delete</button></td>
                `;
        tableBody.appendChild(tr);
        const qrCodeCell = tr.querySelector("td:nth-child(9)");
        generateQRCode(row.id_product, qrCodeCell);
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

  tableBody.addEventListener("click", function (event) {
    if (event.target.classList.contains("edit-btn")) {
      editRow(event.target);
    } else if (event.target.classList.contains("save-btn")) {
      saveRow(event.target);
    } else if (event.target.classList.contains("delete-btn")) {
      deleteRow(event.target);
    } else if (event.target.classList.contains("cancel-btn")) {
      cancelEdit(event.target);
    }
  });



});

