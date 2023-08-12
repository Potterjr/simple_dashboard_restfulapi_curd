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
      const totalValue = parseFloat(row.total);
      const totalCellHtml = totalValue < 30 ? `<td style="color: red;">${row.total}</td>` : `<td>${row.total}</td>`;
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${row.id_product}</td>
        <td>${row.name_spare}</td>
        <td>${row.name_machine}</td>
        <td>${row.type}</td> 
        <td>${row.total}</td>
        <td>${row.location}</td>
        <td>${row.price}</td>
        <td><img src="data:image/jpg;charset=utf8;base64,${row.picture}" alt="Product Image"  width="100" height="100"></td>
        <td><button type="button" class="btn btn-warning btn-rounded mb-2" onclick="addorderselect('${row.id_product}','${row.name_spare}')">เพิ่มสินค้า</button></td>
        `;
      tableBody.appendChild(tr);
    });
  });

  function binaryToBlob(binaryArray) {
    return new Blob([binaryArray], { type: 'image/png' });
  }
  
  function base64ToBinary(base64String) {
    var binaryString = atob(base64String.split(',')[1]);
    var byteArray = new Uint8Array(binaryString.length);
    for (var i = 0; i < binaryString.length; i++) {
      byteArray[i] = binaryString.charCodeAt(i);
    }
    return byteArray;
  }
  function createDownloadURL(blob) {
    return URL.createObjectURL(blob);
  }

  function checkout() {
    const id_order = document.getElementById("id_order");
    const getid_order = id_order.value;
    const memberSelect = document.getElementById("memberSelect");
    const selectedMemberId = memberSelect.value;
    
    if (!selectedMemberId && !getid_order) {
        alert("Please select a member before checkout.");
        return;
    }
    
    const checkoutData = {
        id_order: getid_order,
        id_member: selectedMemberId,
        products: selectedProducts.map((product, index) => {
            const quantityInput = document.querySelector(`input[data-index="${index}"]`);
            const quantity = parseInt(quantityInput.value);
            const productRow = tableBody.querySelector(`tr:nth-child(${index + 1})`);
            const type = productRow.querySelector("td:nth-child(4)").textContent;
            const total = productRow.querySelector("td:nth-child(5)").textContent;
            const location = productRow.querySelector("td:nth-child(6)").textContent;
            const price = productRow.querySelector("td:nth-child(7)").textContent;
            const pictureBase64 = productRow.querySelector("img").src; 
            
            const binaryData = base64ToBinary(pictureBase64);
            const pictureBlob = binaryToBlob(binaryData);
    
            return {
                id_product: product.idProduct,
                name_spare: product.name_spare,
                type: type,
                quantity: quantity,
                total: total,
                location: location,
                price: price,
                picture: {
                  blob: pictureBlob,
                  url: createDownloadURL(pictureBlob) 
              },
            };
        }),
    };
    
    console.log(checkoutData);
  
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Product ID,name_spare,type,quantity,total,location,price,picture\n";
  
    checkoutData.products.forEach((product) => {
        csvContent += `${product.id_product},${product.name_spare},${product.type},${product.quantity},${product.total},${product.location},${product.price},${product.picture}\n`;
    });
  

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "checkout.csv");
    document.body.appendChild(link); 
    link.click();
    document.body.removeChild(link); 
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
