import dat from "dat.gui";

const canvas = document.querySelector("canvas");

if (!canvas) throw new Error("Canvas not found");

const context = canvas.getContext("2d");

if (!context) throw new Error("Context not found");

const params = {
  nBubbles: 100,
  speed: 0.5,
};

const cWidth = window.innerWidth;
const cHeight = window.innerHeight;

canvas.width = cWidth * 2;
canvas.height = cHeight * 2;
canvas.style.width = cWidth + "px";
canvas.style.height = cHeight + "px";

context.scale(2, 2);

const mousePos = { x: 0, y: 0 };

canvas.addEventListener("mousemove", (e: MouseEvent) => {
  var rect = canvas.getBoundingClientRect();
  mousePos.x = e.clientX - rect.left;
  mousePos.y = e.clientY - rect.top;
});

enum Colors {
  Red = "#E83A4E",
  Yellow = "#FFE800",
  Blue = "#3B76F5",
  Green = "#71E394",
  Pink = "#be40c1",
  Brown = "#7f431e",
  Cyan = "#19d4d7",
  Beije = "#e4e3be",
  White = "#ffffff",
}

class Bubble {
  public x: number;
  public y: number;
  private rayon: number;
  private vx: number;
  private vy: number;
  private context: CanvasRenderingContext2D;
  constructor(context: CanvasRenderingContext2D, x: number, y: number) {
    this.x = x;
    this.y = y;
    this.rayon = 5;

    this.vx = Math.random() * 4 - 2;
    this.vy = Math.random() * 4 - 2;
    this.context = context;
  }

  update() {
    this.x += this.vx * params.speed;
    this.y += this.vy * params.speed;

    if (cWidth < this.x || this.x < 0) this.vx *= -1;
    if (cHeight < this.y || this.y < 0) this.vy *= -1;
  }

  drawBubble() {
    this.context.fillStyle = Colors.White;
    this.context.lineWidth = 3;
    this.context.save();
    this.context.translate(this.x, this.y);
    this.context.beginPath();
    this.context.arc(0, 0, this.rayon, 0, Math.PI * 2);
    this.context.fill();
    this.context.closePath();
    this.context.restore();
  }
}

const generate = () => {
  const bubbles: Bubble[] = [];

  for (let i = 0; i < params.nBubbles; i++) {
    const x_ = Math.random() * cWidth;
    const y_ = Math.random() * cHeight;

    const bubble_ = new Bubble(context, x_, y_);
    bubbles.push(bubble_);
  }

  const update = () => {
    context.clearRect(0, 0, cWidth, cHeight);

    for (let i = 0; i < bubbles.length; i++) {
      const pre_ = bubbles[i];
      for (let j = 0; j < bubbles.length; j++) {
        const current_ = bubbles[j];

        context.strokeStyle = "white";
        context.save();

        // get user mouse position

        const distance_ = Math.sqrt(
          (current_.x - mousePos.x) ** 2 + (current_.y - mousePos.y) ** 2
        );
        context.strokeStyle = Colors.White;
        if (distance_ < 200) {
          context.strokeStyle = Colors.Yellow;
          context.lineWidth = 0.1;
          const alpha = 0.5 - distance_ / 400;
          context.globalAlpha = alpha;
          context.beginPath();
          context.moveTo(current_.x, current_.y);
          context.lineTo(mousePos.x, mousePos.y);
          context.stroke();
          context.strokeStyle = Colors.Yellow;
        }
        if (j >= i) {
          const distance = Math.sqrt(
            (current_.x - pre_.x) ** 2 + (current_.y - pre_.y) ** 2
          );
          if (distance < 200) {
            context.lineWidth = Math.floor(distance / 100);
            const alpha = 1 - distance / 200;
            context.globalAlpha = alpha;
            context.beginPath();
            context.moveTo(current_.x, current_.y);
            context.lineTo(pre_.x, pre_.y);
            context.stroke();
          }
        }
        context.closePath();
        context.restore();
      }
    }

    bubbles.forEach((e) => {
      e.update();
      e.drawBubble();
    });
    window.requestAnimationFrame(() => {
      update();
    });
  };

  update();
};

var gui = new dat.GUI();
var folder = gui.addFolder("Settings");
folder.add(params, "nBubbles", 1, 100, 1).onChange(generate);
folder.add(params, "speed", -10, 10, 0.1);
generate();
