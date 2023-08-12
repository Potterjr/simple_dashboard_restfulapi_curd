const tableBody = document.querySelector("#myTable tbody");
const selectedProducts = [];

function addorderselect(idProduct, name_spare) {
  selectedProducts.push({ idProduct, name_spare });

  const selectedProductsJSON = JSON.stringify(selectedProducts);
  console.log("Selected Products JSON:", selectedProductsJSON);
}
function updateCartTable() {
  const modalCartTableBody = document.getElementById("modalCartTableBody");
  modalCartTableBody.innerHTML = ""; 

  let totalQuantity = 0;

  selectedProducts.forEach((product, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${product.name_spare}</td>
      <td><input type="number" class="form-control" data-index="${index}" value="1" min="1" required></td>
      <td><button type="button" class="btn btn-danger btn-sm" onclick="removeFromCart(${index})">Remove</button></td>
    `;
    modalCartTableBody.appendChild(tr);

    totalQuantity += 1;
  });


  const checkoutButton = document.getElementById("checkoutButton");
  checkoutButton.textContent = `Checkout (${totalQuantity} items)`;
}

function removeFromCart(index) {
  selectedProducts.splice(index, 1);
  updateCartTable();
}


const memberSelect = document.getElementById("memberSelect");

fetch("../api/showmember.php")
  .then((response) => response.json())
  .then((data) => {
    memberSelect.innerHTML = '<option value="" selected>Select a member</option>';
    data.forEach((row) => {
      const option = document.createElement("option");
      option.value = row.id_member; 
      option.textContent = `${row.name_member}`; 
      memberSelect.appendChild(option);
    });
  })
  .catch((error) => {
    console.error("Error fetching member data:", error);
  });

function handleMemberSelectChange(selectElement) {
  const selectedMemberId = selectElement.value;
  if (selectedMemberId) {
    console.log("Selected Member ID:", selectedMemberId);
  }
}


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
        <td><img src="data:image/jpg;charset=utf8;base64,${row.picture}" alt="Product Image"  width="100" height="100"></td>
        <td><button type="button" class="btn btn-warning btn-rounded mb-2" onclick="addorderselect('${row.id_product}','${row.name_spare}')">add_order</button></td>
        `;
      tableBody.appendChild(tr);
    });
  });

  function checkout() {
    const id_order = document.getElementById("id_order");
    const getid_order = id_order.value;
    const memberSelect = document.getElementById("memberSelect");
    const selectedMemberId = memberSelect.value;
  
    if (!selectedMemberId &&!getid_order) {
      alert("Please select a member before checkout.");
      return;
    }
  
    const checkoutData = {
      id_order: getid_order,
      id_member: selectedMemberId,
      products: selectedProducts.map((product, index) => ({ 
        id_product: product.idProduct, 
        quantity: parseInt(document.querySelector(`input[data-index="${index}"]`).value) 
      })),
    };
  console.log(checkoutData);
 
  fetch("../api/checkout.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(checkoutData),
  })
    .then((response) => {
      console.log("Server Response:", response);
      return response.json();
    })
    .then((result) => {
      console.log("Checkout Result:", result);

    })
    .catch((error) => {
      console.error("Error during checkout:", error);
    });
  
  }
   
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
