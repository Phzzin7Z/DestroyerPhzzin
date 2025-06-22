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

class UrlHelper {
  static extractUrlParam(url, paramName) {
    return new URL(url).searchParams.get(paramName);
  }

  static extractByRegex(text, regex) {
    const match = text.match(regex);
    return match?.[1];
  }

  static createUrl(baseUrl, path, params = {}) {
    const url = new URL(path, baseUrl);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
    return url.toString();
  }
}

class RequestManager {
  constructor(baseUrl = 'https://expansao.educacao.sp.gov.br', maxRetries = 3) {
    this.baseUrl = baseUrl;
    this.maxRetries = maxRetries;
    this.defaultHeaders = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
      'Upgrade-Insecure-Requests': '1',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'same-origin'
    };
  }

  async fetchWithRetry(url, options = {}, retries = this.maxRetries) {
    const fullUrl = url.startsWith('http') ? url : UrlHelper.createUrl(this.baseUrl, url);
    const response = await fetch(fullUrl, {
      credentials: 'include',
      headers: this.defaultHeaders,
      ...options
    });

    if (!response.ok && retries > 0) {
      const delay = Math.pow(2, this.maxRetries - retries) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
      return this.fetchWithRetry(url, options, retries - 1);
    }
    return response;
  }
}

class ExamAutomator {
  constructor() {
    this.requestManager = new RequestManager();
  }

  async fetchExamPage(examUrl) {
    const response = await this.requestManager.fetchWithRetry(examUrl);
    const pageText = await response.text();
    const contextId = UrlHelper.extractUrlParam(examUrl, 'id') || 
                     UrlHelper.extractByRegex(pageText, /contextInstanceId":(\d+)/);
    const sessKey = UrlHelper.extractByRegex(pageText, /sesskey":"([^"]+)/);
    
    return { contextId, sessKey };
  }

  async startExamAttempt(contextId, sessKey) {
    const formData = new URLSearchParams({
      cmid: contextId,
      sesskey: sessKey
    });

    const response = await this.requestManager.fetchWithRetry('/mod/quiz/startattempt.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
      redirect: 'follow'
    });

    const redirectUrl = response.url;
    const attemptId = UrlHelper.extractByRegex(redirectUrl, /attempt=(\d+)/);
    
    return { redirectUrl, attemptId };
  }

  async extractQuestionInfo(questionUrl) {
    const response = await this.requestManager.fetchWithRetry(questionUrl);
    const pageText = await response.text();
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(pageText, "text/html");

    const questionData = {
      questId: null,
      seqCheck: null,
      options: [],
      attempt: null,
      sesskey: null,
      formFields: {}
    };

    htmlDoc.querySelectorAll("input[type='hidden']").forEach(input => {
      const name = input.getAttribute("name");
      const value = input.getAttribute("value");
      if (!name) return;

      if (name.includes(":sequencecheck")) {
        questionData.questId = name.split(":")[0];
        questionData.seqCheck = value;
      } else if (name === "attempt") {
        questionData.attempt = value;
      } else if (name === "sesskey") {
        questionData.sesskey = value;
      } else if (["thispage", "nextpage", "timeup", "mdlscrollto", "slots"].includes(name)) {
        questionData.formFields[name] = value;
      }
    });

    htmlDoc.querySelectorAll("input[type='radio']").forEach(input => {
      const name = input.getAttribute("name");
      const value = input.getAttribute("value");
      if (name?.includes("_answer") && value !== "-1") {
        questionData.options.push({ name, value });
      }
    });

    return questionData;
  }

  async submitAnswer(questionData, contextId) {
    const selectedOption = questionData.options[
      Math.floor(Math.random() * questionData.options.length)
    ];

    const formData = new FormData();
    formData.append(`${questionData.questId}:1_:flagged`, "0");
    formData.append(`${questionData.questId}:1_:sequencecheck`, questionData.seqCheck);
    formData.append(selectedOption.name, selectedOption.value);
    formData.append("next", "Finalizar tentativa ...");
    formData.append("attempt", questionData.attempt);
    formData.append("sesskey", questionData.sesskey);
    formData.append("slots", "1");

    Object.entries(questionData.formFields).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const url = `/mod/quiz/processattempt.php?cmid=${contextId}`;
    const response = await this.requestManager.fetchWithRetry(url, {
      method: "POST",
      body: formData,
      redirect: "follow"
    });

    return {
      redirectUrl: response.url,
      attemptId: questionData.attempt,
      sesskey: questionData.sesskey
    };
  }

  async finishExamAttempt(attemptId, contextId, sesskey) {
    await this.requestManager.fetchWithRetry(
      `/mod/quiz/summary.php?attempt=${attemptId}&cmid=${contextId}`
    );

    const formData = new URLSearchParams({
      attempt: attemptId,
      finishattempt: "1",
      timeup: "0",
      slots: "",
      cmid: contextId,
      sesskey: sesskey
    });

    const response = await this.requestManager.fetchWithRetry('/mod/quiz/processattempt.php', {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
      redirect: "follow"
    });

    return response.url;
  }

  async completeExam(examUrl) {
    const { contextId, sessKey } = await this.fetchExamPage(examUrl);
    const { redirectUrl, attemptId } = await this.startExamAttempt(contextId, sessKey);
    const questionData = await this.extractQuestionInfo(redirectUrl);
    const { attemptId: finalAttemptId, sesskey } = await this.submitAnswer(questionData, contextId);
    
    return await this.finishExamAttempt(finalAttemptId, contextId, sesskey);
  }
}

class PageCompletionService {
  constructor() {
    this.requestManager = new RequestManager();
  }

  async markPageAsCompleted(pageId) {
    const url = `/mod/resource/view.php?id=${pageId}`;
    await this.requestManager.fetchWithRetry(url);
  }
}

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
      @keyframes notificationSlideIn {
        0% { transform: translateX(100%); opacity: 0; }
        100% { transform: translateX(0); opacity: 1; }
      }
      @keyframes notificationFadeOut {
        0% { transform: translateX(0); opacity: 1; }
        100% { transform: translateX(100%); opacity: 0; }
      }
      .notification {
        background: #111111; /* fundo preto escuro */
        color: #f0f0f0;
        padding: 15px;
        margin-bottom: 15px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.7);
        animation: notificationSlideIn 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55);
        display: flex;
        align-items: center;
        position: relative;
        overflow: hidden;
        border-left: 6px solid transparent; /* sem gradiente na borda */
        position: relative;
      }
      .notification-icon svg {
        fill: #ffffff !important;
      }
      .notification-timer {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 3px;
        background: rgba(255,255,255,0.15);
        width: 100%;
      }
      .notification-timer-bar {
        height: 100%;
        background: linear-gradient(90deg, #4b6cb7, #8a2be2);
        animation: timerBar linear forwards;
      }
      @keyframes timerBar {
        from { width: 100%; }
        to { width: 0%; }
      }

      /* Watermark styles */
      .watermark {
        position: fixed;
        bottom: 20px;
        left: 20px;
        font-family: 'Segoe UI', Roboto, sans-serif;
        font-size: 18px;
        font-weight: bold;
        z-index: 9998;
        opacity: 0.9;
        text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        user-select: none;
      }
      .watermark-phzzin {
        color: white;
      }
      .watermark-exdestroyer {
        background: linear-gradient(90deg, #9c27b0, #2196F3);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
      }
      .watermark-scripts {
        color: white;
      }
      
      /* Side panel styles */
      .side-panel {
        position: fixed;
        bottom: 80px; /* mais para baixo */
        left: 20px; /* move para o canto esquerdo */
        z-index: 9997;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s ease;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .side-panel.show {
        opacity: 1;
        transform: translateY(0);
      }
      .panel-button {
        background: #1e1e1e;
        color: white;
        border: none;
        border-radius: 20px;
        padding: 8px 16px;
        cursor: pointer;
        font-family: 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        transition: all 0.2s ease;
        display: block;
        width: 100%;
        text-align: left;
        user-select: none;
      }
      .panel-button:hover {
        background: #2e2e2e;
        transform: translateX(5px); /* hover desloca para a direita */
      }
      .panel-button.credits {
        background: linear-gradient(90deg, #1e1e1e, #333);
      }
      .panel-button.instagram {
        background: linear-gradient(90deg, #1e1e1e, #405DE6);
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
    
    // Show panel after delay
    setTimeout(() => panel.classList.add('show'), 2000);
  }

  getIcon(type) {
    const icons = {
      success: `<svg viewBox="0 0 24 24" fill="#ffffff"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>`,
      error: `<svg viewBox="0 0 24 24" fill="#ffffff"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>`,
      info: `<svg viewBox="0 0 24 24" fill="#ffffff"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>`,
      warning: `<svg viewBox="0 0 24 24" fill="#ffffff"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>`
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

class ActivityProcessorUI {
  constructor(courseId) {
    this.requestManager = new RequestManager();
    this.examAutomator = new ExamAutomator();
    this.pageCompletionService = new PageCompletionService();
    this.notificationManager = new NotificationManager();

    this.courseId = courseId;
    this.isProcessing = false;

    this.notificationManager.showNotification('Script Iniciado!', 'Expansão Destroyer iniciado com sucesso!', 'success');
  }

  async fetchCourseContent() {
    const url = `/course/view.php?id=${this.courseId}`;
    const response = await this.requestManager.fetchWithRetry(url);
    const text = await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/html");

    // Extração simplificada de IDs e URLs de atividades:
    // Pega todos os links que têm "mod" e "id" em query string
    const activities = [];
    doc.querySelectorAll('a').forEach(a => {
      const href = a.href;
      if (href.includes('mod/')) {
        const id = UrlHelper.extractUrlParam(href, 'id');
        if (id) {
          activities.push({
            id,
            url: href
          });
        }
      }
    });

    return activities;
  }

  async processActivity(activity) {
    try {
      if (activity.url.includes('quiz/startattempt.php')) {
        this.notificationManager.showNotification('Quiz detectado', `Processando quiz ID ${activity.id}`, 'info');
        const finalUrl = await this.examAutomator.completeExam(activity.url);
        this.notificationManager.showNotification('Quiz concluído', `Quiz ${activity.id} finalizado com sucesso!`, 'success');
        return finalUrl;
      } else if (activity.url.includes('resource/view.php')) {
        await this.pageCompletionService.markPageAsCompleted(activity.id);
        this.notificationManager.showNotification('Página marcada', `Página ${activity.id} marcada como concluída`, 'success');
      } else {
        this.notificationManager.showNotification('Atividade ignorada', `Tipo desconhecido para atividade ${activity.id}`, 'warning');
      }
    } catch (err) {
      this.notificationManager.showNotification('Erro', `Erro ao processar atividade ${activity.id}: ${err.message}`, 'error');
    }
  }

  async startProcessing() {
    if (this.isProcessing) {
      this.notificationManager.showNotification('Já em execução', 'O processamento já está em andamento.', 'warning');
      return;
    }
    this.isProcessing = true;

    const activities = await this.fetchCourseContent();

    for (const activity of activities) {
      await this.processActivity(activity);
      await new Promise(r => setTimeout(r, 1000)); // pequena pausa entre atividades
    }

    this.notificationManager.showNotification('Processamento concluído', 'Todas as atividades foram processadas.', 'success');
    this.isProcessing = false;
  }
}

// Inicia tudo automaticamente, substitua '123' pelo ID do curso que deseja processar
const courseId = 123; // trocar para o curso real
const processor = new ActivityProcessorUI(courseId);
processor.startProcessing();
