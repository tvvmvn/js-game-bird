// canvas
var canvas = document.getElementById("myCanvas");
canvas.width = 500;
canvas.height = 300;
canvas.style["backgroundColor"] = "#f1f1f1";
var ctx = canvas.getContext("2d");

// class
class Actor {
  width = 30;
  height = 30;
  x = 100;
  y = 120;
  gravity = 0;
  color = "#0bf";

  setGravity(val) {
    this.gravity = val;
  }

  fall() {
    if (this.y > canvas.height) {
      return true;
    }

    return false;
  }

  render() {
    this.gravity += 0.1;
    // console.log(gravity);

    this.y += this.gravity;
    
    if (this.y < 0) {
      this.y = 0;
    }

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

  render() {      
    this.x--;
    
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
    ctx.font = "16px Monospace";
    ctx.fillStyle = "#000";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
    // ctx.globalCompositeOperation = "";
  }
}

class Game {
  actor = new Actor();
  score = new Score();
  gameOver = new GameOver();
  obstacles = [];
  frameNo = 0;
  inputable = true;
  timer;
  
  constructor() {
    this.timer = setInterval(() => this.actionPerformed(), 10);
  }

  clearScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  actionPerformed() {
    this.clearScreen();

    // Actor
    this.actor.render();

    if (this.actor.fall()) {
      this.gameOver.render();
      clearInterval(this.timer);
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
          this.gameOver.render();
          clearInterval(this.timer);
        }

        if (this.actor.x > obstacle.x + obstacle.width) {
          this.score.add();
          obstacle.passed = true;
        }
      }

      obstacle.render();
    }

    // Score
    this.score.render();
  }

  keyDownHandler(key) {
    if (key == ' ') {
      if (this.inputable) {
        this.actor.setGravity(-3);
        this.inputable = false;
      }
    }
  }

  keyUpHandler(key) {
    if (key == ' ') {
      this.inputable = true;
    }
  }
}

var game = new Game();

document.addEventListener("keydown", (e) => game.keyDownHandler(e.key));
document.addEventListener("keyup", (e) => game.keyUpHandler(e.key))