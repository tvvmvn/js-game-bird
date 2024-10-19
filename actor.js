// canvas
var canvas = document.getElementById("myCanvas");
canvas.width = 500;
canvas.height = 400;
canvas.style.backgroundColor = "#f1f1f1";
var ctx = canvas.getContext("2d");

var gravity = 0;
var y = 100;
var jumpable = true;
var interval;

function main() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  gravity += 0.1;
  console.log(gravity);
  y += gravity;
  
  if (y < 0) {
    y = 0;
  }
  
  ctx.beginPath();
  ctx.arc(250, y, 10, 0, 2 * Math.PI);
  ctx.fill();

  if (y > canvas.height) {
    clearInterval(interval);
  }
}

interval = setInterval(main, 10);

document.addEventListener("keydown", (e) => {
  if (jumpable) {
    gravity = -4;
    jumpable = false;
  }
})

document.addEventListener("keyup", (e) => {
  jumpable = true;
})