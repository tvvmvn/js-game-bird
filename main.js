// canvas
var canvas = document.getElementById("myCanvas");
canvas.width = 500;
canvas.height = 300;
canvas.style["backgroundColor"] = "#f1f1f1";
var ctx = canvas.getContext("2d");

// class
class Intro {
  render() {
    ctx.font = "30px Monospace";
    ctx.fillStyle = "#0bf";
    ctx.textAlign = "center";
    ctx.fillText("Flappy Bird", canvas.width / 2, 130);

    ctx.font = "16px Monospace";
    ctx.fillStyle = "#000";
    ctx.textAlign = "center";
    ctx.fillText("Press any key to start", canvas.width / 2, 160);
  }
}

class Actor {
  width = 30;
  height = 30;
  x = 150;
  y = 100;
  color = "#0bf";

  fall() {
    if (this.y > canvas.height) {
      return true;
    }

    return false;
  }

  setY(gravity) {
    this.y += gravity;

    if (this.y < 0) {
      this.y = 0;
    }
  }

  render() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Obstacle {
  width = 40;
  totalHeight = 200;
  height1 = Math.random() * this.totalHeight;
  height2 = this.totalHeight - this.height1;
  x = canvas.width;
  y1 = 0
  y2 = canvas.height - this.height2;
  color = "green";
  passed = false;

  collisionDetection(actor) {
    if (
      this.x < actor.x + actor.width && this.x + this.width > actor.x
      && (this.y1 + this.height1 > actor.y || this.y2 < actor.y + actor.height)
    ) {
      return true;
    }

    return false;
  }

  setMove() {
    this.x--;
  }

  render() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y1, this.width, this.height1);
    ctx.fillRect(this.x, this.y2, this.width, this.height2);
  }
}

class Score {
  value = 0;

  add() {
    this.value++;
  }

  render() {
    ctx.font = "16px Monospace";
    ctx.fillStyle = "#000";
    ctx.textAlign = "center";
    ctx.fillText("score: " + this.value, canvas.width - 80, 40);
  }
}

class GameOver {
  render() {
    ctx.font = "20px Monospace";
    ctx.fillStyle = "#000";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER ⏩️", canvas.width / 2, canvas.height / 2);
    // ctx.globalCompositeOperation = "";
  }
}

class Game {
  intro = new Intro();
  actor = new Actor();
  score = new Score();
  gameOver = new GameOver();
  obstacles = [];
  frameNo = 0;
  gravity = 0;
  inputable = true;
  timer;
  start;
  over = false;

  constructor(start) {
    this.timer = setInterval(() => this.actionPerformed(), 10);

    this.start = start;
  }

  clearScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  actionPerformed() {
    this.clearScreen();

    // Show intro
    if (!this.start) { 
      this.intro.render();
      return;
    }

    // Actor
    this.actor.setY(this.gravity);
    this.gravity += 0.1;
    this.actor.render();

    if (this.actor.fall()) {
      var s = new Audio("sfx_die.wav");
      s.play();
      this.over = true;
    }

    // Obstacles
    this.frameNo++;

    if (this.frameNo % 200 == 0) {
      this.obstacles.push(new Obstacle());
    }

    for (var i = 0; i < this.obstacles.length; i++) {
      var obstacle = this.obstacles[i];

      if (!obstacle.passed) {
        if (obstacle.collisionDetection(this.actor)) {
          var s = new Audio("sfx_hit.wav");
          s.play();

          this.over = true;
        }

        if (this.actor.x > obstacle.x + obstacle.width) {
          this.score.add();

          var s = new Audio("sfx_point.wav");
          s.play();

          obstacle.passed = true;
        }
      }

      obstacle.render();
      obstacle.setMove();
    }

    // Score
    this.score.render();

    if (this.over) {
      clearInterval(this.timer);
      this.gameOver.render();
    }
  }

  keyDownHandler(key) {
    if (this.over) {
      game = new Game(true);
    } else {
      if (!this.start) {
        this.start = true;
      } else {
        if (key == ' ') {
          if (this.inputable) {
            var s = new Audio("sfx_wing.wav");
            s.play();

            this.gravity = -3;
            this.inputable = false;
          }
        }
      }
    }
  }

  keyUpHandler(key) {
    if (key == ' ') {
      this.inputable = true;
    }
  }
}

var game = new Game(false);
document.addEventListener("keydown", (e) => game.keyDownHandler(e.key));
document.addEventListener("keyup", (e) => game.keyUpHandler(e.key));