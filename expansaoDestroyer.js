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

// ========== Tela de Abertura ==========
function showIntroScreen() {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #000;
        z-index: 999999;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        opacity: 0;
        animation: fadeIn 1.5s ease-out forwards;
    `;

    const asciiArt = document.createElement('pre');
    asciiArt.textContent = `
▓█████▄ ▓█████   ██████ ▄▄▄█████▓ ██▀███   ▒█████ ▓██   ██▓▓█████  ██▀███  
▒██▀ ██▌▓█   ▀ ▒██    ▒ ▓  ██▒ ▓▒▓██ ▒ ██▒▒██▒  ██▒▒██  ██▒▓█   ▀ ▓██ ▒ ██▒
░██   █▌▒███   ░ ▓██▄   ▒ ▓██░ ▒░▓██ ░▄█ ▒▒██░  ██▒ ▒██ ██░▒███   ▓██ ░▄█ ▒
░▓█▄   ▌▒▓█  ▄   ▒   ██▒░ ▓██▓ ░ ▒██▀▀█▄  ▒██   ██░ ░ ▐██▓░▒▓█  ▄ ▒██▀▀█▄  
░▒████▓ ░▒████▒▒██████▒▒  ▒██▒ ░ ░██▓ ▒██▒░ ████▓▒░ ░ ██▒▓░░▒████▒░██▓ ▒██▒
 ▒▒▓  ▒ ░░ ▒░ ░▒ ▒▓▒ ▒ ░  ▒ ░░   ░ ▒▓ ░▒▓░░ ▒░▒░▒░   ██▒▒▒ ░░ ▒░ ░░ ▒▓ ░▒▓░
 ░ ▒  ▒  ░ ░  ░░ ░▒  ░ ░    ░      ░▒ ░ ▒░  ░ ▒ ▒░ ▓██ ░▒░  ░ ░  ░  ░▒ ░ ▒░
 ░ ░  ░    ░   ░  ░  ░    ░        ░░   ░ ░ ░ ░ ▒  ▒ ▒ ░░     ░     ░░   ░ 
   ░       ░  ░      ░              ░         ░ ░  ░ ░        ░  ░   ░     
 ░                                                 ░ ░                     
    `;
    asciiArt.style.cssText = `
        color: #fff;
        font-family: monospace;
        white-space: pre;
        text-align: center;
        margin: 0;
        font-size: 14px;
        line-height: 1.2;
        text-shadow: 0 0 10px #9c27b0;
    `;

    const injectButton = document.createElement('button');
    injectButton.textContent = 'INJECTAR';
    injectButton.style.cssText = `
        margin-top: 30px;
        padding: 12px 30px;
        background-color: #251b3a;
        color: white;
        border: 2px solid #2c244d;
        border-radius: 5px;
        font-size: 18px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 0 15px rgba(44, 36, 77, 0.7);
        position: relative;
        overflow: hidden;
    `;

    // Efeito hover do botão
    injectButton.addEventListener('mouseover', () => {
        injectButton.style.boxShadow = '0 0 25px rgba(44, 36, 77, 0.9)';
        injectButton.style.transform = 'scale(1.05)';
    });

    injectButton.addEventListener('mouseout', () => {
        injectButton.style.boxShadow = '0 0 15px rgba(44, 36, 77, 0.7)';
        injectButton.style.transform = 'scale(1)';
    });

    // Efeito de clique
    injectButton.addEventListener('click', () => {
        injectButton.style.transform = 'scale(0.95)';
        setTimeout(() => {
            overlay.style.animation = 'fadeOut 1s ease-in forwards';
            setTimeout(() => overlay.remove(), 1000);
            initActivityProcessor();
        }, 200);
    });

    overlay.appendChild(asciiArt);
    overlay.appendChild(injectButton);
    document.body.appendChild(overlay);

    // Adicionar estilos de animação
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        @keyframes pulse {
            0% { box-shadow: 0 0 15px rgba(44, 36, 77, 0.7); }
            50% { box-shadow: 0 0 25px rgba(44, 36, 77, 0.9); }
            100% { box-shadow: 0 0 15px rgba(44, 36, 77, 0.7); }
        }
    `;
    document.head.appendChild(style);
}

// ========== Classes Auxiliares ==========
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

// ========== Funcionalidades Principais ==========
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

// ========== Interface do Usuário ==========
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
        this.createMysteryButton();
        this.keysPressed = {};
        this.setupKeyListeners();
    }

    setupKeyListeners() {
        document.addEventListener('keydown', (e) => {
            this.keysPressed[e.key.toLowerCase()] = true;
        });
        
        document.addEventListener('keyup', (e) => {
            this.keysPressed[e.key.toLowerCase()] = false;
        });
    }

    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Estilo para os títulos dos cursos */
            body.dark-theme,
            body.dark-theme .activity-item .activityname,
            body.dark-theme .activity-item .instancename,
            body.dark-theme .sectionname,
            body.dark-theme .activitytitle,
            body.dark-theme .course-content,
            body.dark-theme .course-content *,
            body.dark-theme .activity-description,
            body.dark-theme .activity-description *,
            body.dark-theme .no-overflow,
            body.dark-theme .no-overflow *,
            body.dark-theme .card-text,
            body.dark-theme .card-text *,
            body.dark-theme .contentafterlink,
            body.dark-theme .contentafterlink *,
            body.dark-theme .activity-info,
            body.dark-theme .activity-info *,
            body.dark-theme .mod-indent-outer,
            body.dark-theme .mod-indent-outer *,
            body.dark-theme .activityinstance,
            body.dark-theme .activityinstance * {
                color: #e0e0e0 !important;
                text-shadow: 0 0 2px rgba(0,0,0,0.5) !important;
            }

            /* Dark theme styles */
            body.dark-theme {
                background-color: #121212 !important;
            }
            body.dark-theme #page,
            body.dark-theme #page-wrapper,
            body.dark-theme #page-content,
            body.dark-theme .card,
            body.dark-theme .activity-item,
            body.dark-theme .course-content,
            body.dark-theme .main-inner,
            body.dark-theme .activity-description,
            body.dark-theme .no-overflow,
            body.dark-theme .card-body,
            body.dark-theme .contentafterlink,
            body.dark-theme .activity-info,
            body.dark-theme .mod-indent-outer {
                background-color: #1e1e1e !important;
                border-color: #333 !important;
            }
            body.dark-theme .navbar,
            body.dark-theme .secondary-navigation {
                background-color: #121212 !important;
                border-color: #333 !important;
            }
            body.dark-theme a {
                color: #9c27b0 !important;
            }
            body.dark-theme .btn-secondary {
                background-color: #333 !important;
                border-color: #444 !important;
                color: #fff !important;
            }
            
            /* Notification styles */
            @keyframes notificationSlideIn {
                0% { transform: translateX(100%); opacity: 0; }
                100% { transform: translateX(0); opacity: 1; }
            }
            @keyframes notificationFadeOut {
                0% { transform: translateX(0); opacity: 1; }
                100% { transform: translateX(100%); opacity: 0; }
            }
            .notification {
                background: #1e1e1e;
                color: #f0f0f0;
                padding: 15px;
                margin-bottom: 15px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                animation: notificationSlideIn 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55);
                display: flex;
                align-items: center;
                position: relative;
                overflow: hidden;
                border-left: 4px solid;
            }
            .notification.success {
                border-left-color: #4CAF50;
            }
            .notification.error {
                border-left-color: #F44336;
            }
            .notification.info {
                border-left-color: #2196F3;
            }
            .notification.warning {
                border-left-color: #FF9800;
            }
            .notification-timer {
                position: absolute;
                bottom: 0;
                left: 0;
                height: 3px;
                background: rgba(255,255,255,0.1);
                width: 100%;
            }
            .notification-timer-bar {
                height: 100%;
                background: linear-gradient(90deg, #9c27b0, #2196F3);
                animation: timerBar linear forwards;
            }
            .notification-icon {
                width: 24px;
                height: 24px;
                margin-right: 15px;
                flex-shrink: 0;
            }
            .notification-content {
                flex-grow: 1;
            }
            .notification-title {
                font-weight: 600;
                margin-bottom: 5px;
                font-size: 15px;
                color: #ffffff;
            }
            .notification-message {
                font-size: 14px;
                color: #b0b0b0;
            }
            .notification-footer {
                font-size: 12px;
                margin-top: 5px;
                color: #888;
                font-style: italic;
            }
            @keyframes timerBar {
                from { width: 100%; }
                to { width: 0%; }
            }
            
            /* Watermark styles */
            .watermark {
                position: fixed;
                bottom: 20px;
                right: 20px;
                font-family: 'Segoe UI', Roboto, sans-serif;
                font-size: 18px;
                font-weight: bold;
                z-index: 9998;
                opacity: 0.9;
                text-shadow: 0 2px 4px rgba(0,0,0,0.5);
            }
            .watermark-phzzin {
                color: white;
            }
            .watermark-scripts {
                color: white;
            }
            
            /* Side panel styles */
            .side-panel {
                position: fixed;
                bottom: 80px;
                left: 20px;
                z-index: 9997;
                opacity: 0;
                transform: translateY(20px);
                transition: all 0.3s ease;
            }
            .side-panel.show {
                opacity: 1;
                transform: translateY(0);
            }
            .panel-button {
                background: #251b3a;
                color: white;
                border: 2px solid #2c244d;
                border-radius: 5px;
                padding: 10px 20px;
                margin: 5px 0;
                cursor: pointer;
                font-family: 'Segoe UI', Roboto, sans-serif;
                font-size: 14px;
                box-shadow: 0 0 10px rgba(44, 36, 77, 0.5);
                transition: all 0.2s ease;
                display: block;
                width: 150px;
                text-align: center;
            }
            .panel-button:hover {
                background: #2c244d;
                box-shadow: 0 0 15px rgba(44, 36, 77, 0.8);
            }
            .panel-button.credits {
                background: #251b3a;
                border-color: #2c244d;
            }
            .panel-button.theme-toggle {
                background: #251b3a;
                border-color: #2c244d;
            }

            /* Estilo do botão Pong */
            .mystery-button {
                background: #251b3a;
                color: white;
                border: 2px solid #2c244d;
                border-radius: 5px;
                padding: 10px 20px;
                margin: 5px 0;
                cursor: pointer;
                font-family: 'Segoe UI', Roboto, sans-serif;
                font-size: 14px;
                box-shadow: 0 0 10px rgba(44, 36, 77, 0.5);
                transition: all 0.2s ease;
                display: block;
                width: 150px;
                text-align: center;
                position: fixed;
                bottom: 20px;
                left: 20px;
                z-index: 9997;
            }
            
            .mystery-button:hover {
                background: #2c244d;
                box-shadow: 0 0 15px rgba(44, 36, 77, 0.8);
            }

            /* Modern Pong Game styles */
            .game-container {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 600px;
                height: 400px;
                background: rgba(37, 27, 58, 0.95);
                border: 2px solid #2c244d;
                border-radius: 10px;
                z-index: 10000;
                display: none;
                box-shadow: 0 0 30px rgba(44, 36, 77, 0.8);
                backdrop-filter: blur(5px);
                overflow: hidden;
            }
            
            .close-btn {
                position: absolute;
                top: 10px;
                right: 10px;
                background: #251b3a;
                color: white;
                border: 2px solid #2c244d;
                border-radius: 50%;
                width: 30px;
                height: 30px;
                cursor: pointer;
                z-index: 10001;
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 30px;
                text-align: center;
                transition: all 0.2s;
            }
            
            .close-btn:hover {
                background: #2c244d;
                transform: rotate(90deg);
            }
            
            .score-display {
                position: absolute;
                top: 20px;
                width: 100%;
                text-align: center;
                color: white;
                font-family: 'Courier New', monospace;
                font-size: 24px;
                text-shadow: 0 0 5px rgba(255,255,255,0.5);
            }
            
            .controls-info {
                position: absolute;
                bottom: 10px;
                width: 100%;
                text-align: center;
                color: rgba(255,255,255,0.7);
                font-family: 'Courier New', monospace;
                font-size: 14px;
            }
            
            .pong-ball {
                position: absolute;
                border-radius: 50%;
                background: #2c244d;
                box-shadow: 0 0 10px rgba(44, 36, 77, 0.7);
            }
            
            .pong-paddle {
                position: absolute;
                border-radius: 5px;
                background: #2c244d;
                box-shadow: 0 0 10px rgba(44, 36, 77, 0.5);
            }
            
            .game-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                background: rgba(0,0,0,0.7);
                z-index: 100;
            }
        `;
        document.head.appendChild(style);
    }

    createWatermark() {
        const watermark = document.createElement('div');
        watermark.className = 'watermark';
        watermark.innerHTML = `
            <span class="watermark-phzzin">Phzzin </span>
            <span class="watermark-scripts">Scripts</span>
        `;
        document.body.appendChild(watermark);
    }

    createSidePanel() {
        const panel = document.createElement('div');
        panel.className = 'side-panel';
        
        const themeBtn = document.createElement('button');
        themeBtn.className = 'panel-button theme-toggle';
        themeBtn.textContent = 'Alternar Tema Escuro';
        themeBtn.onclick = () => this.toggleDarkTheme();
        
        const creditsBtn = document.createElement('button');
        creditsBtn.className = 'panel-button credits';
        creditsBtn.textContent = 'Créditos do Script';
        creditsBtn.onclick = () => {
            this.showNotification('Créditos', 'Script original por marcos10pc, modificado por DarkMode, customizado por AmmieNyami e personalizado por Phzzin', 'info');
        };
        
        panel.appendChild(themeBtn);
        panel.appendChild(creditsBtn);
        document.body.appendChild(panel);
        
        setTimeout(() => panel.classList.add('show'), 2000);
    }

    createMysteryButton() {
        this.mysteryBtn = document.createElement('button');
        this.mysteryBtn.className = 'mystery-button panel-button';
        this.mysteryBtn.textContent = 'Pong';
        this.mysteryBtn.onclick = () => this.toggleGame();
        document.body.appendChild(this.mysteryBtn);
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
        closeBtn.textContent = '✕';
        closeBtn.onclick = () => this.closeGame();
        
        // Canvas do Pong
        const canvas = document.createElement('canvas');
        canvas.id = 'pongCanvas';
        canvas.width = 600;
        canvas.height = 400;
        
        // Display de pontuação
        const scoreDisplay = document.createElement('div');
        scoreDisplay.className = 'score-display';
        scoreDisplay.innerHTML = `
            <span class="player-score">0</span> : 
            <span class="computer-score">0</span>
        `;
        
        // Informações de controle
        const controlsInfo = document.createElement('div');
        controlsInfo.className = 'controls-info';
        controlsInfo.textContent = 'Controles: W (cima) e S (baixo)';
        
        this.gameContainer.appendChild(closeBtn);
        this.gameContainer.appendChild(scoreDisplay);
        this.gameContainer.appendChild(controlsInfo);
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
        const playerScoreDisplay = document.querySelector('.player-score');
        const computerScoreDisplay = document.querySelector('.computer-score');
        
        // Configurações do jogo - estilo moderno
        const paddleWidth = 15, paddleHeight = 100;
        const ballSize = 12;
        const maxScore = 5;
        
        // Posições iniciais
        let playerY = canvas.height / 2 - paddleHeight / 2;
        let computerY = canvas.height / 2 - paddleHeight / 2;
        let ballX = canvas.width / 2;
        let ballY = canvas.height / 2;
        
        // Velocidades ajustadas para ficar mais lento
        let ballSpeedX = 2.5;
        let ballSpeedY = 2.5;
        let computerSpeed = 2;
        
        // Pontuação
        let playerScore = 0;
        let computerScore = 0;
        let gameOver = false;
        
        // Controles WASD
        const handleKeyPress = () => {
            if (this.keysPressed['w'] && playerY > 0) {
                playerY -= 6;
            }
            if (this.keysPressed['s'] && playerY < canvas.height - paddleHeight) {
                playerY += 6;
            }
        };
        
        function draw() {
            // Fundo com gradiente escuro
            ctx.fillStyle = '#251b3a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Linha central tracejada
            ctx.strokeStyle = 'rgba(44, 36, 77, 0.5)';
            ctx.beginPath();
            ctx.setLineDash([10, 15]);
            ctx.moveTo(canvas.width / 2, 0);
            ctx.lineTo(canvas.width / 2, canvas.height);
            ctx.stroke();
            ctx.setLineDash([]);
            
            // Paddles
            ctx.fillStyle = '#2c244d';
            ctx.fillRect(0, playerY, paddleWidth, paddleHeight);
            ctx.fillRect(canvas.width - paddleWidth, computerY, paddleWidth, paddleHeight);
            
            // Bola
            ctx.beginPath();
            ctx.arc(ballX, ballY, ballSize, 0, Math.PI * 2);
            ctx.fillStyle = '#2c244d';
            ctx.fill();
            
            // Efeito de brilho
            ctx.shadowColor = 'rgba(44, 36, 77, 0.7)';
            ctx.shadowBlur = 15;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
        
        function update() {
            if (gameOver) return;
            
            handleKeyPress();
            
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
                ballSpeedX = -ballSpeedX * 1.05;
                
                // Efeito de mudança de cor na colisão
                ctx.shadowColor = 'rgba(44, 36, 77, 0.9)';
                setTimeout(() => ctx.shadowColor = 'rgba(44, 36, 77, 0.7)', 100);
            }
            
            if (ballX > canvas.width - paddleWidth - ballSize && 
                ballY > computerY && ballY < computerY + paddleHeight) {
                ballSpeedX = -ballSpeedX * 1.05;
                
                // Efeito de mudança de cor na colisão
                ctx.shadowColor = 'rgba(44, 36, 77, 0.9)';
                setTimeout(() => ctx.shadowColor = 'rgba(44, 36, 77, 0.7)', 100);
            }
            
            // Pontuação
            if (ballX < 0) {
                computerScore++;
                computerScoreDisplay.textContent = computerScore;
                checkGameOver();
                resetBall();
            }
            
            if (ballX > canvas.width) {
                playerScore++;
                playerScoreDisplay.textContent = playerScore;
                checkGameOver();
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
        
        function checkGameOver() {
            if (playerScore >= maxScore || computerScore >= maxScore) {
                gameOver = true;
                
                // Criar overlay de fim de jogo
                const gameOverlay = document.createElement('div');
                gameOverlay.className = 'game-overlay';
                
                const gameOverText = document.createElement('div');
                gameOverText.style.color = 'white';
                gameOverText.style.fontSize = '40px';
                gameOverText.style.fontFamily = 'Arial, sans-serif';
                gameOverText.style.textShadow = '0 0 10px rgba(255,255,255,0.5)';
                gameOverText.style.marginBottom = '20px';
                gameOverText.textContent = playerScore >= maxScore ? 'Você Venceu!' : 'Computador Venceu!';
                
                const restartText = document.createElement('div');
                restartText.style.color = 'rgba(255,255,255,0.7)';
                restartText.style.fontSize = '20px';
                restartText.style.fontFamily = 'Arial, sans-serif';
                restartText.textContent = 'Clique em ✕ para fechar';
                
                gameOverlay.appendChild(gameOverText);
                gameOverlay.appendChild(restartText);
                document.querySelector('.game-container').appendChild(gameOverlay);
            }
        }
        
        function resetBall() {
            if (gameOver) return;
            ballX = canvas.width / 2;
            ballY = canvas.height / 2;
            ballSpeedX = 2.5 * (Math.random() > 0.5 ? 1 : -1);
            ballSpeedY = 2.5 * (Math.random() > 0.5 ? 1 : -1);
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

    toggleDarkTheme() {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        this.showNotification('Tema Alterado', isDark ? 'Tema escuro ativado' : 'Tema escuro desativado', 'info');
        
        // Forçar texto branco nos elementos importantes
        const elements = document.querySelectorAll(
            `.activityname, .instancename, .sectionname, .activitytitle,
            .course-content, .course-content *, .activity-description,
            .activity-description *, .no-overflow, .no-overflow *,
            .card-text, .card-text *, .contentafterlink, .contentafterlink *,
            .activity-info, .activity-info *, .mod-indent-outer,
            .mod-indent-outer *, .activityinstance, .activityinstance *`
        );
        
        elements.forEach(el => {
            if (isDark) {
                el.style.color = '#e0e0e0';
                el.style.textShadow = '0 0 2px rgba(0,0,0,0.5)';
            } else {
                el.style.color = '';
                el.style.textShadow = '';
            }
        });
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
                <div class="notification-footer">Script by Phzzin</div>
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

// ========== Lógica Principal ==========
class ActivityProcessorUI {
    constructor(courseId) {
        this.requestManager = new RequestManager();
        this.examAutomator = new ExamAutomator();
        this.pageCompletionService = new PageCompletionService();
        this.notificationManager = new NotificationManager();

        this.courseId = courseId;
        this.isProcessing = false;

        this.notificationManager.showNotification('Script Iniciado!', 'Pronto para processar atividades!', 'success');
    }

    async processActivities() {
        if (this.isProcessing) {
            this.notificationManager.showNotification('Aviso', 'O processamento já está em andamento.', 'warning');
            return;
        }

        let hasRemaining = false;

        this.isProcessing = true;
        try {
            let coursePageDom = await this.requestManager.fetchWithRetry(`/course/view.php?id=${this.courseId}`)
                .then(response => {
                    if (!response.ok) {
                        this.notificationManager.showNotification('Erro', 'Não foi possível carregar o curso', 'error');
                        throw new Error('Unable to load course page');
                    }
                    return response.text();
                })
                .then(html => {
                    const parser = new DOMParser();
                    return parser.parseFromString(html, 'text/html');
                });

            const activities = Array.from(coursePageDom.querySelectorAll("li.activity"))
                .filter(activity => {
                    const completionButton = activity.querySelector(".completion-dropdown button");
                    return !completionButton || !completionButton.classList.contains("btn-success");
                });

            const simplePages = [];
            const exams = [];

            activities.forEach(activity => {
                const link = activity.querySelector("a.aalink");
                if (!link?.href) {
                    hasRemaining = true;
                    return;
                }

                const url = new URL(link.href);
                const pageId = url.searchParams.get("id");
                const activityName = link.textContent.trim();

                if (pageId) {
                    if (/responda|pause/i.test(activityName)) {
                        exams.push({ href: link.href, nome: activityName });
                    } else {
                        simplePages.push(pageId);
                    }
                }
            });

            if (simplePages.length > 0) {
                this.notificationManager.showNotification('Progresso', `Marcando ${simplePages.length} atividades como concluídas...`, 'info');
                await Promise.all(simplePages.map(pageId => 
                    this.pageCompletionService.markPageAsCompleted(pageId)
                ));
            }

            if (exams.length > 0) {
                const totalExams = exams.length;
                this.notificationManager.showNotification('Progresso', `Processando ${totalExams} exames...`, 'info');

                for (let i = 0; i < totalExams; i++) {
                    const exam = exams[i];
                    this.notificationManager.showNotification('Exame', `Processando: "${exam.nome}" (${i + 1}/${totalExams})`, 'info');
                    
                    await this.examAutomator.completeExam(exam.href);

                    if (i < totalExams - 1) {
                        await new Promise(resolve => setTimeout(resolve, 3000));
                    }
                }
            }

            if (simplePages.length === 0 && exams.length === 0) {
                this.notificationManager.showNotification('Concluído', 'Nenhuma atividade pendente encontrada.', 'info');
            } else {
                this.notificationManager.showNotification('Sucesso', 'Processamento concluído com sucesso!', 'success');
            }

            if (hasRemaining) {
                this.notificationManager.showNotification('Atividades Restantes', 'Foram encontradas atividades restantes. Processando-as!', 'warning');
                this.isProcessing = false;
                return this.processActivities();
            } else {
                this.notificationManager.showNotification('Finalizado', 'Atividades Finalizadas! | Caso Sobrar alguma execute novamente', 'success');
                setTimeout(() => {
                    location.reload();
                }, 1000);
            }
        } catch (error) {
            this.notificationManager.showNotification('Erro', 'Ocorreu um erro durante o processamento', 'error');
        } finally {
            this.isProcessing = false;
        }
    }
}

// ========== Inicialização ==========
function initActivityProcessor() {
    if (window.location.hostname !== 'expansao.educacao.sp.gov.br') {
        const notification = new NotificationManager();
        notification.showNotification('Erro', 'Este script só funciona no site da Expansão Educacional de SP', 'error');
        return;
    }

    if (window.location.pathname !== '/course/view.php') {
        const notification = new NotificationManager();
        notification.showNotification('Erro', 'Por favor selecione um curso antes de executar o script', 'error');
        return;
    }

    const processor = new ActivityProcessorUI((new URLSearchParams(window.location.search)).get("id"));
    
    setTimeout(() => {
        processor.processActivities();
    }, 1000);
}

// Mostrar tela de abertura primeiro
showIntroScreen();

// Inicialização original mantida para compatibilidade
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initActivityProcessor);
} else {
    initActivityProcessor();
}
