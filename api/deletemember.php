<?php
include('../backend/db.php');
$data = new database();
$id_member= $_GET['id_member'];
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $result = $data->deletemember($id_member);
    echo json_encode(['message' => 'Record deleted successfully']);
}
