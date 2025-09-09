/*
 * Script Desativado - Acesso Negado
 * Por Phzzin
 */

// Limpar console
console.clear();
const noop = () => {};
console.warn = console.error = window.debug = noop;

// Função para criar a tela de acesso negado
function showAccessDenied() {
    // Criar overlay principal
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(-45deg, #0f0f23, #1a0d2e, #2d1b4e, #1e0a3c);
        background-size: 400% 400%;
        animation: gradientShift 8s ease infinite;
        z-index: 999999;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        opacity: 0;
        animation: fadeIn 2s ease-out forwards;
        overflow: hidden;
        font-family: 'Segoe UI', Roboto, Arial, sans-serif;
    `;

    // Efeito de partículas flutuantes
    const particlesContainer = document.createElement('div');
    particlesContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 0;
    `;

    // Gerar partículas
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 1}px;
            height: ${Math.random() * 4 + 1}px;
            background: rgba(156, 39, 176, ${Math.random() * 0.8 + 0.2});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${Math.random() * 15 + 10}s linear infinite;
            animation-delay: ${Math.random() * 5}s;
            box-shadow: 0 0 10px rgba(156, 39, 176, 0.5);
        `;
        particlesContainer.appendChild(particle);
    }

    // Container principal do conteúdo
    const contentContainer = document.createElement('div');
    contentContainer.style.cssText = `
        position: relative;
        z-index: 1;
        text-align: center;
        max-width: 600px;
        padding: 40px;
        background: rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(10px);
        border-radius: 20px;
        border: 1px solid rgba(156, 39, 176, 0.3);
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
    `;

    // Título "ACESSO NEGADO" com gradiente animado
    const title = document.createElement('h1');
    title.textContent = 'ACESSO NEGADO';
    title.style.cssText = `
        background: linear-gradient(45deg, #ff6b6b, #ee5a52, #ff8a80, #f06292, #ba68c8, #9c27b0);
        background-size: 300% 300%;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        animation: gradientText 4s ease infinite;
        font-size: 4rem;
        font-weight: 900;
        margin: 0 0 30px 0;
        letter-spacing: 3px;
        text-shadow: 0 0 30px rgba(156, 39, 176, 0.5);
        transform: translateY(-20px);
        animation: titleAppear 1.5s ease-out 0.5s both, gradientText 4s ease infinite 1.5s;
    `;

    // Ícone de bloqueio
    const lockIcon = document.createElement('div');
    lockIcon.innerHTML = `
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <circle cx="12" cy="16" r="1"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
    `;
    lockIcon.style.cssText = `
        color: #9c27b0;
        margin: 20px 0;
        opacity: 0;
        transform: scale(0);
        animation: iconAppear 1s ease-out 1s both;
        filter: drop-shadow(0 0 20px rgba(156, 39, 176, 0.7));
    `;

    // Mensagem explicativa
    const message = document.createElement('p');
    message.textContent = 'O desenvolvedor desativou este script permanentemente';
    message.style.cssText = `
        color: rgba(255, 255, 255, 0.9);
        font-size: 1.4rem;
        font-weight: 300;
        margin: 30px 0 20px 0;
        line-height: 1.6;
        opacity: 0;
        transform: translateY(20px);
        animation: messageAppear 1s ease-out 1.5s both;
    `;

    // Submensagem
    const subMessage = document.createElement('p');
    subMessage.textContent = 'Entre em contato para mais informações';
    subMessage.style.cssText = `
        color: rgba(255, 255, 255, 0.6);
        font-size: 1.1rem;
        font-weight: 300;
        margin: 0;
        opacity: 0;
        transform: translateY(20px);
        animation: messageAppear 1s ease-out 2s both;
    `;

    // Botão de fechar
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Fechar';
    closeButton.style.cssText = `
        margin-top: 40px;
        padding: 15px 35px;
        background: linear-gradient(45deg, #9c27b0, #e91e63);
        color: white;
        border: none;
        border-radius: 30px;
        font-size: 1.1rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 8px 25px rgba(156, 39, 176, 0.4);
        opacity: 0;
        transform: translateY(20px);
        animation: messageAppear 1s ease-out 2.5s both;
        text-transform: uppercase;
        letter-spacing: 1px;
    `;

    // Efeitos do botão
    closeButton.addEventListener('mouseover', () => {
        closeButton.style.transform = 'translateY(-3px) scale(1.05)';
        closeButton.style.boxShadow = '0 15px 35px rgba(156, 39, 176, 0.6)';
    });

    closeButton.addEventListener('mouseout', () => {
        closeButton.style.transform = 'translateY(0) scale(1)';
        closeButton.style.boxShadow = '0 8px 25px rgba(156, 39, 176, 0.4)';
    });

    closeButton.addEventListener('click', () => {
        overlay.style.animation = 'fadeOut 1s ease-in forwards';
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.remove();
            }
        }, 1000);
    });

    // Montar a estrutura
    contentContainer.appendChild(title);
    contentContainer.appendChild(lockIcon);
    contentContainer.appendChild(message);
    contentContainer.appendChild(subMessage);
    contentContainer.appendChild(closeButton);
    
    overlay.appendChild(particlesContainer);
    overlay.appendChild(contentContainer);
    document.body.appendChild(overlay);

    // Estilos de animação
    const style = document.createElement('style');
    style.textContent = `
        @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        
        @keyframes gradientText {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        
        @keyframes titleAppear {
            from { 
                opacity: 0; 
                transform: translateY(-50px) scale(0.8); 
            }
            to { 
                opacity: 1; 
                transform: translateY(0) scale(1); 
            }
        }
        
        @keyframes iconAppear {
            from { 
                opacity: 0; 
                transform: scale(0) rotate(-180deg); 
            }
            to { 
                opacity: 1; 
                transform: scale(1) rotate(0deg); 
            }
        }
        
        @keyframes messageAppear {
            from { 
                opacity: 0; 
                transform: translateY(30px); 
            }
            to { 
                opacity: 1; 
                transform: translateY(0); 
            }
        }
        
        @keyframes float {
            0%, 100% { 
                transform: translateY(0px) rotate(0deg); 
                opacity: 0.3;
            }
            33% { 
                transform: translateY(-20px) rotate(120deg); 
                opacity: 0.8;
            }
            66% { 
                transform: translateY(-40px) rotate(240deg); 
                opacity: 0.5;
            }
        }
        
        @keyframes pulse {
            0%, 100% { 
                box-shadow: 0 8px 25px rgba(156, 39, 176, 0.4); 
            }
            50% { 
                box-shadow: 0 15px 35px rgba(156, 39, 176, 0.7); 
            }
        }
    `;
    document.head.appendChild(style);

    // Auto-fechar após 30 segundos
    setTimeout(() => {
        if (overlay.parentNode) {
            overlay.style.animation = 'fadeOut 1s ease-in forwards';
            setTimeout(() => overlay.remove(), 1000);
        }
    }, 30000);
}

// Verificar se está no site correto e mostrar a mensagem
function init() {
    // Mostrar a tela de acesso negado independentemente de onde estiver
    setTimeout(() => {
        showAccessDenied();
    }, 500);
}

// Inicializar quando a página carregar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
