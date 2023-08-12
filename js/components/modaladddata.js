class Modaladd extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <div class="modal fade" id="modalRegisterForm" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
      aria-hidden="true">
      <!-- Modal content -->
      <div class="modal-dialog modal-xl" role="document">
          <div class="modal-content">
              <div class="modal-header">
                  <h4 class="modal-title w-100">Register</h4>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                  </button>
              </div>
              <div class="modal-body">
                  <form method="post" id="formreg" enctype="multipart/form-data">
                 
                      <div class="mb-3">
                          <label for="id_product" class="form-label">id_product</label>
                          <input type="text" id="id_product" class="form-control" required>
                      </div>

                      <div class="mb-3">
                          <label for="name_spare" class="form-label">name_spare</label>
                          <input type="text" id="name_spare" class="form-control" required>
                      </div>

                      <div class="mb-3">
                          <label for="name_machine" class="form-label">name_machine</label>
                          <input type="text" id="name_machine" class="form-control" required>

                      </div>
                      <div class="mb-3">
                      <label for="total" class="form-label">total</label>
                      <input type="number" id="total" class="form-control" required>
                  </div>
                  <div class="col-md-6">
                  <label for="distribution" class="form-label">distribution</label>
                  <input type="text" id="distribution" class="form-control" required>
              </div>

                      <div class="row mb-3">
                          <div class="col-md-6">
                              <label for="location" class="form-label">location</label>
                              <input type="text" id="location" class="form-control" required>
                          </div>

                          <div class="col-md-6">
                              <label for="price" class="form-label">price</label>
                              <input type="number" id="price" class="form-control" required>
                          </div>
                      </div>
                      <div class="row mb-3">
                          <div class="col-md-6">
                              <label for="picture" class="form-label">picture</label>
                              <input type="file" id="picture" class="form-control" accept=".jpg, .jpeg"
                                  required>
                          </div>
                          <div class="col-md-6">
                              <label for="inputtype" class="form-label"> type</label>
                              <select id="inputtype" class="form-select" required>
                                  <option value="" disabled selected>Select type</option>
                                  <option value="1">1 </option>
                                  <option value="2">2 </option>

                              </select>
                          </div>
                      </div>

                      <div class="text-center">
                          <button type="submit" name="formreg_submit" class="btn btn-register">Register </button>
                      </div>
                  </form>
              </div>
          </div>
      </div>
  </div>

  <!-- Button to launch the registration form -->
  <div class="text-left">
      <button type="button" class="btn btn-register btn-rounded mb-4" data-toggle="modal"
          data-target="#modalRegisterForm" >AddData</button>
  </div>

      `;
  }
}
customElements.define("modal-adddata", Modaladd);

function updateDataOnPage() {
location.reload();
  }


document.getElementById("formreg").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission
  
    // Get form values
    const id_product = document.getElementById("id_product").value;
    const name_spare = document.getElementById("name_spare").value;
    const name_machine = document.getElementById("name_machine").value;
    const location = document.getElementById("location").value;
    const total = document.getElementById("total").value;
    const price = document.getElementById("price").value;
    const distribution = document.getElementById("distribution").value;
    const picture = document.getElementById("picture").files[0];
    const inputtype = document.getElementById("inputtype").value;
  
    // Create a FormData object to store the form data
    const formData = new FormData();
    formData.append("id_product", id_product);
    formData.append("name_spare", name_spare);
    formData.append("name_machine", name_machine);
    formData.append("location", location);
    formData.append("distribution", distribution);
    formData.append("total", total);
    formData.append("price", price);
    formData.append("picture", picture);
    formData.append("inputtype", inputtype);
  
    fetch("../api/insertdata.php", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.text())
      .then((data) => {
        console.log(data);
  
        // Update the data on the page after successful submission
        updateDataOnPage(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });

