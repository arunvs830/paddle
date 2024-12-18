<?php
include 'db.php';

$sql = "SELECT username, score FROM scores ORDER BY score DESC";
$result = $conn->query($sql);

echo "<h2>Leaderboard</h2>";
echo "<table border='1'>
<tr>
<th>Rank</th>
<th>Username</th>
<th>Score</th>
</tr>";

$rank = 1;
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        echo "<tr>
        <td>{$rank}</td>
        <td>{$row['username']}</td>
        <td>{$row['score']}</td>
        </tr>";
        $rank++;
    }
} else {
    echo "<tr><td colspan='3'>No scores available</td></tr>";
}
echo "</table>";

$conn->close();
?>
