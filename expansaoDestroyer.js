/*
 * Expansão Destroyer by Phzzin - Customizado por Phzzin
 * Base original por AmmieNyami, DarkMode e marcos10pc
 */

// Proteção mantida por precaução
const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/gh/DarkModde/Dark-Scripts/ProtectionScript.js';
document.head.appendChild(script);

console.clear();
const noop = () => {};
console.warn = console.error = window.debug = noop;

// ... [As classes UrlHelper, RequestManager, ExamAutomator e PageCompletionService permanecem exatamente as mesmas] ...

class NotificationManager {
  constructor() {
    this.notificationContainer = document.createElement('div');
    this.notificationContainer.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      max-width: 350px;
      font-family: 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    `;
    document.body.appendChild(this.notificationContainer);
    this.injectStyles();
    this.createWatermark();
    this.createSidePanel();
  }

  injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* ... [Manter todos os outros estilos anteriores] ... */
      
      /* Novos estilos para a barra de tempo com gradiente roxo-azul */
      .notification-timer-bar {
        height: 100%;
        background: linear-gradient(90deg, #9c27b0, #2196F3);
        animation: timerBar linear forwards;
      }
      
      /* Ajustes no posicionamento do side panel */
      .side-panel {
        position: fixed;
        bottom: 80px;  /* Aumentado para ficar mais abaixo */
        right: 20px;
        z-index: 9997;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s ease;
      }
      
      /* Efeito hover mais destacado */
      .panel-button:hover {
        background: #2e2e2e;
        transform: translateX(-8px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
      }
    `;
    document.head.appendChild(style);
  }

  createWatermark() {
    const watermark = document.createElement('div');
    watermark.className = 'watermark';
    watermark.innerHTML = `
      <span class="watermark-phzzin">Phzzin </span>
      <span class="watermark-exdestroyer">ExDestroyer </span>
      <span class="watermark-scripts">Scripts</span>
    `;
    document.body.appendChild(watermark);
  }

  createSidePanel() {
    const panel = document.createElement('div');
    panel.className = 'side-panel';
    
    const instagramBtn = document.createElement('button');
    instagramBtn.className = 'panel-button instagram';
    instagramBtn.textContent = 'Instagram @kkjphzzin';
    instagramBtn.onclick = () => window.open('https://instagram.com/kkjphzzin', '_blank');
    
    const creditsBtn = document.createElement('button');
    creditsBtn.className = 'panel-button credits';
    creditsBtn.textContent = 'Créditos do Script';
    creditsBtn.onclick = () => {
      this.showNotification('Créditos', 'Script original por marcos10pc, modificado por DarkMode, customizado por AmmieNyami e personalizado por Phzzin', 'info');
    };
    
    panel.appendChild(instagramBtn);
    panel.appendChild(creditsBtn);
    document.body.appendChild(panel);
    
    // Mostrar o painel com delay
    setTimeout(() => panel.classList.add('show'), 2000);
  }

  getIcon(type) {
    const icons = {
      success: `<svg viewBox="0 0 24 24" fill="#4CAF50"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>`,
      error: `<svg viewBox="0 0 24 24" fill="#F44336"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>`,
      info: `<svg viewBox="0 0 24 24" fill="#2196F3"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>`,
      warning: `<svg viewBox="0 0 24 24" fill="#FF9800"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>`
    };
    return icons[type] || icons.info;
  }

  showNotification(title, message, type = 'info', duration = 5000) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    notification.innerHTML = `
      <div class="notification-icon">${this.getIcon(type)}</div>
      <div class="notification-content">
        <div class="notification-title">${title}</div>
        <div class="notification-message">${message}</div>
        <div class="notification-footer">Expansão Destroyer by Phzzin</div>
      </div>
      <div class="notification-timer"><div class="notification-timer-bar" style="animation-duration: ${duration/1000}s"></div></div>
    `;

    this.notificationContainer.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'notificationFadeOut 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55)';
      setTimeout(() => notification.remove(), 400);
    }, duration);
  }
}

// ... [O restante do código permanece exatamente o mesmo] ...
