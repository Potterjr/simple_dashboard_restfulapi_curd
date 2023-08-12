<?php
include('../backend/db.php');
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $data = new database();
    $id_order = $_GET['id_order']; 
    echo json_encode($data->showorders($id_order));
}
