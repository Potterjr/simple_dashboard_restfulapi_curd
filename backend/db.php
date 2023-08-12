<?php



class database
{
    private $db;

    private function connectdb()
    {
        try {

            $login = 'root';
            $pass = '';
            $connect = "mysql:host=localhost;dbname=test";
            $this->db = new PDO($connect, $login, $pass);
            $this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
    }
    function __construct()
    {
        $this->connectdb();
    }
    public function login($id_member, $password)
    {
        try {
            $stmt = $this->db->prepare("SELECT id_member FROM login WHERE id_member = :id_member AND password = :password");
            $stmt->bindValue(':id_member', $id_member);
            $stmt->bindValue(':password', $password);
            $stmt->execute();
            if ($stmt->rowCount() > 0) {
                $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
                return $rows;
            } else {
                return array("status" => "error", "message" => "incorrect id or password");
            }
        } catch (PDOException $e) {
            echo "Error: " . $e->getMessage();
        }
    }
    public function showproduct()
    {
        try {
            $sql = "SELECT * FROM `product` ORDER BY id_product";
            $res = $this->db->query($sql);
            $data = $res->fetchAll(PDO::FETCH_ASSOC);

       
            foreach ($data as &$row) {
                if (isset($row['picture'])) {
                    $row['picture'] = base64_encode($row['picture']);
                }
            }
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return $data;
    }
    public function showmember()
    {
        try {
            $sql = "SELECT * FROM `member` ORDER BY id_member";
            $res = $this->db->query($sql);
            $data = $res->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return $data;
    }
    public function showreport()
    {
        try {
            $sql = "SELECT p.id_product, p.name_spare, p.name_machine, p.type, p.total AS product_total, r.total AS report_total, p.price, p.timestamp AS product_timestamp, r.timestamp AS report_timestamp
            FROM product p
            JOIN report r ON p.id_product = r.id_product
            ORDER BY p.timestamp, r.timestamp;    
            
            ";
            $res = $this->db->query($sql);
            $data = $res->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return $data;
    }

    public function showmembercount()
    {
        try {
            $sql = "SELECT COUNT(*) FROM orers;";
            $res = $this->db->query($sql);
            $data = $res->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        return $data;
    }

    public function showorders($id_order)
    {
        try {
            $sql = "SELECT * FROM orders WHERE id_order = :id_order";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':id_order', $id_order);
            $stmt->execute();
            $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if (empty($data)) {
                throw new Exception("No orders found for the provided id_order.");
            }
        } catch (PDOException $e) {
         
            throw new Exception("Database error: " . $e->getMessage());
        } catch (Exception $e) {
         
            throw new Exception("Error: " . $e->getMessage());
        }

        return $data;
    }



    public function showbyone($id)
    {
        try {
            $sql = "SELECT * FROM product WHERE id_product = :id";
            $stmt = $this->db->prepare($sql);
            $stmt->bindParam(':id', $id);
            $stmt->execute();
            $data = $stmt->fetchAll(PDO::FETCH_ASSOC);


            foreach ($data as &$row) {
                if (isset($row['picture'])) {
                    $row['picture'] = base64_encode($row['picture']);
                }
            }
        } catch (PDOException $e) {
            echo $e->getMessage();
            $data = [];
        }
        return $data;
    }

    public function adddata($id_product, $name_spare, $name_machine, $location, $total, $distribution, $price, $type, $picture)
    {
       
        $imageData = file_get_contents($picture);

        $sql = "INSERT INTO product (id_product, name_spare, name_machine, location, total,distribution, price, type, picture) 
                VALUES (:id_product, :name_spare, :name_machine, :location, :total,:distribution, :price, :type, :picture)";
        $stmt = $this->db->prepare($sql);
        try {
            $stmt->bindParam(':id_product', $id_product);
            $stmt->bindParam(':name_spare', $name_spare);
            $stmt->bindParam(':name_machine', $name_machine);
            $stmt->bindParam(':location', $location);
            $stmt->bindParam(':total', $total);
            $stmt->bindParam(':distribution', $distribution);
            $stmt->bindParam(':price', $price);
            $stmt->bindParam(':type', $type);
            $stmt->bindParam(':picture', $imageData, PDO::PARAM_LOB);

            $stmt->execute();
            return array("status" => "success");
        } catch (PDOException $e) {
            return array("status" => "error", "message" => $e->getMessage());
        }
    }
    public function addmember($id_member, $name_member, $level)
    {

        $sql = "INSERT INTO member (id_member, name_member, level) 
                VALUES (:id_member, :id_member, :level)";
        $stmt = $this->db->prepare($sql);
        try {
            $stmt->bindParam(':id_member', $id_member);
            $stmt->bindParam(':name_member', $name_member);
            $stmt->bindParam(':level', $level);


            $stmt->execute();
            return array("status" => "success");
        } catch (PDOException $e) {
            return array("status" => "error", "message" => $e->getMessage());
        }
    }
    public function addorder($id_order, $id_product, $id_member, $quantity)
    {
        $sql = "INSERT INTO orders (id_order, id_product, id_member, quantity) 
        VALUES (:id_order, :id_product, :id_member, :quantity)";
        $stmt = $this->db->prepare($sql);
        try {
            $stmt->bindParam(':id_order', $id_order);
            $stmt->bindParam(':id_product', $id_product);
            $stmt->bindParam(':id_member', $id_member);
            $stmt->bindParam(':quantity', $quantity);
            $stmt->execute();
            return array("status" => "success");
        } catch (PDOException $e) {
            return array("status" => "error", "message" => $e->getMessage());
        }
    }

    public function editproduct($data)
    {
        try {
            $stmt = $this->db->prepare("UPDATE product SET 
                name_spare = ?,
                name_machine = ?,
                type = ?,
                total = ?,
                location = ?,  
                distribution = ?,
                price = ?
                WHERE id_product = ?");

            $name_spare = $data['name_spare'];
            $name_machine = $data['name_machine'];
            $type = $data['type'];
            $total = $data['total'];
            $location = $data['location'];
            $distribution = $data['distribution'];
            $price = $data['price'];
            $id_product = $data['id_product'];
    
       
            $result = $stmt->execute([
                $name_spare,
                $name_machine,
                $type,
                $total,
                $location,
                $distribution,
                $price,
                $id_product
            ]);
    
            if ($result) {
                return array("status" => "success", "message" => "Record updated successfully");
            } else {
                return array("status" => "error", "message" => "Record update failed");
            }
        } catch (PDOException $e) {

            return array('Database error: ' . $e->getMessage());
        }
    }
    public function editmember($data)
    {
        try {
            $stmt = $this->db->prepare("UPDATE member SET 
                name_member = ?,
                level = ?
                WHERE id_member = ?");
        
            $name_member = $data['name_member'];
            $level = $data['level'];
            $id_member = $data['id_member'];
    
            $result = $stmt->execute([
                $name_member,
                $level,
                $id_member
            ]);
    
            if ($result) {
                return array("status" => "success", "message" => "Record updated successfully");
            } else {
                return array("status" => "error", "message" => "Record update failed");
            }
        } catch (PDOException $e) {
            return array('Database error: ' . $e->getMessage());
        }
    }
    

    public function update_status_product($data)
    {
        try {
            $stmt = $this->db->prepare("UPDATE orders 
            SET status = ? 
            WHERE id_order = ? AND id_product = ?");

            $result = $stmt->execute([
                $data['status'],
                $data['id_order'],
                $data['id_product'],
            ]);

            if ($result) {
                echo json_encode(['message' => 'Record updated successfully']);
            } else {
                echo json_encode(['message' => 'Record update failed']);
            }

            return $result;
        } catch (PDOException $e) {
            error_log('Database error: ' . $e->getMessage());
            header('HTTP/1.1 500 Internal Server Error');
            echo json_encode(['error' => 'Internal server error']);
        }
    }
    public function deleteproduct($id_product)
    {
        try {
            $stmt = $this->db->prepare("DELETE FROM product WHERE id_product = ?");
            $stmt->execute([$id_product]);
            return $stmt->rowCount();
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
    }
    public function deletemember($id_member)
    {
        try {
            $stmt = $this->db->prepare("DELETE FROM member WHERE id_member = ?");
            $stmt->execute([$id_member]);
            return $stmt->rowCount();
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
    }
}
