class Vec { // X, Y positioning & velocity
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
}

class Rect {
  constructor(w, h) { // Width, Height
    this.pos = new Vec; // Give the Rect a position
    this.size = new Vec(w, h);
  }
}

class Ball extends Rect { // Ball inherits from the Rect class
  constructor() {
    super(10, 10); // Set size on Rect (Set size of ball)
    this.vel = new Vec // Velocity
  }
}

const canvas = document.getElementById('pong');
const context = canvas.getContext('2d');
const ball = new Ball;
ball.pos.x = 100;
ball.pos.y = 50;

// Game Board options
context.fillStyle = '#000';
context.fillRect(0, 0, canvas.width, canvas.height);

// Ball options
context.fillStyle = '#fff';
context.fillRect(ball.pos.x, ball.pos.y, ball.size.x, ball.size.y); // Ball Positioning & Sizing

