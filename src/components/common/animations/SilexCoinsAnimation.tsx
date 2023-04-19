import p5Types from "p5";
import Sketch from "react-p5";

import TerminalGrotesque from "~/assets/fonts/terminal-grotesque.ttf";
import silexLogo from "~/assets/images/silex_logo.png";

class Silex {
  p5: p5Types;
  x: number;
  y: number;
  speed: number;
  scale: number;
  rotation: number;
  rotationSpeed: number;

  constructor(p5: p5Types, x: number, y: number, scale: number, speed: number) {
    this.p5 = p5;
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.rotation = Math.random() * 3.14;
    this.scale = scale;
    this.rotationSpeed =
      (Math.random() * 0.05 + 0.02) * (Math.random() > 0.5 ? 1 : -1);
  }

  display(img: p5Types.Image) {
    this.p5.push();
    this.p5.translate(this.x, this.y);
    this.p5.rotate(this.rotation);
    this.p5.scale(this.scale);
    this.p5.image(img, 0, 0);
    this.p5.pop();
  }

  update() {
    this.y += this.speed;
    this.rotation += this.rotationSpeed;
  }
}

function easeOutBounce(x: number): number {
  const n1 = 7.5625;
  const d1 = 2.75;

  if (x < 1 / d1) {
    return n1 * x * x;
  } else if (x < 2 / d1) {
    return n1 * (x -= 1.5 / d1) * x + 0.75;
  } else if (x < 2.5 / d1) {
    return n1 * (x -= 2.25 / d1) * x + 0.9375;
  } else {
    return n1 * (x -= 2.625 / d1) * x + 0.984375;
  }
}

interface SilexCoinsAnimationProps {
  nCoins: number;
}

const silexes: Array<Silex> = [];
let silexImg: p5Types.Image;
let font: p5Types.Font;

const SilexCoinsAnimation = ({
  nCoins,
}: SilexCoinsAnimationProps): JSX.Element => {
  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(window.innerWidth, window.innerHeight).parent(
      canvasParentRef
    );

    p5.imageMode(p5.CENTER);
    p5.textAlign(p5.CENTER, p5.CENTER);
  };

  const preload = (p5: p5Types) => {
    silexImg = p5.loadImage(silexLogo);
    font = p5.loadFont(TerminalGrotesque);
  };

  const draw = (p5: p5Types) => {
    if (Math.random() < 0.06) {
      const speed = Math.random() * 10 + 2;
      const scale = p5.random(0.05, 1);

      silexes.push(
        new Silex(
          p5,
          Math.random() * p5.width,
          -(scale * silexImg.width) / 2,
          scale,
          speed
        )
      );
    }

    p5.clear();

    for (let i = silexes.length - 1; i >= 0; i--) {
      const silex = silexes[i];

      silex.update();
      silex.display(silexImg);

      if (silex.y - 250 * silex.scale > p5.height) silexes.splice(i, 1);
    }

    p5.textFont(font);
    const bounceTime = easeOutBounce(p5.constrain(p5.millis() / 2000, 0, 1));
    const fontSize = bounceTime * 300;
    p5.textSize(fontSize);
    p5.fill("#59b17f");
    p5.text(Math.floor(nCoins * bounceTime), p5.width / 2.0, p5.height / 2.0);
  };

  return (
    <Sketch
      setup={setup}
      draw={draw}
      preload={preload}
      style={{
        position: "fixed",
        pointerEvents: "none",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
    />
  );
};

export default SilexCoinsAnimation;
