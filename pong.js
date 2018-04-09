class Vec { // Used for X, Y positioning, velocity, size
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  get speedNormalizer() { // Vector/Hypotenuse of X & Y Directions
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }
  
  set speedNormalizer(value) { // Normalize Speed func
    const factr = value / this.speedNormalizer; // factr = factor
    this.x *= factr; // Slow your roll (normalize X)
    this.y *= factr;
  }
}

class Rect {
  constructor(w, h) { // Width, Height
    this.pos = new Vec; // Give the Rect a position
    this.size = new Vec(w, h);
  }

  // Get edges
    // pong.ball.pos.x & pong.ball.pos.y are the middle of the ball
    // pong.ball.pos.x +- 1/2 size ball & pong.ball.pos.y +- 1/2 size of ball are any edges
  get left() {
    return this.pos.x - this.size.x / 2;
  }

  get right() {
    return this.pos.x + this.size.x / 2;
  }

  get top() {
    return this.pos.y - this.size.y / 2;
  }

  get bottom() {
    return this.pos.y + this.size.y / 2;
  }
}

class Ball extends Rect { // Ball inherits from the Rect class
  constructor() {
    super(10, 10); // Set size on Rect (Set size of ball)
    this.vel = new Vec // Velocity
  }
}

class Player extends Rect {
  constructor() {
    super(20, 100); // Paddle Dimensions
    this.score = 0;
  }
}

class Pong {
  constructor(canvas) {
    this._canvas = canvas;
    this._context = canvas.getContext('2d');

    this.ball = new Ball;

    this.players = [
      new Player,
      new Player
    ];

    this.players[0].pos.x = 40; // 40px from the left
    this.players[1].pos.x = this._canvas.width - 40; // 40px from the right
    this.players.forEach(player => {
      player.pos.y = this._canvas.height / 2; // Center Vertically
    });

    let lastTime; // Last Time page was loaded

    const callback = (millis) => { // Milliseconds coming from animation frame; Converted to Arrow func because arrow funcs do not bind their own 'this', instead it's lexical
      if (lastTime) {
        this.update((millis - lastTime) / 1000); // Calc how much time has elapsed & convert to whole seconds 
      }
      lastTime = millis;
      requestAnimationFrame(callback); // Request Animation Frame calls callback once, so we use recursion here
    };
    callback();

    // Pixel Size of Chars
    this.CHAR_SIZE = 10;

    // Digital Clock-style number Matrices
    this.CHARS = [
      '111101101101111',
      '010010010010010',
      '111001111100111',
      '111001111001111',
      '101101111001001',
      '111100111001111',
      '111100111101111',
      '111001001001001',
      '111101111101111',
      '111101111001111'
    ].map(diagram => {
      // Create Canvas, Set Dimensions, Context, Fill
      const canvas = document.createElement('canvas');
      canvas.width = this.CHAR_SIZE * 3;
      canvas.height = this.CHAR_SIZE * 5;
      const context = canvas.getContext('2d');
      context.fillStyle = '#fff';

      // Paint Diagram sections
      diagram.split('').forEach((fill, i) => {
        if(fill === '1') {
          context.fillRect(
            (i % 3) * this.CHAR_SIZE, // Left (Top) of Rect, X axis; % operator to figure for 3 width
            (i / 3 | 0) * this.CHAR_SIZE, // Top (Left) of Rect, Y axis; | operator will floor the float number
            this.CHAR_SIZE, // Width
            this.CHAR_SIZE // Height
          );
        }
      });
      return canvas;
    });

    // Digital Clock-style number structure example:
    // '111' Dimensions: 3 column width, 5 column height
    // '101' Imagine that the 1's are edges/lines and the 0's are empty space
    // '101' this diagram/matrix would spell out 0 (like a digital clock)
    // '101'
    // '111' Edge X coordinates are calculated: CHAR_SIZE * ColumnNumber (Resulting in 0, 10, or 20)

    this.reset(); // Sets the ball for game start
  }

  drawRect(rect) {
    this._context.fillStyle = '#fff';
    this._context.fillRect(
      rect.left, rect.top, // Fill
      rect.size.x, rect.size.y
    );
  }

  pause() {
    this.ball.vel.x = 0
    this.ball.vel.y = 0
  };

  reset() {
    this.ball.pos.x = this._canvas.width / 2;
    this.ball.pos.y = this._canvas.height / 2;
    this.ball.vel.x = 0;
    this.ball.vel.y = 0;
  };

  start() {
    if(this.ball.vel.x === 0 && this.ball.vel.y === 0) {
      // Direction & Speed Randomize
      this.ball.vel.x = 300 * (Math.random() > .5 ? 1 : -1); // 50/50 direction & speed on X axis, -300 or 300 = 2 X directions (Left & Right)
      this.ball.vel.y = 300 * (Math.random() * 2 - 1); // Y axis direction & speed, -300 to 300 = 600 Y directions (Up/Down Combinations) (Not counting float combinations)
      // Speed Normalize
      this.ball.vel.speedNormalizer = 200; // Normalize Speed (or Length traveled per duration (Rate)) (Length is calc'd via speedNormalizer getter); Integer passed is a speed to Normalize to
    }
  }

  draw() {
    // Game Board options
    this._context.fillStyle = '#000';
    this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);

    this.drawRect(this.ball);
    this.players.forEach(player => this.drawRect(player));

    this.drawScore();
  }

  collide(player, ball) { // Paddle Collision
    if (player.left < ball.right && player.right > ball.left && player.top < ball.bottom && player.bottom > ball.top) {
      ball.vel.x = -ball.vel.x;
      const speedNormalizer = ball.vel.speedNormalizer;
      ball.vel.y += 300 * (Math.random() - .4);
      ball.vel.speedNormalizer = speedNormalizer * 1.05; // Speed by 5%
    }
  }


  update(dt) { // Delta Time; Function to Redraw Pong
    this.ball.pos.x += this.ball.vel.x * dt;
    this.ball.pos.y += this.ball.vel.y * dt;

    // Detect if Ball touches bounds of Canvas
    if (this.ball.left < 0 || this.ball.right > this._canvas.width) {
      const playerId = this.ball.vel.x < 0 | 0; // Results in integer 0 or 1; True is 1, 0 is false
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators#.7c_%28Bitwise_OR%29
      this.players[playerId].score++
      this.reset();
    }

    if (this.ball.top < 0 || this.ball.bottom > this._canvas.height) {
      this.ball.vel.y = -this.ball.vel.y; // Velocity inversion
    }

    this.players[1].pos.y = this.ball.pos.y; // AI follows ball perfectly

    this.players.forEach(player => this.collide(player, this.ball)); // Check collision

    this.draw();
  }
}

// Run Flow:
// Create Board & Ball, Set options (pos, vel, size), callback called manually once, callback runs recursively

const canvas = document.getElementById('pong');
const pong = new Pong(canvas);

canvas.addEventListener('mousemove', enter => {
  const scale = event.offsetY / event.target.getBoundingClientRect().height;
  pong.players[0].pos.y = canvas.height * scale;
});

canvas.addEventListener('click', enter => {
  pong.start();
});