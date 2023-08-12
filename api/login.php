<?php 
include('../backend/db.php');
$data = new database();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
 
    if (isset($_POST['id_member']) && isset($_POST['password'])) {
        $result = $data->login($_POST['id_member'], $_POST['password']);
            $user_data = $result[0];
            echo json_encode($user_data);
    }

}
