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

  fall() {
    if (this.y > canvas.height) {
      return true;
    }

    return false;
  }

  render() {
    // gravity is -0.2 or 0.05
    this.gravitySpeed += this.gravity;
    this.y += this.speedY + this.gravitySpeed;

    if (this.y < 0) {
      this.y = 0;
      this.gravitySpeed = 0;
    }

    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Obstacle {
  width = 10;
  height1 = 0;
  height2 = 0;
  x = canvas.width;
  y1 = 0
  y2 = canvas.height - this.height2;
  color = "green";
  max = 250;
  min = 100;

  // to create obstacles with proper size.
  constructor() {
    while (true) {
      this.height1 = Math.random() * canvas.height;
      this.height2 = Math.random() * canvas.height;
      this.y2 = canvas.height - this.height2;
      
      if (this.height1 + this.height2 < this.max && this.height1 + this.height2 > this.min) {
        break;
      }
    }
  }
}

class ObstacleGenerator {
  obstacles = [];
  frameNo = 0;
  ready = 0;
  
  collisionDetection(actorLeft, actorRight, actorTop, actorBottom) {
    for (var i = 0; i < this.ready; i++) {
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
    this.frameNo += 1;

    if ((this.frameNo / 150) % 1 == 0) {
      this.obstacles.push(new Obstacle());
      this.ready++;
    }

    // render it.
    for (var i = 0; i < this.ready; i++) {
      var obstacle = this.obstacles[i];
      obstacle.x += -1;
      
      ctx.fillStyle = obstacle.color;
      ctx.fillRect(obstacle.x, obstacle.y1, obstacle.width, obstacle.height1);
      ctx.fillRect(obstacle.x, obstacle.y2, obstacle.width, obstacle.height2);
    }
  }
}

class Message {
  textColor = "#000";

  render(message) {
    ctx.font = "16px Monospace";
    ctx.fillStyle = this.textColor;
    ctx.textAlign = "center";
    ctx.fillText(message, canvas.width / 2, canvas.height / 2);
  }
}

class Game {
  actor = new Actor();
  obstacleGenerator = new ObstacleGenerator();
  message = new Message();
  over = false;

  gameOver() {
    if (this.actor.y > canvas.height) {
      this.over = true;
    }
  }

  clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  render() {
    this.clearCanvas();
    this.actor.render();
    this.obstacleGenerator.render();

    if (
      this.actor.fall() 
      || this.obstacleGenerator.collisionDetection(this.actor.x, this.actor.x + this.actor.width, this.actor.y, this.actor.y + this.actor.height)
    ) {
      this.message.render("GAME OVER");
    } else {
      requestAnimationFrame(() => this.render());
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

btn.addEventListener("mousedown", (e) => game.mouseDown(e));
btn.addEventListener("mouseup", (e) => game.mouseUp(e));

game.render();
