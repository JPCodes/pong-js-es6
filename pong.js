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

  // Get edges
  get left() {
    // return this.pos.x - this.size.x / 2; // Ex: 10 - 10 / 2 == 5
    return this.pos.x;
  }

  get right() {
    // return this.pos.x + this.size.x / 2; // Ex: 10 - 10 / 2 == 15
    return this.pos.x + this.size.x;
  }

  get top() {
    // return this.pos.y - this.size.y / 2; // Ex: 20 - 10 / 2 == 15
    return this.pos.y;
  }

  get bottom() {
    // return this.pos.y + this.size.y / 2; // Ex: 20 - 10 / 2 == 25
    return this.pos.y + this.size.y;
  }
}

class Ball extends Rect { // Ball inherits from the Rect class
  constructor() {
    super(10, 10); // Set size on Rect (Set size of ball)
    this.vel = new Vec // Velocity
  }

  get pause() {
    ball.vel.x = 0
    ball.vel.y = 0
  };

  get reset() {
    ball.pos.x = 10
    ball.pos.y = 20
    ball.vel.x = 0
    ball.vel.y = 0
  };
}

const canvas = document.getElementById('pong');
const context = canvas.getContext('2d');
const ball = new Ball;

ball.pos.x = 100;
ball.pos.y = 50;

ball.vel.x = 100;
ball.vel.y = 100;

let lastTime; // Last Time page was loaded

function callback(millis) { // Milliseconds coming from animation frame
  if (lastTime) {
    update((millis - lastTime) / 1000); // Calc how much time has elapsed & convert to whole seconds 
  }
  lastTime = millis;
  requestAnimationFrame(callback); // Request Animation Frame calls callback once, so we use recursion here
}

function update(dt) { // Delta Time; Function to Redraw Pong
  ball.pos.x += ball.vel.x * dt;
  ball.pos.y += ball.vel.y * dt;

  // Detect if Ball touches bounds of Canvas
  if (ball.pos.x < 0 || ball.pos.x > canvas.width-ball.size.x) {
    ball.vel.x = -ball.vel.x; // Velocity inversion
  }

  if (ball.pos.y < 0 || ball.pos.y > canvas.height-ball.size.y) {
    ball.vel.y = -ball.vel.y; // Velocity inversion
  }

  // Game Board options
  context.fillStyle = '#000';
  context.fillRect(0, 0, canvas.width, canvas.height);
  
  // Ball options
  context.fillStyle = '#fff';
  context.fillRect(ball.pos.x, ball.pos.y, ball.size.x, ball.size.y); // Ball Positioning & Sizing
}

callback();

// Run Flow:
// Create Board & Ball, Set options (pos, vel, size), callback called manually once, callback runs recursively