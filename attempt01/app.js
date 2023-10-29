// Select the canvas and get its 2D context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.addEventListener('click', resetGame);
document.addEventListener('keypress', function (event) {
  if (event.code === 'Enter') {
    resetGame();
  }
});

function resetGame() {
  if (gameOver) {
    leftScore = 0;
    rightScore = 0;
    gameOver = false;
  }

  if (gamePaused) {
    resetBall();
    gamePaused = false;
  }
}

// Event listeners for key down and key up events
document.addEventListener('keydown', (e) => {
  switch (e.code) {
    case 'KeyW':
      wPressed = true;
      leftPaddleMovingUp = true;
      break;
    case 'KeyS':
      sPressed = true;
      leftPaddleMovingDown = true;
      break;
    case 'ArrowUp':
      upPressed = true;
      rightPaddleMovingUp = true;
      break;
    case 'ArrowDown':
      downPressed = true;
      rightPaddleMovingDown = true;
      break;
  }
});

document.addEventListener('keyup', (e) => {
  switch (e.code) {
    case 'KeyW':
      wPressed = false;
      leftPaddleMovingUp = false;
      break;
    case 'KeyS':
      sPressed = false;
      leftPaddleMovingDown = false;
      break;
    case 'ArrowUp':
      upPressed = false;
      rightPaddleMovingUp = false;
      break;
    case 'ArrowDown':
      downPressed = false;
      rightPaddleMovingDown = false;
      break;
  }
});

const acceleration = 0.2; // Acceleration rate
const deceleration = 0.1; // Deceleration rate when no key is pressed
const winningScore = 10;
const netWidth = 4;
const netHeight = 20;
const netGap = 15;
const paddleWidth = 10;
const paddleHeight = 100;
const leftPaddleX = 0;
const rightPaddleX = canvas.width - paddleWidth;

// left paddle
let leftPaddleSpeed = 0;
let leftPaddleMovingUp = false;
let leftPaddleMovingDown = false;
const maxLeftPaddleSpeed = 5; // Maximum speed

// right paddle
let rightPaddleSpeed = 0;
let rightPaddleMovingUp = false;
let rightPaddleMovingDown = false;
const maxrightPaddleSpeed = 5; // Maximum speed

// Initialize variables

let leftPaddleY = 250;
let rightPaddleY = 250;
let ballX = 450;
let ballY = 300;
let ballSpeedX = 5;
let ballSpeedY = 3;
let paddleSpeed = 4;
let wPressed = false;
let sPressed = false;
let upPressed = false;
let downPressed = false;
let leftScore = 0;
let rightScore = 0;
let gameOver = false;
let gamePaused = false;

function resetBall() {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX = -ballSpeedX; // Reverse direction
  ballSpeedY = 3; // Reset vertical speed
}

// Draw function
function draw() {
  if (gameOver || gamePaused) {
    if (gameOver) {
      ctx.font = '48px Arial';
      ctx.fillStyle = 'white';
      ctx.fillText('Game Over', canvas.width / 2 - 150, canvas.height / 2);
      ctx.fillText(
        'Click to Restart',
        canvas.width / 2 - 200,
        canvas.height / 2 + 50,
      );
    }

    return;
  }

  // Draw the main background
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // draw the net
  let yPosition = 0;
  while (yPosition < canvas.height) {
    ctx.fillStyle = 'white';
    ctx.fillRect(
      canvas.width / 2 - netWidth / 2,
      yPosition,
      netWidth,
      netHeight,
    );
    yPosition += netHeight + netGap;
  }

  // Draw paddles
  ctx.fillStyle = 'white';
  ctx.fillRect(0, leftPaddleY, paddleWidth, paddleHeight);
  ctx.fillRect(
    canvas.width - paddleWidth,
    rightPaddleY,
    paddleWidth,
    paddleHeight,
  );

  // Draw ball
  ctx.beginPath();
  ctx.arc(ballX, ballY, 10, 0, Math.PI * 2);
  ctx.fillStyle = 'white';
  ctx.fill();
  ctx.closePath();

  ctx.font = '48px Arial';
  ctx.fillStyle = 'white';
  ctx.fillText(leftScore, canvas.width / 4, 50);
  ctx.fillText(rightScore, (3 * canvas.width) / 4, 50);
}

// Move function
function move() {
  if (gameOver || gamePaused) {
    return;
  }

  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if (ballY < 0 || ballY > canvas.height) {
    ballSpeedY = -ballSpeedY;
  }

  if (ballX < 0 || ballX > canvas.width) {
    ballSpeedX = -ballSpeedX;
  }

  // Update leftPaddleSpeed based on keys pressed
  if (leftPaddleMovingUp && leftPaddleY > 0) {
    leftPaddleSpeed = Math.min(
      leftPaddleSpeed + acceleration,
      maxLeftPaddleSpeed,
    );
  } else if (
    leftPaddleMovingDown &&
    leftPaddleY < canvas.height - paddleHeight
  ) {
    leftPaddleSpeed = Math.min(
      leftPaddleSpeed + acceleration,
      maxLeftPaddleSpeed,
    );
  } else {
    leftPaddleSpeed = Math.max(0, leftPaddleSpeed - deceleration);
  }

  // Update leftPaddleY position based on speed and direction
  if (leftPaddleMovingUp) {
    leftPaddleY = Math.max(0, leftPaddleY - leftPaddleSpeed);
  } else if (leftPaddleMovingDown) {
    leftPaddleY = Math.min(
      canvas.height - paddleHeight,
      leftPaddleY + leftPaddleSpeed,
    );
  }

  // Update rightPaddleSpeed based on keys pressed
  if (rightPaddleMovingUp && rightPaddleY > 0) {
    rightPaddleSpeed = Math.min(
      rightPaddleSpeed + acceleration,
      maxrightPaddleSpeed,
    );
  } else if (
    rightPaddleMovingDown &&
    rightPaddleY < canvas.height - paddleHeight
  ) {
    rightPaddleSpeed = Math.min(
      rightPaddleSpeed + acceleration,
      maxrightPaddleSpeed,
    );
  } else {
    rightPaddleSpeed = Math.max(0, rightPaddleSpeed - deceleration);
  }

  // Update rightPaddleY position based on speed and direction
  if (rightPaddleMovingUp) {
    rightPaddleY = Math.max(0, rightPaddleY - rightPaddleSpeed);
  } else if (rightPaddleMovingDown) {
    rightPaddleY = Math.min(
      canvas.height - paddleHeight,
      rightPaddleY + rightPaddleSpeed,
    );
  }

  // Left paddle speed
  if (
    ballX < leftPaddleX + paddleWidth &&
    ballY > leftPaddleY &&
    ballY < leftPaddleY + paddleHeight
  ) {
    ballSpeedX = -ballSpeedX;

    // Add "spin" effect based on both paddle speed and collision point
    const deltaY = ballY - (leftPaddleY + paddleHeight / 2);
    ballSpeedY = deltaY * 0.3 + leftPaddleSpeed * 0.1;
  }

  // Right paddle collision
  if (
    ballX > rightPaddleX - paddleWidth &&
    ballY > rightPaddleY &&
    ballY < rightPaddleY + paddleHeight
  ) {
    ballSpeedX = -ballSpeedX;

    // Add "spin" effect based on both paddle speed and collision point
    const deltaY = ballY - (rightPaddleY + paddleHeight / 2);
    ballSpeedY = deltaY * 0.3 + rightPaddleSpeed * 0.1;
  }

  if (ballX < 0) {
    // Point for right player
    rightScore++;
    resetBall();
    checkWinningCondition();
    stopAndResetBall();
  } else if (ballX > canvas.width) {
    // Point for left player
    leftScore++;
    resetBall();
    checkWinningCondition();
    stopAndResetBall();
  }
}

// Function to check for winning condition
function checkWinningCondition() {
  if (leftScore === winningScore || rightScore === winningScore) {
    gameOver = true;
  }
}

// Function to stop and reset the ball to the center
function stopAndResetBall() {
  gamePaused = true;
  resetBall();
}

// Main game loop
function gameLoop() {
  draw();
  move();
  requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
