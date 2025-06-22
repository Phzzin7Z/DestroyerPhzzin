/*
 * Botão Misterioso com Pong - by Phzzin
 */

// Proteção mantida por precaução
const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/gh/DarkModde/Dark-Scripts/ProtectionScript.js';
document.head.appendChild(script);

console.clear();
const noop = () => {};
console.warn = console.error = window.debug = noop;

class MysteryButton {
  constructor() {
    this.createButton();
    this.injectStyles();
    this.gameActive = false;
  }

  createButton() {
    this.button = document.createElement('button');
    this.button.textContent = '???';
    this.button.className = 'mystery-button';
    this.button.onclick = () => this.toggleGame();
    document.body.appendChild(this.button);
  }

  injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .mystery-button {
        position: fixed;
        bottom: 20px;
        left: 20px;
        z-index: 9999;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: transparent;
        color: white;
        font-size: 24px;
        font-weight: bold;
        border: 2px solid white;
        cursor: pointer;
        box-shadow: 0 0 10px rgba(255,255,255,0.5);
        animation: pulse 2s infinite, rotate 10s linear infinite;
        transition: all 0.3s ease;
      }
      
      .mystery-button:hover {
        transform: scale(1.1);
        box-shadow: 0 0 20px rgba(255,255,255,0.8);
      }
      
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
      }
      
      @keyframes rotate {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      .game-container {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 600px;
        height: 400px;
        background: black;
        border: 2px solid white;
        z-index: 10000;
        display: none;
      }
      
      .close-btn {
        position: absolute;
        top: 10px;
        right: 10px;
        background: transparent;
        color: white;
        border: 1px solid white;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        cursor: pointer;
        z-index: 10001;
      }
      
      #pongCanvas {
        width: 100%;
        height: 100%;
      }
    `;
    document.head.appendChild(style);
  }

  toggleGame() {
    if (this.gameActive) {
      this.closeGame();
    } else {
      this.openGame();
    }
  }

  openGame() {
    this.gameActive = true;
    
    // Criar container do jogo
    this.gameContainer = document.createElement('div');
    this.gameContainer.className = 'game-container';
    
    // Botão de fechar
    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-btn';
    closeBtn.textContent = 'X';
    closeBtn.onclick = () => this.closeGame();
    
    // Canvas do Pong
    const canvas = document.createElement('canvas');
    canvas.id = 'pongCanvas';
    canvas.width = 600;
    canvas.height = 400;
    
    this.gameContainer.appendChild(closeBtn);
    this.gameContainer.appendChild(canvas);
    document.body.appendChild(this.gameContainer);
    
    this.gameContainer.style.display = 'block';
    this.initPongGame();
  }

  closeGame() {
    this.gameActive = false;
    if (this.gameContainer) {
      this.gameContainer.remove();
    }
  }

  initPongGame() {
    const canvas = document.getElementById('pongCanvas');
    const ctx = canvas.getContext('2d');
    
    // Configurações do jogo
    const paddleWidth = 10, paddleHeight = 80;
    const ballSize = 10;
    
    // Posições iniciais
    let playerY = canvas.height / 2 - paddleHeight / 2;
    let computerY = canvas.height / 2 - paddleHeight / 2;
    let ballX = canvas.width / 2;
    let ballY = canvas.height / 2;
    
    // Velocidades
    let ballSpeedX = 5;
    let ballSpeedY = 5;
    let computerSpeed = 4;
    
    // Pontuação
    let playerScore = 0;
    let computerScore = 0;
    
    // Controles
    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      playerY = e.clientY - rect.top - paddleHeight / 2;
      
      // Limitar paddle dentro do canvas
      if (playerY < 0) playerY = 0;
      if (playerY > canvas.height - paddleHeight) playerY = canvas.height - paddleHeight;
    });
    
    function draw() {
      // Fundo preto
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Linha central
      ctx.strokeStyle = 'white';
      ctx.beginPath();
      ctx.setLineDash([5, 5]);
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Paddles
      ctx.fillStyle = 'white';
      ctx.fillRect(0, playerY, paddleWidth, paddleHeight);
      ctx.fillRect(canvas.width - paddleWidth, computerY, paddleWidth, paddleHeight);
      
      // Bola
      ctx.beginPath();
      ctx.arc(ballX, ballY, ballSize, 0, Math.PI * 2);
      ctx.fill();
      
      // Placar
      ctx.font = '30px Arial';
      ctx.fillText(playerScore, 100, 50);
      ctx.fillText(computerScore, canvas.width - 100, 50);
    }
    
    function update() {
      // Movimento da bola
      ballX += ballSpeedX;
      ballY += ballSpeedY;
      
      // Colisão com topo e fundo
      if (ballY < ballSize || ballY > canvas.height - ballSize) {
        ballSpeedY = -ballSpeedY;
      }
      
      // Colisão com paddles
      if (ballX < paddleWidth + ballSize && 
          ballY > playerY && ballY < playerY + paddleHeight) {
        ballSpeedX = -ballSpeedX * 1.05; // Aumenta velocidade
      }
      
      if (ballX > canvas.width - paddleWidth - ballSize && 
          ballY > computerY && ballY < computerY + paddleHeight) {
        ballSpeedX = -ballSpeedX * 1.05; // Aumenta velocidade
      }
      
      // Pontuação
      if (ballX < 0) {
        computerScore++;
        resetBall();
      }
      
      if (ballX > canvas.width) {
        playerScore++;
        resetBall();
      }
      
      // IA do computador (simples)
      const computerPaddleCenter = computerY + paddleHeight / 2;
      if (computerPaddleCenter < ballY - 10) {
        computerY += computerSpeed;
      } else if (computerPaddleCenter > ballY + 10) {
        computerY -= computerSpeed;
      }
      
      // Limitar paddle do computador
      if (computerY < 0) computerY = 0;
      if (computerY > canvas.height - paddleHeight) computerY = canvas.height - paddleHeight;
    }
    
    function resetBall() {
      ballX = canvas.width / 2;
      ballY = canvas.height / 2;
      ballSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1);
      ballSpeedY = 5 * (Math.random() > 0.5 ? 1 : -1);
    }
    
    function gameLoop() {
      draw();
      update();
      
      if (document.querySelector('.game-container')) {
        requestAnimationFrame(gameLoop);
      }
    }
    
    resetBall();
    gameLoop();
  }
}

// Inicializar quando a página carregar
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new MysteryButton();
  });
} else {
  new MysteryButton();
}
