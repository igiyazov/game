import axios from 'axios';

export default class ApiClient {
    constructor() {
        this.baseURL = 'http://localhost:8000';
        
        // Создаем экземпляр axios с базовой конфигурацией
        this.client = axios.create({
            baseURL: this.baseURL,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            }
        });

        // Текущий ID игры
        this.gameId = null;
    }

    /**
     * Начать новую игру
     * @returns {Promise<Object>} Данные о начале игры
     */
    async startGame() {
        try {
            const response = await this.client.post('/api/game/start');
            this.gameId = response.data.game_id;
            return response.data;
        } catch (error) {
            console.error('Ошибка при начале игры:', error);
            throw error;
        }
    }

    /**
     * Взять дополнительную карту
     * @returns {Promise<Object>} Результат действия
     */
    async hit() {
        if (!this.gameId) {
            throw new Error('Игра не начата. Вызовите startGame() сначала.');
        }

        try {
            const response = await this.client.post(`/api/game/hit?game_id=${this.gameId}`);
            return response.data;
        } catch (error) {
            console.error('Ошибка при взятии карты:', error);
            throw error;
        }
    }

    /**
     * Завершить ход игрока (stand)
     * @returns {Promise<Object>} Результат игры
     */
    async stand() {
        if (!this.gameId) {
            throw new Error('Игра не начата. Вызовите startGame() сначала.');
        }

        try {
            const response = await this.client.post(`/api/game/stand?game_id=${this.gameId}`);
            return response.data;
        } catch (error) {
            console.error('Ошибка при завершении хода:', error);
            throw error;
        }
    }

    /**
     * Получить текущее состояние игры
     * @returns {Promise<Object>} Статус игры
     */
    async getGameStatus() {
        if (!this.gameId) {
            throw new Error('Игра не начата. Вызовите startGame() сначала.');
        }

        try {
            const response = await this.client.get(`/api/game/status?game_id=${this.gameId}`);
            return response.data;
        } catch (error) {
            console.error('Ошибка при получении статуса игры:', error);
            throw error;
        }
    }

    /**
     * Сбросить текущую игру
     */
    resetGame() {
        this.gameId = null;
    }

    /**
     * Получить ID текущей игры
     * @returns {number|null} ID игры
     */
    getCurrentGameId() {
        return this.gameId;
    }
} 