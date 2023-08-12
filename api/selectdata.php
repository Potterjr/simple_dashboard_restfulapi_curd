<?php

include('../backend/db.php');
$id = $_GET['id_product'];

// Check if the request method is GET
if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    $data = new database();

    $result = $data->showbyone($id);

     json_encode($result);
    
    if (!empty($result)) {
        echo'<center>';
        echo '<table border="1">';
        echo '<tr>
        <th>id_product</th>
        <th>name_spare</th>
        <th>name_machine</th>
        <th>type</th>
        <th>total</th>
        <th>price</th>
        <th>picture</th>
        </tr>';
        foreach ($result as $row) {
            echo '<tr>';
            echo '<td>' . $row['id_product'] . '</td>';
            echo '<td>' . $row['name_spare'] . '</td>';
            echo '<td>' . $row['name_machine'] . '</td>';
            echo '<td>' . $row['type'] . '</td>';
            echo '<td>' . $row['total'] . '</td>';
            echo '<td>' . $row['price'] . '</td>';
            echo '<td><img src="data:image/jpeg;base64,' . $row['picture'] . '" alt="Product Image" width="100"></td>';
            echo '</tr>';
        }

        echo '</table>';
    } else {
        echo 'No data found.';
    }
    
  
}

?>
