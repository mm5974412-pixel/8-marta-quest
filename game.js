(() => {
  const CONFIG = {
    logicalWidth: 480,
    logicalHeight: 640,
    skyTop: '#7ec8ff',
    skyBottom: '#d2f0ff',
    groundColor: '#d4a85e',
    groundStripeColor: '#b98538',
    groundHeight: 96,
    gravity: 0.42,
    jumpVelocity: -7.2,
    maxFallSpeed: 10,
    birdX: 138,
    birdRadius: 16,
    pipeWidth: 76,
    pipeSpeed: 2.2,
    pipeSpawnInterval: 1550,
    pipeGapMin: 150,
    pipeGapMax: 195,
    pipeTopMargin: 66,
    pipeBottomMargin: 130,
    pipeColor: '#44b349',
    pipeCapColor: '#2d8d35',
    pipeCapHeight: 20,
    pipeCapOverhang: 6,
    scoreFont: 'bold 42px Arial',
    overlayTitleFont: 'bold 46px Arial',
    overlayBodyFont: '26px Arial',
    textDark: '#1e2a3f',
    bestStorageKey: 'flappy_best_score'
  };

  const STATE = {
    READY: 'READY',
    PLAYING: 'PLAYING',
    GAME_OVER: 'GAME_OVER'
  };

  class Game {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.state = STATE.READY;
      this.score = 0;
      this.best = this.loadBestScore();
      this.pipes = [];
      this.lastPipeSpawn = 0;
      this.groundOffset = 0;
      this.lastTime = 0;
      this.bird = this.createBird();
      this.bindEvents();
      this.handleResize();
      requestAnimationFrame((ts) => this.loop(ts));
    }

    createBird() {
      return {
        x: CONFIG.birdX,
        y: CONFIG.logicalHeight / 2,
        velocityY: 0,
        tilt: 0
      };
    }

    bindEvents() {
      window.addEventListener('keydown', (event) => this.onKeyDown(event));
      this.canvas.addEventListener('pointerdown', () => this.onPointerDown());
      window.addEventListener('resize', () => this.handleResize());
    }

    onKeyDown(event) {
      if (event.code === 'Space') {
        event.preventDefault();
        this.handleAction();
        return;
      }

      if (event.code === 'KeyR' && this.state === STATE.GAME_OVER) {
        this.resetToReady();
      }
    }

    onPointerDown() {
      this.handleAction();
    }

    handleAction() {
      if (this.state === STATE.READY) {
        this.startPlaying();
        return;
      }

      if (this.state === STATE.PLAYING) {
        this.flap();
        return;
      }

      if (this.state === STATE.GAME_OVER) {
        this.resetToReady();
      }
    }

    startPlaying() {
      this.state = STATE.PLAYING;
      this.score = 0;
      this.pipes = [];
      this.lastPipeSpawn = 0;
      this.bird = this.createBird();
      this.flap();
    }

    resetToReady() {
      this.state = STATE.READY;
      this.score = 0;
      this.pipes = [];
      this.lastPipeSpawn = 0;
      this.bird = this.createBird();
    }

    flap() {
      this.bird.velocityY = CONFIG.jumpVelocity;
    }

    loadBestScore() {
      const raw = window.localStorage.getItem(CONFIG.bestStorageKey);
      const parsed = Number.parseInt(raw ?? '0', 10);
      return Number.isFinite(parsed) ? parsed : 0;
    }

    saveBestScore() {
      window.localStorage.setItem(CONFIG.bestStorageKey, String(this.best));
    }

    handleResize() {
      this.canvas.width = CONFIG.logicalWidth;
      this.canvas.height = CONFIG.logicalHeight;
    }

    loop(timestamp) {
      const dtMs = this.lastTime ? Math.min(timestamp - this.lastTime, 34) : 16;
      this.lastTime = timestamp;
      const frameScale = dtMs / 16.6667;

      this.update(frameScale, dtMs);
      this.render();
      requestAnimationFrame((ts) => this.loop(ts));
    }

    update(frameScale, dtMs) {
      this.groundOffset = (this.groundOffset + CONFIG.pipeSpeed * frameScale) % 36;

      if (this.state !== STATE.PLAYING) {
        return;
      }

      this.bird.velocityY = Math.min(this.bird.velocityY + CONFIG.gravity * frameScale, CONFIG.maxFallSpeed);
      this.bird.y += this.bird.velocityY * frameScale;
      this.bird.tilt = Math.max(-0.55, Math.min(1.15, this.bird.velocityY / 8));

      this.lastPipeSpawn += dtMs;
      if (this.lastPipeSpawn >= CONFIG.pipeSpawnInterval) {
        this.spawnPipe();
        this.lastPipeSpawn = 0;
      }

      for (const pipe of this.pipes) {
        pipe.x -= CONFIG.pipeSpeed * frameScale;

        const crossed = !pipe.passed && pipe.x + CONFIG.pipeWidth < this.bird.x - CONFIG.birdRadius;
        if (crossed) {
          pipe.passed = true;
          this.score += 1;
        }
      }

      this.pipes = this.pipes.filter((pipe) => pipe.x + CONFIG.pipeWidth > -8);

      if (this.checkCollisions()) {
        this.toGameOver();
      }
    }

    spawnPipe() {
      const range = CONFIG.pipeGapMax - CONFIG.pipeGapMin;
      const gap = CONFIG.pipeGapMin + Math.random() * range;
      const minCenter = CONFIG.pipeTopMargin + gap / 2;
      const maxCenter = CONFIG.logicalHeight - CONFIG.groundHeight - CONFIG.pipeBottomMargin - gap / 2;
      const centerY = minCenter + Math.random() * (maxCenter - minCenter);

      this.pipes.push({
        x: CONFIG.logicalWidth + 12,
        gapY: centerY,
        gapSize: gap,
        passed: false
      });
    }

    checkCollisions() {
      const birdTop = this.bird.y - CONFIG.birdRadius;
      const birdBottom = this.bird.y + CONFIG.birdRadius;
      const birdLeft = this.bird.x - CONFIG.birdRadius;
      const birdRight = this.bird.x + CONFIG.birdRadius;
      const groundY = CONFIG.logicalHeight - CONFIG.groundHeight;

      if (birdBottom >= groundY || birdTop <= 0) {
        return true;
      }

      for (const pipe of this.pipes) {
        const pipeLeft = pipe.x;
        const pipeRight = pipe.x + CONFIG.pipeWidth;

        if (birdRight <= pipeLeft || birdLeft >= pipeRight) {
          continue;
        }

        const gapTop = pipe.gapY - pipe.gapSize / 2;
        const gapBottom = pipe.gapY + pipe.gapSize / 2;

        if (birdTop < gapTop || birdBottom > gapBottom) {
          return true;
        }
      }

      return false;
    }

    toGameOver() {
      this.state = STATE.GAME_OVER;
      if (this.score > this.best) {
        this.best = this.score;
        this.saveBestScore();
      }
    }

    render() {
      this.drawBackground();
      this.drawPipes();
      this.drawGround();
      this.drawBird();
      this.drawHud();
      this.drawOverlays();
    }

    drawBackground() {
      const gradient = this.ctx.createLinearGradient(0, 0, 0, CONFIG.logicalHeight);
      gradient.addColorStop(0, CONFIG.skyTop);
      gradient.addColorStop(1, CONFIG.skyBottom);
      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(0, 0, CONFIG.logicalWidth, CONFIG.logicalHeight);
    }

    drawGround() {
      const y = CONFIG.logicalHeight - CONFIG.groundHeight;
      this.ctx.fillStyle = CONFIG.groundColor;
      this.ctx.fillRect(0, y, CONFIG.logicalWidth, CONFIG.groundHeight);

      this.ctx.fillStyle = CONFIG.groundStripeColor;
      const stripeWidth = 36;
      for (let i = -1; i <= Math.ceil(CONFIG.logicalWidth / stripeWidth); i += 1) {
        const x = i * stripeWidth - this.groundOffset;
        this.ctx.fillRect(x, y + 18, stripeWidth / 2, 11);
      }
    }

    drawPipes() {
      for (const pipe of this.pipes) {
        const left = pipe.x;
        const right = pipe.x + CONFIG.pipeWidth;
        const gapTop = pipe.gapY - pipe.gapSize / 2;
        const gapBottom = pipe.gapY + pipe.gapSize / 2;

        this.ctx.fillStyle = CONFIG.pipeColor;
        this.ctx.fillRect(left, 0, CONFIG.pipeWidth, gapTop);
        this.ctx.fillRect(left, gapBottom, CONFIG.pipeWidth, CONFIG.logicalHeight - CONFIG.groundHeight - gapBottom);

        this.ctx.fillStyle = CONFIG.pipeCapColor;
        this.ctx.fillRect(
          left - CONFIG.pipeCapOverhang,
          gapTop - CONFIG.pipeCapHeight,
          CONFIG.pipeWidth + CONFIG.pipeCapOverhang * 2,
          CONFIG.pipeCapHeight
        );
        this.ctx.fillRect(
          left - CONFIG.pipeCapOverhang,
          gapBottom,
          CONFIG.pipeWidth + CONFIG.pipeCapOverhang * 2,
          CONFIG.pipeCapHeight
        );

        this.ctx.strokeStyle = '#25662a';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(left, 0, right - left, gapTop);
        this.ctx.strokeRect(left, gapBottom, right - left, CONFIG.logicalHeight - CONFIG.groundHeight - gapBottom);
      }
    }

    drawBird() {
      const { x, y, tilt } = this.bird;
      this.ctx.save();
      this.ctx.translate(x, y);
      this.ctx.rotate(tilt);

      this.ctx.fillStyle = '#ffd93a';
      this.ctx.beginPath();
      this.ctx.ellipse(0, 0, CONFIG.birdRadius + 2, CONFIG.birdRadius, 0, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.fillStyle = '#f3a236';
      this.ctx.beginPath();
      this.ctx.moveTo(CONFIG.birdRadius - 1, -2);
      this.ctx.lineTo(CONFIG.birdRadius + 11, 2);
      this.ctx.lineTo(CONFIG.birdRadius - 1, 8);
      this.ctx.closePath();
      this.ctx.fill();

      this.ctx.fillStyle = '#fff';
      this.ctx.beginPath();
      this.ctx.arc(5, -6, 5.5, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.fillStyle = '#000';
      this.ctx.beginPath();
      this.ctx.arc(7, -6, 2.1, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.restore();
    }

    drawHud() {
      this.ctx.textAlign = 'center';
      this.ctx.fillStyle = '#ffffffee';
      this.ctx.strokeStyle = '#00000066';
      this.ctx.lineWidth = 4;
      this.ctx.font = CONFIG.scoreFont;
      const y = 66;

      if (this.state === STATE.PLAYING) {
        this.ctx.strokeText(String(this.score), CONFIG.logicalWidth / 2, y);
        this.ctx.fillText(String(this.score), CONFIG.logicalWidth / 2, y);
      } else {
        const miniFont = 'bold 22px Arial';
        this.ctx.font = miniFont;
        this.ctx.fillStyle = '#ffffffdd';
        this.ctx.fillText(`Score: ${this.score}`, 94, 40);
        this.ctx.fillText(`Best: ${this.best}`, 94, 70);
      }
    }

    drawOverlays() {
      if (this.state === STATE.READY) {
        this.drawPanel({
          title: 'Flappy Bird',
          lines: ['Нажми Space / клик / тап', 'чтобы начать']
        });
      }

      if (this.state === STATE.GAME_OVER) {
        this.drawPanel({
          title: 'Game Over',
          lines: [`Score: ${this.score}`, `Best: ${this.best}`, 'Нажми R или клик/тап', 'для рестарта']
        });
      }
    }

    drawPanel({ title, lines }) {
      const panelWidth = 360;
      const panelHeight = 230;
      const x = (CONFIG.logicalWidth - panelWidth) / 2;
      const y = (CONFIG.logicalHeight - panelHeight) / 2 - 45;

      this.ctx.fillStyle = '#0f1d34cc';
      this.ctx.strokeStyle = '#ffffff66';
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.roundRect(x, y, panelWidth, panelHeight, 18);
      this.ctx.fill();
      this.ctx.stroke();

      this.ctx.textAlign = 'center';
      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = CONFIG.overlayTitleFont;
      this.ctx.fillText(title, CONFIG.logicalWidth / 2, y + 62);

      this.ctx.font = CONFIG.overlayBodyFont;
      lines.forEach((line, idx) => {
        this.ctx.fillText(line, CONFIG.logicalWidth / 2, y + 112 + idx * 38);
      });

      this.ctx.fillStyle = CONFIG.textDark;
      this.ctx.font = 'bold 18px Arial';
      this.ctx.fillText('Space / Click / Tap', CONFIG.logicalWidth / 2, CONFIG.logicalHeight - 22);
    }
  }

  const canvas = document.getElementById('gameCanvas');
  // roundRect has full support in modern browsers; fallback keeps script stable in old engines.
  if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function roundRect(x, y, width, height, radius) {
      const r = Math.min(radius, width / 2, height / 2);
      this.moveTo(x + r, y);
      this.arcTo(x + width, y, x + width, y + height, r);
      this.arcTo(x + width, y + height, x, y + height, r);
      this.arcTo(x, y + height, x, y, r);
      this.arcTo(x, y, x + width, y, r);
      this.closePath();
      return this;
    };
  }

  new Game(canvas);
})();
