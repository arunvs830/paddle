<?php
$host = 'localhost'; // or your host
$user = 'root'; // your database username
$password = ''; // your database password
$dbname = 'leaderboard';

$conn = new mysqli($host, $user, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
