<?php
include('../backend/db.php');
$data = new database();

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $id_member = $_POST['id_member'];
    $name_member = $_POST['name_member'];
    $level = $_POST['level'];


    try {
        $response = $data->addmember($id_member, $name_member, $level);
        echo json_encode($response);
    } catch (PDOException $e) {
        echo json_encode(array("status" => "error", "message" => $e->getMessage()));
    }
} else {
    echo json_encode(array("status" => "error", "message" => "Invalid request method."));
}


?>