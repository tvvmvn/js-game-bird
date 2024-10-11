(function() {
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
    constructor() {
      this.width = 10;
      this.height1 = Math.random() * canvas.height;
      this.height2 = Math.random() * canvas.height;
      this.x = canvas.width;
      this.y1 = 0
      this.y2 = canvas.height - this.height2;
      this.color = "green";
      this.max = 250;
      this.min = 100;

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
        this.x < actor.x + actor.width && this.x + this.width > actor.x 
        && (this.y1 + this.height1 > actor.y || this.y2 < actor.y + actor.height)
      ) {
        clearInterval(interval);
      } 

      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y1, this.width, this.height1);
      ctx.fillRect(this.x, this.y2, this.width, this.height2);
    }
  }

  class Game {
    constructor(actor, obstacle) {}

    gameOver() {
      if (this.actor.collision) {
        // over
        clearInterval(interval);
      }
    }
  }
  
  // vars
  var actor = new Actor();
  var obstacles = [];
  var frameNo = 0;
  var ready = 0;
  
  // run
  function main() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // activate each obstacle and
    frameNo += 1;

    if ((frameNo / 150) % 1 == 0) {
      obstacles.push(new Obstacle());
      ready++;
    }

    // render it.
    for (var i = 0; i < ready; i++) {
      obstacles[i].render();
    }

    actor.render();
  };

  var interval = setInterval(main, 20);

  // control
  btn.addEventListener("mousedown", () => {
    console.log("mousedown")
    actor.gravity = -0.2;
  });

  btn.addEventListener("mouseup", () => {
    console.log("mouseup")
    actor.gravity = 0.05;
  });
})();  
