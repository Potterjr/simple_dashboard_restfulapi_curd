<?php

include('../backend/db.php');
$data = new database();

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $result = $data->editproduct(json_decode(file_get_contents("php://input"), true));
    echo json_encode($result);
}
