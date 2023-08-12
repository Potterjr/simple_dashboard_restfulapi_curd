function editRow(btn) {
  const row = btn.closest("tr");
  const cells = row.getElementsByTagName("td");

  cells[1].innerHTML = `<input class="form-control" type="text" value="${cells[1].textContent}">`;
  cells[2].innerHTML = `<input class="form-control" type="text" value="${cells[2].textContent}">`;
  cells[3].innerHTML = `<button class="btn btn-success btn-rounded mb-2 save-btn">Save</button>`;
  cells[4].innerHTML = `<button class="btn btn-info btn-rounded mb-2 cancel-btn">Cancel</button>`;
}
function saveRow(btn) {
  const row = btn.closest("tr");
  const cells = row.getElementsByTagName("td");

  const id_member	 = cells[0].textContent;
  const name_member = cells[1].querySelector("input").value;
  const level = cells[2].querySelector("input").value;

  const updatedData = {
    id_member: id_member,
    name_member: name_member,
    level: level,

  };

  const apiUrl = `../api/editmember.php?id_member=${id_member}`;

  fetch(apiUrl, {
    method: "PUT",
    body: JSON.stringify(updatedData),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Data updated :", data);
    })
    for (let i = 1; i <= 2; i++) {
      cells[i].innerHTML = cells[i].querySelector("input, select").value;
    }
    cells[3].innerHTML = `<button class="btn btn-warning btn-rounded mb-2 edit-btn">Change</button>`;
    cells[4].innerHTML = `<button type="button" class="btn btn-danger btn-rounded mb-2 delete-btn">Delete</button>`;
}

function cancelEdit(btn) {
  const row = btn.closest("tr");
  const cells = row.getElementsByTagName("td");

 
  for (let i = 1; i <= 2; i++) {
    cells[i].innerHTML = cells[i].querySelector("input, select").value;
  }

  cells[3].innerHTML = `<button class="btn btn-warning btn-rounded mb-2 edit-btn">Change</button>`;
  cells[4].innerHTML = `<button type="button" class="btn btn-danger btn-rounded mb-2 delete-btn">Delete</button>`;
}
function deleteRow(btn) {
  const row = btn.closest("tr");
  const cells = row.getElementsByTagName("td");
  const id_member = cells[0].textContent;
  const apiUrl = `../api/deletemember.php?id_member=${id_member}`;

  fetch(apiUrl, {
    method: "DELETE"
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Data updated successfully:", data);
      row.remove();
    })
    .catch((error) => {
      window.alert("ไม่สามารถลบได้เนื่องจากมีการสั่งorderแล้ว");
    });
}

document.addEventListener("DOMContentLoaded", function () {
  const tableBody = document.querySelector("#myTable tbody");
  fetch("../api/showmember.php")
    .then((response) => response.json())
    .then((data) => {
      tableBody.innerHTML = "";

      data.forEach((row) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
                    <td>${row.id_member}</td>
                    <td>${row.name_member}</td>
                    <td>${row.level}</td>
                    <td><button type="button" class="btn btn-warning btn-rounded mb-2 edit-btn">Change</button></td>
                    <td><button type="button" class="btn btn-danger btn-rounded mb-2 delete-btn">Delete</button></td>
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


  tableBody.addEventListener("click", function (event) {
    if (event.target.classList.contains("edit-btn")) {
      editRow(event.target);
    }
    else if (event.target.classList.contains("save-btn")) {
      saveRow(event.target);

    }else if (event.target.classList.contains("delete-btn")) {
      deleteRow(event.target);
    } else if (event.target.classList.contains("cancel-btn")) {
      cancelEdit(event.target);
    }
  });
});
