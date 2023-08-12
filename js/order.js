const tableBody = document.querySelector("#myTable tbody");
const searchButton = document.querySelector("#searchButton");
const checkingButton = document.querySelector("#checking");
const deliveryButton = document.querySelector("#delivery");
const successfullyButton = document.querySelector("#successfully");
const cancelButton = document.querySelector("#cancel");
const checkAllCheckbox = document.querySelector("#checkall");

function handleCheckboxClick(checkbox) {
  if (checkbox.checked) {
    const values = checkbox.value.split(",");
    const idOrder = values[0];
    const idProduct = values[1];
    console.log("Clicked checkbox for id_order:", idOrder);
    console.log("Associated id_product:", idProduct);
  }
}

function updateStatus(id_order, id_product, newStatus) {
  const updateUrl = "../api/updatestatus.php";

  fetch(updateUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      id_order: id_order,
      id_product: id_product,
      status: newStatus
    })
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Status updated successfully:", data);
    })
    .catch((error) => {
      console.error("Error updating status:", error);
    })
    .finally(() => {
      const idOrderInput = document.querySelector("#id_order").value;
      fetch(`../api/showorder.php?id_order=${idOrderInput}`)
        .then((response) => response.json())
        .then((data) => {
          tableBody.innerHTML = "";
          data.forEach((row) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
              <td>
                <input class="form-check-input" type="checkbox" value="${row.id_order},${row.id_product}" id="flexCheckDefault">
              </td>
              <td>${row.id_order}</td>
              <td>${row.id_product}</td>
              <td>${row.id_member}</td>
              <td>${row.quantity}</td>
              <td>${row.timestamp}</td>
              <td>${row.status}</td>
             
            `;

            const checkbox = tr.querySelector(".form-check-input");
            if (checkbox) {
              checkbox.addEventListener("click", () => {
                handleCheckboxClick(checkbox);
              });
            }
            tableBody.appendChild(tr);
          });
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    });
}


searchButton.addEventListener("click", () => {
  const idOrderInput = document.querySelector("#id_order").value;

  if (idOrderInput.trim() === "") {
    alert("Please enter an id_order to search.");
    return;
  }

  fetch(`../api/showorder.php?id_order=${idOrderInput}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      tableBody.innerHTML = "";
      data.forEach((row) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>
            <input class="form-check-input" type="checkbox" value="${row.id_order},${row.id_product}" id="flexCheckDefault">
          </td>
          <td>${row.id_order}</td>
          <td>${row.id_product}</td>
          <td>${row.id_member}</td>
          <td>${row.quantity}</td>
          <td>${row.timestamp}</td>
          <td>${row.status}</td>
        `;

        const checkbox = tr.querySelector(".form-check-input");
        if (checkbox) {
          checkbox.addEventListener("click", () => {
            handleCheckboxClick(checkbox);
          });
        }
        tableBody.appendChild(tr);
      });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
});

function handleStatusButtonClick(status) {
  const checkedCheckboxes = tableBody.querySelectorAll(".form-check-input:checked");
  if (checkedCheckboxes.length === 0) {
    alert("Please select at least one order.");
    return;
  }

  checkedCheckboxes.forEach(checkbox => {
    const [idOrder, idProduct] = checkbox.value.split(",");
    updateStatus(idOrder, idProduct, status);
  });
}

checkingButton.addEventListener("click", () => {
  handleStatusButtonClick("กำลังตรวจสอบ");
});

deliveryButton.addEventListener("click", () => {
  handleStatusButtonClick("กำลังจัดส่ง");
});

successfullyButton.addEventListener("click", () => {
  handleStatusButtonClick("จัดส่งสำเร็จ");
});

cancelButton.addEventListener("click", () => {
  handleStatusButtonClick("ยกเลิกออเดอร์");
});
checkAllCheckbox.addEventListener("click", () => {
  const checkboxes = tableBody.querySelectorAll(".form-check-input");
  checkboxes.forEach(checkbox => {
    checkbox.checked = checkAllCheckbox.checked;
  });
});
