/* eslint-disable camelcase */
import FlappyFont from "assets/fonts/flappy-font.ttf";
import SilexCoinIcon from "assets/images/silex_logo.png";
import axios from "axios";
import { useAuth } from "context";
import p5 from "p5";
import { useEffect } from "react";
import Sketch from "react-p5";
import { GameScore, GameVariant } from "types/entities/Game";
import { easeInSine, easeOutExpo, easeOutQuint } from "utils/easings";
import { changePersonSilexCoins } from "utils/zou";
import * as Zou from "utils/zou";
const SPRITES_CONTEXT = require.context(
  "assets/images/arcade/games/flappy",
  true
);

const COLORS = {
  orange: "#e6611d",
  orangeLight: "#e48453",
  titleBorder: "#4c3c46",
  menuBackground: "#ded798",
  silex: "#70d65f",
};

type ParticleMovement = "up" | "right" | "left";

type Config = {
  [variant: string]: {
    title: string;
    beginSentence: string;
    particles?: {
      nbSprites: number;
      appearance?: number;
      minY?: number;
      movement: ParticleMovement;
      duration?: number;
    };
  };
};

const CONFIG: Config = {
  pek: {
    title: "FlappyPEK",
    beginSentence: "Fish to play",
    particles: { nbSprites: 15, movement: "up" },
  },
  la_mouche: {
    title: "FlappyFly",
    beginSentence: "Muchachos",
    particles: { nbSprites: 10, movement: "right" },
  },
  what_about_cooking: {
    title: "FlappyWhat?",
    beginSentence: "Grandma's dead?",
  },
  macula: {
    title: "Flacula",
    beginSentence: "*** **** **",
  },
  supower: {
    title: "Weshpower",
    beginSentence: "I am a superhero now",
    particles: { nbSprites: 11, movement: "right" },
  },
  nelly_bly: {
    title: "Flany Bly",
    beginSentence: "72 days",
    particles: { nbSprites: 9, movement: "left", minY: 500 },
  },
  skyrace: {
    title: "Flap Flap",
    beginSentence: "I Believe I Can Fly",
    particles: { nbSprites: 12, movement: "left" },
  },
  my_dog_ate_the_moon: {
    title: "Flap the dog",
    beginSentence: "Chien de la casse",
    particles: { nbSprites: 12, movement: "right", duration: 1000 },
  },
  la_tielle_setoise: {
    title: "Flap Setoise",
    beginSentence: "The ting go brrrr",
  },
  watchers: {
    title: "Flatchers",
    beginSentence: "Boo!",
  },
};

// Yay JavaScript https://stackoverflow.com/questions/51808160/keyof-inferring-string-number-when-key-is-only-a-string
type FlappyVariant = keyof Config & string;

const FLAPPY_MAX_SPEED = 12;
const FLAPPY_Y_GRAVITY = 0.6;
const FLAPPY_UP_PUSH = 13;

const FLAPPY_BBOX_OFFSET = 5;
const FLAPPY_HIT_BOX_X = 20;
const FLAPPY_HIT_BOX_Y = 8;

const FLOOR_X_SPEED_SLOW = 1;
const FLOOR_X_SPEED_GAME = 3;

const START_GAME_TRANSITION_TIME = 500;
const END_MENU_W = 200;
const END_MENU_H = 350;
const END_MENU_Y_OFFSET = -100;
const END_TRANSITION_TIME = 150;
const END_WHITE_FLASH_TIME = 60;

const PIPE_DURATION = 200;
const PIPE_GAP = 130;
const PIPE_GAP_RANDOM_MAX = 250;

const SILEX_COINS_APPEAR = 1 / 10;
const SILEX_COIN_SIZE = 50;
const SILEX_COIN_EARN_ANIMATION = 1000;

const PARTICLE_SPEED = 0.2;
const PARTICLE_DURATION = 1500;

const SCORE_ANIMATION_TIME = 300;

const DEBUG = false;

let floorSprite: p5.Image;
let flappySprite: p5.Image;
let backgroundSprite: p5.Image;
let particlesSprite: p5.Image;
let pipeSprite: p5.Image;
let silexCoinIcon: p5.Image;

let restartButton: Button;
let menuButton: Button;
let flappyFont: p5.Font;
let gameTime: number;
let xOffset: number;
let startGameTransitionTime: number;
let menuON: boolean;
let gameEND: boolean;
let gameEndTransitionStart: number;
let score: number;
let silexCoinsEarned: number;
let highscore: number;
let pipeDuration: number;

let gameScores: GameScore[];
let gameScoresPageIndex: number;

let particles: Particle[];
let pipes: Pipe[];
let silexCoins: SilexCoin[];
let flappy: Flappy;

class Particle {
  p5: p5;
  location: p5.Vector;
  scale: number;
  nbSprites: number;
  movement: ParticleMovement;
  life: number;
  duration: number;

  getRandomScale() {
    return Math.random() * 0.5 + 0.4;
  }

  constructor(
    p5: p5,
    x: number,
    y: number,
    nbSprites: number,
    movement: ParticleMovement,
    duration: number
  ) {
    this.p5 = p5;
    this.location = p5.createVector(x, y);
    this.scale = this.getRandomScale();
    this.nbSprites = nbSprites;
    this.movement = movement;
    this.life = this.p5.millis();
    this.duration = duration;
  }

  getLife() {
    return (this.p5.millis() - this.life) / this.duration;
  }

  getParticleOffset() {
    return Math.floor(this.getLife() * this.nbSprites);
  }

  display() {
    const particleOffset = this.getParticleOffset();
    const particleX = particlesSprite.width / this.nbSprites;

    this.p5.push();
    this.p5.imageMode(this.p5.CENTER);
    this.p5.image(
      particlesSprite,

      this.location.x,
      this.location.y,

      particleX * this.scale,
      particlesSprite.height * this.scale,

      particleOffset * particleX,
      0,

      particleX,
      particlesSprite.height
    );

    // this.p5.rect(
    //   this.location.x,
    //   this.location.y,
    //   particleX,
    //   particlesSprite.height
    // );

    this.p5.pop();
  }

  update() {
    switch (this.movement) {
      case "up":
        this.location.y -= PARTICLE_SPEED;
        break;
      case "right":
        this.location.x += PARTICLE_SPEED;
        break;
      case "left":
        this.location.x -= PARTICLE_SPEED;
        break;
    }
  }
}

class Flappy {
  p5: p5;
  location: p5.Vector;
  speed: p5.Vector;

  constructor(p5: p5, x: number, y: number) {
    this.p5 = p5;
    this.location = p5.createVector(x, y);
    this.speed = p5.createVector(0, 0);
  }

  display(transition: number) {
    this.p5.push();
    this.p5.imageMode(this.p5.CENTER);
    this.p5.translate(this.location.x, this.location.y);

    const rotation =
      easeInSine(
        this.p5.map(this.speed.y, -FLAPPY_MAX_SPEED, FLAPPY_MAX_SPEED, 0, 1)
      ) *
        this.p5.HALF_PI -
      this.p5.QUARTER_PI;

    this.p5.rotate(transition * rotation);

    const spriteOffset = (this.speed.y > 0 ? 1 : 0) * (flappySprite.width / 2);

    this.p5.image(
      flappySprite,
      0,
      0,
      flappySprite.width / 2,
      flappySprite.height,
      spriteOffset,
      0,
      flappySprite.width / 2,
      flappySprite.height
    );

    if (DEBUG) {
      this.p5.rotate(-transition * rotation);

      this.p5.rectMode(this.p5.CENTER);
      this.p5.noFill();
      this.p5.stroke(255, 0, 0);
      this.p5.rect(0, 0, FLAPPY_HIT_BOX_X * 2, FLAPPY_HIT_BOX_Y * 2);
    }

    this.p5.pop();
  }

  update() {
    this.speed.add(this.p5.createVector(0, FLAPPY_Y_GRAVITY));
    this.speed.limit(FLAPPY_MAX_SPEED);
    this.location.add(this.speed);

    this.location.y = this.p5.constrain(
      this.location.y,
      0,
      this.p5.height - floorSprite.height - flappySprite.height / 2
    );
  }

  goUp() {
    this.speed.add(this.p5.createVector(0, -FLAPPY_UP_PUSH));
    this.speed.limit(FLAPPY_MAX_SPEED * 0.6);
  }

  isTouchingFloor() {
    return (
      this.location.y + FLAPPY_HIT_BOX_Y >=
      this.p5.height -
        floorSprite.height -
        flappySprite.height / 2 -
        FLAPPY_BBOX_OFFSET
    );
  }

  reset() {
    this.speed = this.p5.createVector(0, 0);
    this.location.y = this.p5.height / 2;
  }
}

class Pipe {
  p5: p5;
  initialX: number;
  offset: number;
  gap: number;
  gapOffset: number;
  earnedPoint: boolean;

  constructor(p5: p5, initialX: number) {
    this.p5 = p5;
    this.initialX = initialX;
    this.offset = 0;
    this.gap = PIPE_GAP;
    this.gapOffset =
      Math.random() * PIPE_GAP_RANDOM_MAX - PIPE_GAP_RANDOM_MAX / 2;
    this.earnedPoint = false;
  }

  getPositionX() {
    return this.initialX + this.offset;
  }

  display() {
    this.p5.imageMode(this.p5.CORNER);
    this.p5.image(
      pipeSprite,
      this.getPositionX(),
      (this.p5.height + this.gap) / 2 + this.gapOffset /*- floorSprite.height*/
    );

    this.p5.push();
    this.p5.scale(1, -1);
    this.p5.image(
      pipeSprite,
      this.getPositionX(),
      -(this.p5.height - this.gap) / 2 - this.gapOffset /*+ floorSprite.height*/
    );
    this.p5.pop();
  }

  update() {
    this.offset -= FLOOR_X_SPEED_GAME;
    this.gapOffset;
  }

  intersectWith(flappy: Flappy) {
    const posX = this.getPositionX();
    const downPosY =
      (this.p5.height + this.gap) / 2 +
      this.gapOffset; /*- floorSprite.height;*/
    const upPosY = downPosY - this.gap;

    return (
      flappy.location.x + FLAPPY_HIT_BOX_X > posX &&
      flappy.location.x - FLAPPY_HIT_BOX_X <= posX + pipeSprite.width &&
      (flappy.location.y + FLAPPY_HIT_BOX_Y > downPosY ||
        flappy.location.y - FLAPPY_HIT_BOX_Y < upPosY)
    );
  }
}

class Button {
  p5: p5;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;

  constructor(p5: p5, label: string, x: number, y: number, w: number) {
    this.p5 = p5;
    this.label = label;
    this.x = x;
    this.y = y;

    this.w = w;
    this.h = 23;
  }

  isMouseOn() {
    return (
      this.p5.mouseX >= this.x - this.w / 2 &&
      this.p5.mouseX < this.x + this.w / 2 &&
      this.p5.mouseY >= this.y - this.h / 2 &&
      this.p5.mouseY <= this.y + this.h / 2
    );
  }

  display() {
    this.p5.push();

    this.p5.rectMode(this.p5.CENTER);

    this.p5.noStroke();
    this.p5.fill(COLORS.titleBorder);
    this.p5.rect(this.x, this.y + 2, this.w + 10, this.h + 13);

    if (this.isMouseOn()) {
      this.p5.fill(COLORS.orangeLight);
    } else {
      this.p5.fill(COLORS.orange);
    }

    this.p5.stroke(255);
    this.p5.strokeWeight(3);
    this.p5.rect(this.x, this.y, this.w, this.h);

    this.p5.textAlign(this.p5.CENTER, this.p5.CENTER);
    this.p5.textSize(15);
    this.p5.fill(255);
    this.p5.noStroke();
    this.p5.text(this.label, this.x, this.y);
  }
}

class SilexCoin {
  p5: p5;
  x: number;
  y: number;
  offset: number;
  earned: boolean;
  earnedTime: number;

  constructor(p5: p5, x: number, y: number) {
    this.p5 = p5;
    this.x = x;
    this.y = y;
    this.offset = 0;
    this.earned = false;
    this.earnedTime = 0;
  }

  display() {
    this.p5.push();
    this.p5.imageMode(this.p5.CENTER);

    if (this.earned) {
      const norm = easeOutExpo(
        (this.p5.millis() - this.earnedTime) / SILEX_COIN_EARN_ANIMATION
      );
      const x = this.p5.lerp(
        this.x + this.offset,
        this.p5.width - SILEX_COIN_SIZE / 2 - 5,
        norm
      );
      const size = this.p5.lerp(SILEX_COIN_SIZE, 30, norm);
      const y = this.p5.lerp(this.y, SILEX_COIN_SIZE / 2, norm);
      this.p5.image(silexCoinIcon, x, y, size, size);
    } else {
      this.p5.image(
        silexCoinIcon,
        this.x + this.offset,
        this.y + Math.cos(gameTime / 2) * 10
      );
    }

    this.p5.pop();
  }

  update() {
    this.offset -= FLOOR_X_SPEED_GAME;
  }

  intersectWith(flappy: Flappy) {
    const hw = SILEX_COIN_SIZE / 2;
    return (
      flappy.location.x + FLAPPY_HIT_BOX_X > this.x + this.offset - hw &&
      flappy.location.x - FLAPPY_HIT_BOX_X <= this.x + this.offset + hw &&
      flappy.location.y + FLAPPY_HIT_BOX_Y > this.y - hw &&
      flappy.location.y - FLAPPY_HIT_BOX_Y < this.y + hw
    );
  }
}

function menu(p5: p5, variant: FlappyVariant) {
  const titleY = 118;

  p5.push();
  p5.textAlign(p5.CENTER, p5.CENTER);
  p5.imageMode(p5.CENTER);

  // Title text
  p5.strokeWeight(5);
  p5.stroke(COLORS.titleBorder);
  p5.textSize(60);
  p5.fill(255);
  p5.text(CONFIG[variant].title, p5.width / 2, 80);

  p5.stroke(255);
  p5.strokeWeight(3);
  p5.fill(COLORS.orange);
  p5.textSize(12);
  p5.text(CONFIG[variant].beginSentence, p5.width / 2, titleY + 115);

  p5.pop();
}

function displayBackgroundSprites(p5: p5) {
  p5.imageMode(p5.CORNER);
  p5.image(backgroundSprite, 0, 0);
}

function displayFloor(p5: p5) {
  p5.imageMode(p5.CORNER);
  p5.image(
    floorSprite,
    -xOffset % floorSprite.width,
    p5.height - floorSprite.height
  );
  p5.image(
    floorSprite,
    (-xOffset % floorSprite.width) + floorSprite.width,
    p5.height - floorSprite.height
  );
}

function endMenu(
  p5: p5,
  variant: FlappyVariant,
  scaleFactor: number,
  userId: string
) {
  p5.push();
  p5.translate(p5.width / 2, p5.height / 2 + END_MENU_Y_OFFSET);
  if (scaleFactor !== 1) p5.scale(scaleFactor, scaleFactor);
  p5.rectMode(p5.CENTER);

  p5.fill(COLORS.menuBackground);
  p5.stroke(COLORS.titleBorder);
  p5.strokeWeight(2);
  p5.rect(0, 0, END_MENU_W, END_MENU_H);

  p5.textAlign(p5.CENTER, p5.TOP);
  p5.strokeWeight(5);
  p5.stroke(COLORS.titleBorder);
  p5.textSize(20);
  p5.fill(255);
  p5.text(CONFIG[variant].title, 0, -END_MENU_H / 2 + 20);

  p5.noStroke();
  p5.fill(COLORS.titleBorder);
  p5.textSize(12);
  p5.text("By the TDs and Cyp", 0, -END_MENU_H / 2 + 50);

  p5.textAlign(p5.LEFT, p5.CENTER);
  const scoreHeight = -END_MENU_H / 2 + 100;
  const highScoreHeight = -END_MENU_H / 2 + 125;
  p5.text("Score :", -END_MENU_W / 2 + 20, scoreHeight);
  p5.text("Highscore :", -END_MENU_W / 2 + 20, highScoreHeight);

  p5.imageMode(p5.CENTER);
  p5.image(silexCoinIcon, 80, scoreHeight, 25, 25);

  p5.fill(255);
  p5.stroke(0);
  p5.strokeWeight(3);
  p5.text(score, 20, scoreHeight);
  p5.text(highscore, 20, highScoreHeight);

  p5.fill(COLORS.silex);
  p5.text(silexCoinsEarned, 50, scoreHeight);

  // Display scores
  const scoreLineWidth = END_MENU_W - 50;
  const scoreLineHeight = 25;
  const scoreLineGap = 0;
  p5.translate(-END_MENU_W / 2 + 25, highScoreHeight + 30);

  p5.rectMode(p5.CORNER);
  p5.noStroke();

  if (gameScores) {
    const bgColors = ["#c78f1c", "#e76001"];
    p5.noStroke();

    bgColors.forEach((bg, i) => {
      const offset = (bgColors.length - i - 1) * 5;
      p5.fill(bg);
      p5.rect(
        offset,
        offset,
        scoreLineWidth,
        gameScores.length * scoreLineHeight +
          (gameScores.length - 1) * scoreLineGap
      );
    });

    for (let i = 0; i < gameScores.length; i++) {
      p5.push();

      const scoreAnimationNorm = easeOutExpo(
        p5.constrain(
          (p5.millis() - i * 50 - gameEndTransitionStart) /
            SCORE_ANIMATION_TIME,
          0,
          1
        )
      );
      p5.translate(-(1 - scoreAnimationNorm) * 50, 0);

      const gameScore = gameScores[i];
      const y = i * (scoreLineGap + scoreLineHeight);

      const lerpC = p5.lerpColor(
        p5.color("#e76001"),
        p5.color("#774f8f"),
        i / gameScores.length
      );

      lerpC.setAlpha(scoreAnimationNorm * 255);

      p5.fill(
        gameScore.points === score && gameScore.player_id === userId
          ? p5.color("#71d862")
          : lerpC
      );

      const cBorder = p5.color(COLORS.titleBorder);
      cBorder.setAlpha(scoreAnimationNorm * 255);
      p5.stroke(cBorder);
      p5.strokeWeight(1);
      p5.rect(0, y, scoreLineWidth, scoreLineHeight);

      //p5.stroke(COLORS.titleBorder);
      //p5.strokeWeight(1);

      p5.textAlign(p5.LEFT, p5.CENTER);
      p5.noStroke();
      p5.fill(255);
      p5.text(gameScore.player.full_name, 5, y + scoreLineHeight * 0.5);

      p5.textAlign(p5.RIGHT, p5.CENTER);
      p5.text(gameScore.points, scoreLineWidth - 10, y + scoreLineHeight * 0.5);

      p5.pop();
    }
  }

  p5.pop();

  restartButton.display();
  menuButton.display();
}

function displayScore(p5: p5) {
  p5.push();
  p5.textAlign(p5.CENTER, p5.CENTER);
  p5.fill(255);
  p5.textSize(28);
  p5.stroke(0);
  p5.strokeWeight(5);
  p5.text(score, p5.width / 2, 50);

  p5.textAlign(p5.LEFT, p5.CENTER);
  p5.fill(COLORS.silex);
  p5.textSize(23);
  p5.text(
    silexCoinsEarned,
    p5.width - SILEX_COIN_SIZE - 20,
    SILEX_COIN_SIZE / 2
  );

  p5.imageMode(p5.CENTER);
  p5.image(
    silexCoinIcon,
    p5.width - SILEX_COIN_SIZE / 2 - 5,
    SILEX_COIN_SIZE / 2,
    30,
    30
  );
  p5.pop();
}

function restartGame() {
  gameEND = false;
  pipes = [];
  silexCoins = [];
  xOffset = 0;
  flappy.reset();
  pipeDuration = xOffset;
  score = 0;
  silexCoinsEarned = 0;
  gameScoresPageIndex = 0;
}

interface FlappyBirdProps {
  gameVariant: GameVariant;
}

const FlappyBird = ({ gameVariant }: FlappyBirdProps): JSX.Element => {
  const { user, updateUser } = useAuth();

  useEffect(() => {
    gameTime = 0;
    xOffset = 0;
    menuON = true;
    gameEND = false;
    gameEndTransitionStart = 0;
    silexCoinsEarned = 0;
    score = 0;
    highscore = 0;
    pipeDuration = 0;
    particles = [];
    pipes = [];
    silexCoins = [];
    gameScoresPageIndex = 0;
  }, []);

  if (!gameVariant) return <div>Loading...</div>;

  function spriteURL(name: string) {
    return SPRITES_CONTEXT(`./${gameVariant.name}/${name}`).default;
  }

  const fetchScores = () =>
    axios
      .get(
        Zou.zouAPIURL(
          `data/games/${gameVariant.game_id}/game_scores?page_size=7&page_index=${gameScoresPageIndex}`
        )
      )
      .then((response) => {
        gameScores = response.data;
      });

  function endGame(p5: p5) {
    gameEND = true;
    highscore = Math.max(highscore, score);
    gameEndTransitionStart = p5.millis();

    if (score > 0 && gameVariant) {
      Zou.saveScore(gameVariant.game_id, score);
    }

    fetchScores();

    if (user) {
      changePersonSilexCoins(
        user.id,
        (user.coins || 0) + silexCoinsEarned
      ).then(() => {
        updateUser();
        fetchScores();
      });
    } else {
      fetchScores();
    }
  }

  const preload = (p5: p5) => {
    floorSprite = p5.loadImage(spriteURL("floor.png"));
    pipeSprite = p5.loadImage(spriteURL("pipe.png"));
    flappySprite = p5.loadImage(spriteURL("flappy.png"));
    backgroundSprite = p5.loadImage(spriteURL("background.png"));
    if (CONFIG[gameVariant.name].particles)
      particlesSprite = p5.loadImage(spriteURL("particles.png"));
    silexCoinIcon = p5.loadImage(SilexCoinIcon);
    flappyFont = p5.loadFont(FlappyFont);
  };

  const spawnParticles = (p5: p5) => {
    const particlesConfig = CONFIG[gameVariant.name].particles;
    if (
      particlesConfig &&
      Math.random() < (particlesConfig.appearance || 0.05)
    ) {
      const minY = particlesConfig.minY || 0;
      const maxY = p5.height - floorSprite.height;
      const randomY = Math.random() * (maxY - minY) + minY;
      particles.push(
        new Particle(
          p5,
          Math.random() * p5.width,
          randomY,
          particlesConfig.nbSprites,
          particlesConfig.movement,
          particlesConfig.duration || PARTICLE_DURATION
        )
      );
    }
  };

  const updateParticles = () => {
    if (CONFIG[gameVariant.name].particles) {
      for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        particle.display();
        particle.update();

        if (particle.getLife() > 1) {
          particles.splice(i, 1);
        }
      }
    }
  };

  const setup = (p5: p5, canvasParentRef: Element) => {
    p5.createCanvas(400, 600).parent(canvasParentRef);
    p5.noSmooth();

    pipeSprite.resize(pipeSprite.width / 2, 0);
    silexCoinIcon.resize(SILEX_COIN_SIZE, 0);

    restartButton = new Button(
      p5,
      "Restart",
      p5.width / 2,
      (p5.height + END_MENU_H) / 2 + END_MENU_Y_OFFSET + 50,
      78
    );

    menuButton = new Button(
      p5,
      "Menu",
      p5.width / 2,
      (p5.height + END_MENU_H) / 2 + END_MENU_Y_OFFSET + 100,
      70
    );

    flappy = new Flappy(p5, p5.width / 2, p5.height / 2);
    p5.textFont(flappyFont);
  };

  const draw = (p5: p5) => {
    displayBackgroundSprites(p5);

    spawnParticles(p5);
    updateParticles();

    let transition;

    if (gameEND) {
      transition = 1;
    } else if (menuON) {
      menu(p5, gameVariant.name);
      transition = 0;

      // Do a flappy oscillation
      flappy.location.x = p5.width / 2;
      flappy.location.y = p5.height / 2 + Math.cos(gameTime) * 10;
    } else {
      // Compute the transition factor to the left
      transition = 1;
      const gameTransitionTimeDiff = p5.millis() - startGameTransitionTime;

      // Apply transition on flappy movememnt at the beginning
      if (gameTransitionTimeDiff < START_GAME_TRANSITION_TIME) {
        // Transition the flappy to the left
        const transition = gameTransitionTimeDiff / START_GAME_TRANSITION_TIME;
        flappy.location.x = p5.map(
          transition,
          0,
          1,
          p5.width / 2,
          p5.width / 2 - 80
        );
      }

      // Check for pipe intersection and removal
      for (let i = pipes.length - 1; i >= 0; i--) {
        const pipe = pipes[i];
        pipe.update();

        if (
          !pipe.earnedPoint &&
          flappy.location.x > pipe.getPositionX() + pipeSprite.width / 2
        ) {
          pipe.earnedPoint = true;
          score++;
        }

        if (pipe.intersectWith(flappy)) endGame(p5);

        if (pipe.getPositionX() + pipeSprite.width <= 0) {
          pipes.splice(i, 1);
        }
      }

      for (let i = silexCoins.length - 1; i >= 0; i--) {
        const silexCoin = silexCoins[i];
        silexCoin.update();

        if (!silexCoin.earned && silexCoin.intersectWith(flappy)) {
          silexCoinsEarned += 1;
          silexCoin.earned = true;
          silexCoin.earnedTime = p5.millis();
        } else if (
          silexCoin.x + SILEX_COIN_SIZE / 2 <= 0 ||
          (silexCoin.earned &&
            p5.millis() - silexCoin.earnedTime >= SILEX_COIN_EARN_ANIMATION)
        ) {
          silexCoins.splice(i, 1);
        }
      }

      // Check when to add pipes
      if (xOffset - pipeDuration >= PIPE_DURATION) {
        const pipeX = p5.width + pipeSprite.width / 2;
        const newPipe = new Pipe(p5, pipeX);
        pipes.push(newPipe);

        if (Math.random() < SILEX_COINS_APPEAR) {
          silexCoins.push(
            new SilexCoin(
              p5,
              pipeX + pipeSprite.width / 2,
              p5.height / 2 + newPipe.gapOffset
            )
          );
        }

        pipeDuration = xOffset;
      }

      // Check when flappy is touching the floor
      if (flappy.isTouchingFloor()) endGame(p5);
    }

    // Display pipes
    for (let i = 0; i < pipes.length; i++) {
      pipes[i].display();
    }

    displayFloor(p5);
    flappy.display(transition);

    if (!menuON) flappy.update();
    if (!menuON && !gameEND) displayScore(p5);

    for (let i = 0; i < silexCoins.length; i++) {
      silexCoins[i].display();
    }

    if (gameEND) {
      // End animation with flashing background and scale
      const timeDiff = p5.millis() - gameEndTransitionStart;
      const scaleFactor =
        timeDiff >= END_TRANSITION_TIME
          ? 1
          : easeOutQuint(timeDiff / END_TRANSITION_TIME);
      endMenu(p5, gameVariant.name, scaleFactor, user ? user.id : "");
      if (timeDiff <= END_WHITE_FLASH_TIME) p5.background(255, 200);
    }

    // Update time and floor position
    if (!gameEND) xOffset += menuON ? FLOOR_X_SPEED_SLOW : FLOOR_X_SPEED_GAME;
    gameTime += 0.1;
  };

  function flappyUp(p5: p5) {
    if (menuON) {
      menuON = false;
      startGameTransitionTime = p5.millis() + PIPE_DURATION;
    } else {
      flappy.goUp();
    }
  }

  function mousePressed(p5: p5) {
    // Test if mouse is in the canvas
    if (
      !(
        p5.mouseX >= 0 &&
        p5.mouseX <= p5.width &&
        p5.mouseY >= 0 &&
        p5.mouseY <= p5.height
      )
    )
      return;

    if (gameEND) {
      if (restartButton.isMouseOn()) restartGame();

      if (menuButton.isMouseOn()) {
        restartGame();
        menuON = true;
      }
    } else {
      flappyUp(p5);
    }
  }

  function keyPressed(p5: p5) {
    if (p5.key === " ") {
      if (gameEND) {
        restartGame();
      } else {
        flappyUp(p5);
      }
    }
  }

  return (
    <div>
      <Sketch
        setup={setup}
        draw={draw}
        preload={preload}
        keyPressed={keyPressed}
        mousePressed={mousePressed}
        style={{
          width: 400,
          height: 600,
          imageRendering:
            navigator.userAgent.indexOf("Firefox") !== -1
              ? "-moz-crisp-edges"
              : "pixelated" /* Firefox */,
        }}
      />
    </div>
  );
};

export default FlappyBird;
