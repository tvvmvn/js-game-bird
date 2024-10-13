(function () {
  // canvas
  var canvas = document.getElementById("myCanvas");
  canvas.width = 500;
  canvas.height = 300;
  var ctx = canvas.getContext("2d");

  // class
  class Actor {
    constructor() {
      this.width = 30;
      this.height = 30;
      this.x = 100;
      this.y = 120;
      this.speedY = 0;
      this.color = "#0bf";
      this.gravity = 0.05;
      this.gravitySpeed = 0;
    }

    render() {
      // gravity is -0.2 or 0.05
      this.gravitySpeed += this.gravity;
      this.y += this.speedY + this.gravitySpeed;

      if (this.y < 0) {
        this.y = 0;
        this.gravitySpeed = 0;
      }

      if (this.y > canvas.height) {
        clearInterval(interval);
      }

      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }

  class Obstacle {
    constructor(actor) {
      this.width = 10;
      this.height1 = Math.random() * canvas.height;
      this.height2 = Math.random() * canvas.height;
      this.x = canvas.width;
      this.y1 = 0
      this.y2 = canvas.height - this.height2;
      this.color = "green";
      this.max = 250;
      this.min = 100;
      this.actor = actor;

      // to create obstacles with proper size.
      while (this.height1 + this.height2 > this.max || this.height1 + this.height2 < this.min) {
        this.height1 = Math.random() * canvas.height;
        this.height2 = Math.random() * canvas.height;
        this.y2 = canvas.height - this.height2;
      }
    }

    render() {
      this.x += -1;

      // collision 
      if (
        this.x < this.actor.x + this.actor.width && this.x + this.width > this.actor.x
        && (this.y1 + this.height1 > this.actor.y || this.y2 < this.actor.y + this.actor.height)
      ) {
        // clearInterval(interval);
      }

      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y1, this.width, this.height1);
      ctx.fillRect(this.x, this.y2, this.width, this.height2);
    }
  }

  class Game {
    constructor() {
      this.actor = new Actor();
      this.obstacles = [];
      this.frameNo = 0;
      this.ready = 0;
      this.over = false;
    }

    gameOver() {
      if (this.actor.y > canvas.height) {
        this.over = true;
      }
    }

    render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // activate each obstacle and
      this.frameNo += 1;

      if ((this.frameNo / 150) % 1 == 0) {
        this.obstacles.push(new Obstacle(this.actor));
        this.ready++;
      }

      // render it.
      for (var i = 0; i < this.ready; i++) {
        this.obstacles[i].render();
      }

      this.actor.render();

      if (!this.over) {
        requestAnimationFrame(this.render);
      }
    }

    mouseDown() {
      this.actor.gravity = -0.2;
    }

    mouseUp() {
      this.actor.gravity = 0.05;
    }
  }

  var game = new Game();

  btn.addEventListener("mousedown", game.mouseDown);
  btn.addEventListener("mouseup", game.mouseUp);
  game.render();
})();

