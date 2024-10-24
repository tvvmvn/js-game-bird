// canvas
var canvas = document.getElementById("myCanvas");
canvas.width = 500;
canvas.height = 375;
var ctx = canvas.getContext("2d");

class Background extends Image {
  constructor() {
    super();
    this.src = "bg.png";
  }

  render() {
    // drawImage(image, dx, dy, dwidth, dheight)
    ctx.drawImage(this, 0, 0, this.width, this.height, 0, 0, canvas.width, canvas.height);
  }
}

// class
class Intro extends Image {
  constructor() {
    super();
    this.src = "logo.png";
    this.width /= 3;
    this.height /= 3;
  }

  render() {
    // drawImage(image, dx, dy, dwidth, dheight)
    ctx.drawImage(this, canvas.width / 2 - (this.width / 2), canvas.height / 5, this.width, this.height);
  }
}

class Actor extends Image {
  // src  
  x = 150;
  y = 150;
  color = "#0bf";
  s = 0;
  
  constructor() {
    super();
    this.src = "flap_up.png";
  }

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
    // drawImage(image, dx, dy, dwidth, dheight)
    ctx.drawImage(this, this.x, this.y, this.width, this.height);
    
    this.s++;

    if (this.s % 10 == 0) {
      switch (this.src) {
        case location.origin + "/flap_up.png":
          this.src = location.origin + "/flap_center1.png";
          break;
        case location.origin + "/flap_center1.png":
          this.src = location.origin + "/flap_down.png";
          break;
        case location.origin + "/flap_down.png":
          this.src = location.origin + "/flap_center2.png";
          break;
        case location.origin + "/flap_center2.png":
          this.src = location.origin + "/flap_up.png";
          break;
      }
    }
  }
}

class Obstacle extends Image {
  x = canvas.width;
  y = -242 + (Math.random() * 160);
  passed = false;
  spaceHeight = 127;
  eachHeight = 286; 

  constructor() {
    super();
    this.src = "pipe.png";
  }

  collisionDetection(actor) {
    var ceiling = this.eachHeight + this.y;

    if (
      actor.x + actor.width > this.x 
      && actor.x < this.x + this.width
      && (actor.y < ceiling || actor.y + actor.height > ceiling + this.spaceHeight)
    ) {
      return true;
    }

    return false;
  }

  setMove() {
    this.x--;
  }

  render() {
    // drawImage(image, dx, dy, dwidth, dheight)
    ctx.drawImage(this, this.x, this.y, this.width, this.height);
  }
}

class Score extends Image {
  value = 0;

  add() {
    this.value++;
  }

  render() {
    ctx.font = "16px Monospace";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.fillText("Score " + this.value, canvas.width - 80, 40);
  }
}

class GameOver extends Image {
  constructor() {
    super();
    this.src = "over.png";
    this.width /= 3;
    this.height /= 3;
  }

  render() {
    // drawImage(image, dx, dy, dwidth, dheight)
    ctx.drawImage(this, canvas.width / 2 - (this.width / 2), canvas.height / 2 - (this.height / 2), this.width, this.height);
  }
}

class Game {
  bg = new Background();
  intro = new Intro();
  actor = new Actor();
  score = new Score();
  gameOver = new GameOver();
  obstacles = [];
  frameNo = 0;
  gravity = -3;
  start = false;
  over = false;
  timer;

  constructor(start) {
    this.timer = setInterval(() => this.actionPerformed(), 10);
    this.start = start;
  }

  clearScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  actionPerformed() {
    this.clearScreen();

    // Background
    this.bg.render();

    // Intro
    if (!this.start) { 
      this.intro.render();
      this.actor.render();
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

    // Game over
    if (this.over) {
      clearInterval(this.timer);
      this.gameOver.render();
    }
  }

  clickHandler(e) {
    if (this.over) {
      game = new Game(true);
    } else {
      if (!this.start) {
        this.start = true;
      } 

      var s = new Audio("sfx_wing.wav");
      s.play();

      this.gravity = -3;
    }
  }
}

var game = new Game(false);
canvas.addEventListener("mousedown", (e) => game.clickHandler(e))