<?php
header('Content-Type: application/json');

// Database configuration
$db_host = 'localhost';
$db_user = 'your_username';
$db_pass = 'your_password';
$db_name = 'your_database';

// Connect to database
try {
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name", $db_user, $db_pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die(json_encode(['error' => 'Connection failed: ' . $e->getMessage()]));
}

// Get search query
$query = isset($_GET['query']) ? trim($_GET['query']) : '';
$suggestions = isset($_GET['suggestions']) ? $_GET['suggestions'] === 'true' : false;

if (empty($query)) {
    echo json_encode([]);
    exit;
}

try {
    if ($suggestions) {
        // Get suggestions (product names that match the query)
        $stmt = $pdo->prepare("
            SELECT DISTINCT name 
            FROM products 
            WHERE name LIKE :query 
            LIMIT 5
        ");
        $stmt->execute(['query' => "%$query%"]);
        $results = $stmt->fetchAll(PDO::FETCH_COLUMN);
    } else {
        // Get full product details
        $stmt = $pdo->prepare("
            SELECT id, name, price, description 
            FROM products 
            WHERE name LIKE :query 
            OR description LIKE :query
            LIMIT 10
        ");
        $stmt->execute(['query' => "%$query%"]);
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    echo json_encode($results);
} catch(PDOException $e) {
    echo json_encode(['error' => 'Query failed: ' . $e->getMessage()]);
}
?> 