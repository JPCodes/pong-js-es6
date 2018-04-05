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

class Pong {
  constructor(canvas) {
    this._canvas = canvas;
    this._context = canvas.getContext('2d');

    this.ball = new Ball;

    this.ball.pos.x = 100;
    this.ball.pos.y = 50;

    this.ball.vel.x = 100;
    this.ball.vel.y = 100;

    let lastTime; // Last Time page was loaded

    const callback = (millis) => { // Milliseconds coming from animation frame; Converted to Arrow func because arrow funcs do not bind their on 'this', instead it's lexical
      if (lastTime) {
        this.update((millis - lastTime) / 1000); // Calc how much time has elapsed & convert to whole seconds 
      }
      lastTime = millis;
      requestAnimationFrame(callback); // Request Animation Frame calls callback once, so we use recursion here
    };
    callback();
  }

  drawBall(rect) {
    // Ball options
    this._context.fillStyle = '#fff';
    this._context.fillRect(rect.pos.x, rect.pos.y, rect.size.x, rect.size.y); // Ball Positioning & Sizing
  }

  draw() {
    // Game Board options
    this._context.fillStyle = '#000';
    this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);

    this.drawBall(this.ball)
  }

  update(dt) { // Delta Time; Function to Redraw Pong
    this.ball.pos.x += this.ball.vel.x * dt;
    this.ball.pos.y += this.ball.vel.y * dt;

    // Detect if Ball touches bounds of Canvas
    if (this.ball.left < 0 || this.ball.right > this._canvas.width) {
      this.ball.vel.x = -this.ball.vel.x; // Velocity inversion
    }

    if (this.ball.top < 0 || this.ball.bottom > this._canvas.height) {
      this.ball.vel.y = -this.ball.vel.y; // Velocity inversion
    }

    this.draw();
  }
}

// Run Flow:
// Create Board & Ball, Set options (pos, vel, size), callback called manually once, callback runs recursively

const canvas = document.getElementById('pong');
const pong = new Pong(canvas);