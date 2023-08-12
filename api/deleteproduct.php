<?php
include('../backend/db.php');
$data = new database();
$id_product= $_GET['id_product'];
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $result = $data->deleteproduct($id_product);
    echo json_encode(['message' => 'Record deleted successfully']);
}
