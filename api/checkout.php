<?php
include('../backend/db.php');
$data = new database();

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Get the raw JSON data from the request
    $inputJSON = file_get_contents('php://input');
    $inputData = json_decode($inputJSON, true);

    // Check if the data was successfully decoded
    if ($inputData !== null) {
        // Extract data from the JSON
        $id_order = $inputData['id_order'];
        $id_member = $inputData['id_member'];
        $products = $inputData['products'];

        try {
            foreach ($products as $product) {
                $id_product = $product['id_product'];
                $quantity = $product['quantity'];

                // You may need to adjust this line based on your database structure and method
                $response = $data->addorder($id_order, $id_product, $id_member, $quantity);

                // Handle the response here if needed
            }

            echo json_encode(array("status" => "success"));
        } catch (PDOException $e) {
            echo json_encode(array("status" => "error", "message" => $e->getMessage()));
        }
    } else {
        echo json_encode(array("status" => "error", "message" => "Invalid JSON data."));
    }
} else {
    echo json_encode(array("status" => "error", "message" => "Invalid request method."));
}
?>
