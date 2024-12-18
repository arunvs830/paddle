const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth * 0.8; // Responsive width
canvas.height = window.innerHeight * 0.6; // Responsive height

// Paddle settings
const paddleWidth = 100; // Paddle width
const paddleHeight = 15; // Paddle height
const paddleSpeed = 14; // Paddle speed

// Ball settings
const ballSize = 20; // Ball size
let ballSpeedX = 5; // Ball horizontal speed
let ballSpeedY = -5; // Ball vertical speed (start moving upwards)

// Paddle position (at the bottom)
const playerPaddle = { x: (canvas.width - paddleWidth) / 2, y: canvas.height - paddleHeight - 10 };

// Block settings
const blockWidth = 75; // Block width
const blockHeight = 20; // Block height
const blocks = []; // Array to hold blocks
const rows = 5; // Number of rows of blocks
const cols = Math.floor(canvas.width / blockWidth); // Number of columns based on screen width

// Initialize blocks
for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
        blocks.push({ x: c * blockWidth, y: r * blockHeight, status: 1 }); // status 1 means visible
    }
}

// Ball position
let ball = { x: canvas.width / 2 - ballSize / 2, y: canvas.height / 2 - ballSize / 2 };

// Control paddles with keyboard events
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' && playerPaddle.x > 0) {
        playerPaddle.x -= paddleSpeed;
    }
    if (event.key === 'ArrowRight' && playerPaddle.x + paddleWidth < canvas.width) {
        playerPaddle.x += paddleSpeed;
    }
});

// Control paddles with touch events
canvas.addEventListener('touchstart', handleTouchStart);
canvas.addEventListener('touchmove', handleTouchMove);

function handleTouchStart(e) {
    e.preventDefault();
}

function handleTouchMove(e) {
    const touchX = e.touches[0].clientX - canvas.getBoundingClientRect().left;

    if (touchX > playerPaddle.x + paddleWidth / 2 && playerPaddle.x + paddleWidth < canvas.width) {
        playerPaddle.x += paddleSpeed;
    } else if (touchX < playerPaddle.x + paddleWidth / 2 && playerPaddle.x > 0) {
        playerPaddle.x -= paddleSpeed;
    }
}

// Game loop
function gameLoop() {
    ball.x += ballSpeedX;
    ball.y += ballSpeedY;

    // Ball collision with top wall
    if (ball.y <= 0) {
        ballSpeedY *= -1; // Reverse direction
    }

   // Ball collision with player's paddle
   if (
       (ball.x + ballSize >= playerPaddle.x && 
       ball.x <= playerPaddle.x + paddleWidth && 
       ball.y + ballSize >= playerPaddle.y)
   ) {
       ballSpeedY *= -1; // Reverse direction
       // Adjust ball position to prevent sticking to the paddle
       ball.y = playerPaddle.y - ballSize; 
   }

   // Check for collision with blocks
   for (let i = 0; i < blocks.length; i++) {
       const block = blocks[i];
       if (block.status === 1) { // Only check visible blocks
           if (
               ball.x + ballSize >= block.x &&
               ball.x <= block.x + blockWidth &&
               ball.y + ballSize >= block.y &&
               ball.y <= block.y + blockHeight
           ) {
               ballSpeedY *= -1; // Reverse direction on collision with block
               block.status = 0; // Mark block as destroyed
           }
       }
   }

   // Reset ball if it goes out of bounds (when it misses the player's paddle)
   if (ball.y >= canvas.height) {
       resetBall();
       document.getElementById('score').value = Math.floor(Math.random() * 100); // Example score generation
       document.getElementById('scoreForm').style.display = 'block'; // Show score submission form
   }

   // Clear the canvas and draw everything
   ctx.clearRect(0, 0, canvas.width, canvas.height);
    
   ctx.fillStyle = 'white';
   ctx.fillRect(playerPaddle.x, playerPaddle.y, paddleWidth, paddleHeight);
    
   ctx.fillStyle = 'red'; // Color for blocks
   for (let i = 0; i < blocks.length; i++) {
       const block = blocks[i];
       if (block.status === 1) { // Only draw visible blocks
           ctx.fillRect(block.x, block.y, blockWidth, blockHeight);
       }
   }

   ctx.fillStyle = 'white'; // Color for the ball
   ctx.fillRect(ball.x, ball.y, ballSize, ballSize);

   requestAnimationFrame(gameLoop);
}

// Reset the ball to the center of the canvas
function resetBall() {
   ball.x = canvas.width / 2 - ballSize / 2;
   ball.y = canvas.height / 2 - ballSize / 2;
   ballSpeedX *= Math.random() > 0.5 ? -.5 : 1; // Randomize initial horizontal direction
   ballSpeedY *= -1; // Always start moving upwards after reset
}

// Start the game loop
gameLoop();
