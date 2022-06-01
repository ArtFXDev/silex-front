import p5Types from "p5";
import Sketch from "react-p5";

class Crown {
  p5: p5Types;
  x: number;
  y: number;
  speed: number;
  scale: number;
  rotation: number;
  rotationSpeed: number;

  constructor(p5: p5Types, x: number, y: number, speed: number) {
    this.p5 = p5;
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.rotation = Math.random() * 3.14;
    this.scale = p5.random(0.1, 2);
    this.rotationSpeed = Math.random() * 0.05 + 0.02;
  }

  display() {
    this.p5.push();
    this.p5.translate(this.x, this.y);
    this.p5.rotate(this.rotation);
    this.p5.scale(this.scale);
    this.p5.text("👑", 0, 0);
    this.p5.pop();
  }

  update() {
    this.y += this.speed;
    this.rotation += this.rotationSpeed;
  }
}

const crowns: Array<Crown> = [];

const CrownAnimation = (): JSX.Element => {
  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(window.innerWidth, window.innerHeight).parent(
      canvasParentRef
    );
  };

  const draw = (p5: p5Types) => {
    if (Math.random() < 0.07) {
      crowns.push(
        new Crown(p5, Math.random() * p5.width, -100, Math.random() * 3 + 0.5)
      );
    }

    p5.clear();

    p5.textSize(100);
    p5.textAlign(p5.CENTER, p5.CENTER);

    for (let i = crowns.length - 1; i >= 0; i--) {
      const crown: Crown = crowns[i];
      crown.update();
      crown.display();

      if (crown.y - 50 * crown.scale > p5.height) crowns.splice(i, 1);
    }
  };

  return (
    <>
      <Sketch
        setup={setup}
        draw={draw}
        style={{
          position: "fixed",
          pointerEvents: "none",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      />
    </>
  );
};

export default CrownAnimation;
