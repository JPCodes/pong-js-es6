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
    return this.pos.y + this.size.x / 2;
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

    this.ball.pos.x = 100;
    this.ball.pos.y = 50;

    this.ball.vel.x = 100;
    this.ball.vel.y = 100;

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

    const callback = (millis) => { // Milliseconds coming from animation frame; Converted to Arrow func because arrow funcs do not bind their on 'this', instead it's lexical
      if (lastTime) {
        this.update((millis - lastTime) / 1000); // Calc how much time has elapsed & convert to whole seconds 
      }
      lastTime = millis;
      requestAnimationFrame(callback); // Request Animation Frame calls callback once, so we use recursion here
    };
    callback();
  }

  drawRect(rect) {
    this._context.fillStyle = '#fff';
    this._context.fillRect(
      rect.left, rect.top, // Fill from center out
      rect.size.x, rect.size.y
    );
  }

  pause() {
    this.ball.vel.x = 0
    this.ball.vel.y = 0
  };

  reset() {
    this.ball.pos.x = 10
    this.ball.pos.y = 20
    this.ball.vel.x = 0
    this.ball.vel.y = 0
  };

  draw() {
    // Game Board options
    this._context.fillStyle = '#000';
    this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);

    this.drawRect(this.ball);
    this.players.forEach(player => this.drawRect(player));
  }

  collide(player, ball) {
    if (player.left < ball.right && player.right > ball.left && player.top < ball.bottom && player.bottom > ball.top) {
      ball.vel.x = -ball.vel.x;
    }
  }


  update(dt) { // Delta Time; Function to Redraw Pong
    this.ball.pos.x += this.ball.vel.x * dt;
    this.ball.pos.y += this.ball.vel.y * dt;

    // Detect if Ball touches bounds of Canvas
    if (this.ball.left < 0 || this.ball.right > this._canvas.width) {
      const playerId = this.ball.vel.x < 0 | 0; // Results in integer 0 or 1
      this.players[playerId].score++
      this.reset();
    }

    if (this.ball.top < 0 || this.ball.bottom > this._canvas.height) {
      this.ball.vel.y = -this.ball.vel.y; // Velocity inversion
    }

    this.players[1].pos.y = this.ball.pos.y; // AI follows ball perfectly

    this.players.forEach(player => this.collide(player, this.ball));

    this.draw();
  }
}

// Run Flow:
// Create Board & Ball, Set options (pos, vel, size), callback called manually once, callback runs recursively

const canvas = document.getElementById('pong');
const pong = new Pong(canvas);

canvas.addEventListener('mousemove', enter => {
  pong.players[0].pos.y = event.offsetY;
});