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
  color = "#0bf";
  gravity = 0;
  jumpable = true;

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
}

class ObstacleGenerator {
  obstacles = [];
  frameNo = 0;
  
  collisionDetection(actorLeft, actorRight, actorTop, actorBottom) {
    for (var i = 0; i < this.obstacles.length; i++) {
      var obstacle = this.obstacles[i];

      if (
        obstacle.x < actorRight && obstacle.x + obstacle.width > actorLeft
        && (obstacle.y1 + obstacle.height1 > actorTop || obstacle.y2 < actorBottom)
      ) {
        return true;
      }
    }

    return false;
  }

  render() {
    // activate each obstacle and
    this.frameNo++;

    if (this.frameNo % 200 == 0) {
      this.obstacles.push(new Obstacle());
    }

    // render it.
    for (var i = 0; i < this.obstacles.length; i++) {
      var obstacle = this.obstacles[i];

      obstacle.x += -1;
      
      ctx.fillStyle = obstacle.color;
      ctx.fillRect(obstacle.x, obstacle.y1, obstacle.width, obstacle.height1);
      ctx.fillRect(obstacle.x, obstacle.y2, obstacle.width, obstacle.height2);
    }
  }
}

class Game {
  actor = new Actor();
  obstacleGenerator = new ObstacleGenerator();
  score = 0;
  timer;

  constructor() {
    this.timer = setInterval(() => this.actionPerformed(), 10);
  }

  renderOver() {
    ctx.font = "16px Monospace";
    ctx.fillStyle = "#000";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
  }

  renderScore() {
    ctx.font = "16px Monospace";
    ctx.fillStyle = "#000";
    ctx.textAlign = "center";
    ctx.fillText("score: " + this.score, canvas.width - 80, 40);
  }

  clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  actionPerformed() {
    this.clearCanvas();
    this.actor.render();
    this.obstacleGenerator.render();
    // this.renderScore();

    if (
      this.actor.fall() 
      || this.obstacleGenerator.collisionDetection(this.actor.x, this.actor.x + this.actor.width, this.actor.y, this.actor.y + this.actor.height)
    ) {
      this.renderOver();
      clearInterval(this.timer);
    } 
  }

  keyDownHandler(key) {
    if (key == ' ') {
      if (this.actor.jumpable) {
        this.actor.gravity = -3;
        this.actor.jumpable = false;
      }
    }
  }

  keyUpHandler(key) {
    if (key == ' ') {
      this.actor.jumpable = true;
    }
  }
}

var game = new Game();

document.addEventListener("keydown", (e) => game.keyDownHandler(e.key));
document.addEventListener("keyup", (e) => game.keyUpHandler(e.key))