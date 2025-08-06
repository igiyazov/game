import Hand from '../hands/Hand';
import Result from '../popups/Result';
import ApiClient from '../../../../core/ApiClient';

export default class Controller {
    constructor(scene) {
        this.scene = scene;
        this.scene.events.once('shutdown', this.destroy, this);

        this.rules = this.scene.cache.json.get('config');

        this.credits = this.rules.credits;
        this.maxbet = this.rules.maxbet;

        this.currentBet = 0;
        this.hands = {};

        // Создаем API клиент
        this.apiClient = new ApiClient();

        this.scene.events.on('add_bet', this.onAddBet, this);
        this.scene.events.on('clear_bet', this.onClearBet, this);
        this.scene.events.on('start_game', this.deal, this);
        this.scene.events.on('hit', this.onHit, this);
        this.scene.events.on('stop', this.onStop, this);

        this.scene.events.emit('set_maxbet', this.maxbet);
    }

    startRound() {
        this.currentBet = 0;
        this.scene.events.emit('show_betting_controls');
        this.scene.events.emit('enable_betting');
        this.scene.events.emit('update_credits', this.credits);
        this.scene.events.emit('update_bet', this.currentBet);
        this.scene.events.emit('clear_stack');
    }

    onAddBet(chip) {
        if (this.currentBet + chip.value > this.maxbet) {
            chip.showError();
        } else if (this.credits < chip.value) {
            chip.showError();
        } else {
            this.scene.game.audio.play('sound', 'chip');
            this.credits -= chip.value;
            this.currentBet += chip.value;
            this.scene.events.emit('update_credits', this.credits);
            this.scene.events.emit('update_bet', this.currentBet);
            this.scene.events.emit('add_chip', chip.value);
        }
    }

    async deal() {
        this.scene.events.emit('disable_betting');
        this.scene.events.emit('show_gameplay_controls');

        await this.scene.game.utils.wait(500);

        try {
            // Начинаем новую игру через API
            const gameData = await this.apiClient.startGame();
            
            // Создаем руки для отображения
            this.hands.player = new Hand(this.scene, 720);
            this.hands.dealer = new Hand(this.scene, 220);

            // Отображаем карты игрока
            for (const card of gameData.player_cards) {
                this.hands.player.addCard(card);
                await this.hands.player.shiftCards();
                await this.scene.game.utils.wait(200);
            }
            // Обновляем счет игрока от API
            this.hands.player.updateSum(gameData.player_score);

            await this.scene.game.utils.wait(500);

            // Отображаем карты дилера
            for (const card of gameData.dealer_cards) {
                this.hands.dealer.addCard(card);
                await this.hands.dealer.shiftCards();
                await this.scene.game.utils.wait(200);
            }
            // Обновляем счет дилера от API
            this.hands.dealer.updateSum(gameData.dealer_score);

            // Проверяем статус игры
            if (gameData.status !== 'playing') {
                await this.handleGameEnd(gameData);
                return;
            }

            this.scene.events.emit('enable_gameplay_controls');

        } catch (error) {
            console.error('Ошибка при начале игры:', error);
            // Возвращаемся к ставкам при ошибке
            this.scene.events.emit('show_betting_controls');
            this.scene.events.emit('enable_betting');
        }
    }

    async onHit() {
        this.scene.events.emit('disable_gameplay_controls');

        try {
            // Берем карту через API
            const result = await this.apiClient.hit();
            
            // Добавляем новую карту игроку (последняя в массиве)
            const newCard = result.player_cards[result.player_cards.length - 1];
            this.hands.player.addCard(newCard);
            await this.hands.player.shiftCards();
            // Обновляем счет игрока от API
            this.hands.player.updateSum(result.player_score);

            // Проверяем статус игры
            if (result.status !== 'playing') {
                await this.handleGameEnd(result);
                return;
            }

            await this.scene.game.utils.wait(500);
            this.scene.events.emit('enable_gameplay_controls');

        } catch (error) {
            console.error('Ошибка при взятии карты:', error);
            this.scene.events.emit('enable_gameplay_controls');
        }
    }

    async onStop() {
        this.scene.events.emit('disable_gameplay_controls');

        await this.scene.game.utils.wait(500);

        try {
            // Завершаем ход через API
            const result = await this.apiClient.stand();
            
            // Отображаем карты дилера, если появились новые
            const currentDealerCards = this.hands.dealer.cards.length;
            if (result.dealer_cards.length > currentDealerCards) {
                for (let i = currentDealerCards; i < result.dealer_cards.length; i++) {
                    this.hands.dealer.addCard(result.dealer_cards[i]);
                    await this.hands.dealer.shiftCards();
                    await this.scene.game.utils.wait(500);
                }
            }
            // Обновляем счет от API
            this.hands.player.updateSum(result.player_score);
            this.hands.dealer.updateSum(result.dealer_score);

            await this.handleGameEnd(result);

        } catch (error) {
            console.error('Ошибка при завершении хода:', error);
            this.scene.events.emit('enable_gameplay_controls');
        }
    }

    async handleGameEnd(result) {
        await this.scene.game.utils.wait(1000);

        let resultType;
        switch (result.status) {
            case 'win':
                resultType = 'win';
                this.scene.game.audio.play('sound', 'win');
                this.credits += this.currentBet * 2;
                break;
            case 'draw':
                resultType = 'draw';
                this.scene.game.audio.play('sound', 'win');
                this.credits += this.currentBet;
                break;
            case 'lose':
            case 'bust':
                resultType = 'lose';
                // Кредиты уже списаны при ставке
                break;
        }

        let resultPopup = new Result(this.scene, resultType);
        await resultPopup.show();
        resultPopup.destroy();

        await this.clearHands();
        this.apiClient.resetGame();
        this.startRound();
    }

    async clearHands() {
        if (this.hands.player) {
            await this.hands.player.clear();
            this.hands.player.destroy();
        }
        if (this.hands.dealer) {
            await this.hands.dealer.clear();
            this.hands.dealer.destroy();
        }
    }

    onClearBet() {
        this.credits += this.currentBet;
        this.currentBet = 0;
        this.scene.events.emit('update_credits', this.credits);
        this.scene.events.emit('update_bet', this.currentBet);
    }

    destroy() {
        this.scene.events.off('add_bet', this.onAddBet, this);
        this.scene.events.off('clear_bet', this.onClearBet, this);
        this.scene.events.off('start_game', this.deal, this);
        this.scene.events.off('hit', this.onHit, this);
        this.scene.events.off('stop', this.onStop, this);
    }
}
