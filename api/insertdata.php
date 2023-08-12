<?php
include('../backend/db.php');
$data = new database();

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Get the data from the form
    $id_product = $_POST['id_product'];
    $name_spare = $_POST['name_spare'];
    $name_machine = $_POST['name_machine'];
    $location = $_POST['location'];
    $total = $_POST['total'];
    $price = $_POST['price'];
    $distribution = $_POST['distribution'];
    $type = $_POST['inputtype'];
    $picture = $_FILES['picture']['tmp_name']; 

    try {
        $response = $data->adddata($id_product, $name_spare, $name_machine, $location, $total,$distribution, $price, $type, $picture);
        echo json_encode($response);
    } catch (PDOException $e) {
        echo json_encode(array("status" => "error", "message" => $e->getMessage()));
    }
} else {
    echo json_encode(array("status" => "error", "message" => "Invalid request method."));
}


?>