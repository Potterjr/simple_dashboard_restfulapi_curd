<?php
include('../backend/db.php');
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $data = new database();
    echo json_encode($data->showmembercount());
}
else{
    echo json_encode("error");
}