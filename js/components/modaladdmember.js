class Modaladdmember extends HTMLElement {
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
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label for="id_member" class="form-label">id_member</label>
                                <input type="text" id="id_member" class="form-control" "required>
                            </div>
                        <div class="col-md-6">
                            <label for="name_member" class="form-label">name_member</label>
                            <input type="text" id="name_member" class="form-control" "required>
                        </div>
                    </div>   
                            <div class="col">
                                <label for="level" class="form-label"> level</label>
                                    <select id="level" class="form-select" required>
                                        <option value="" disabled selected>Select level</option>
                                        <option value="userorder">userorder </option>
                                        <option value="stockorder">stockorder </option>
                                </select>
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
customElements.define("modal-addmember", Modaladdmember);

function updateDataOnPage() {
    location.reload();
}


document.getElementById("formreg").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission

    // Get form values
    const id_member = document.getElementById("id_member").value;
    const name_member = document.getElementById("name_member").value;
    const level = document.getElementById("level").value;


    // Create a FormData object to store the form data
    const formData = new FormData();
    formData.append("id_member", id_member);
    formData.append("name_member", name_member);
    formData.append("level", level);

    fetch("../api/insertmember.php", {
        method: "POST",
        body: formData,
    })
        .then((response) => response.text())
        .then((data) => {
            console.log(data);

            updateDataOnPage(data);
        })
        .catch((error) => {
            console.error("Error:", error);
        });
});

