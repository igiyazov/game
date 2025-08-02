// Современный ES6+ код для Vite
import Instance from './startup/Instance.js';

// Ждем загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎮 Starting Blackjack Game with Vite');
    new Instance();
});

// Fallback для старых браузеров
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new Instance();
    });
} else {
    // DOM уже загружен
    new Instance();
}
