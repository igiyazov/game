import { sumBy } from 'lodash';
import Card from '../cards/Card';

export default class Hand extends Phaser.GameObjects.Container {
    constructor(scene, positionY) {
        super(scene, 0, 0);
        this.scene.layers.cards.add(this);

        this.cards = [];
        this.positionY = positionY;
        
        // Счет очков от API (будет обновляться)
        this._score = 0;

        this.setup();
    }

    setup() {
        this.shadow = this.scene.add.bitmapText(362, this.positionY - 113, 'roboto', '', 46, 1);
        this.shadow.setOrigin(0.5);
        this.shadow.setTint(0x000000);
        this.add(this.shadow);

        this.label = this.scene.add.bitmapText(360, this.positionY - 115, 'roboto', '', 46, 1);
        this.label.setOrigin(0.5);
        this.add(this.label);
    }

    addCard(config) {
        let x = 800;
        let y = this.positionY;

        let card = new Card(this.scene, x, y, config);
        this.add(card);
        this.cards.push(card);
    }

    async shiftCards() {
        let jobs = [];

        let width = 120;
        let offsetX = (720 - this.cards.length * width) / 2 + width / 2;
        let offsetY = this.positionY;

        this.cards.forEach((card, index) => {
            let x = offsetX + index * width;
            let y = offsetY;
            jobs.push(card.move(x, y));
        });

        await Promise.all(jobs);

        this.updateSum();
    }

    /**
     * Обновить отображение суммы очков
     * @param {number} score - Счет от API (опционально)
     */
    updateSum(score = null) {
        if (score !== null) {
            this._score = score;
        } else {
            // Если счет не передан, вычисляем локально (для совместимости)
            this._score = this.calculateLocalSum();
        }
        
        this.shadow.setText(this._score);
        this.label.setText(this._score);
    }

    /**
     * Локальный подсчет очков (для совместимости)
     */
    calculateLocalSum() {
        if (this.cards.length === 2 && sumBy(this.cards, 'value') === 22) return 21;
        return sumBy(this.cards, 'value');
    }

    async clear() {
        let jobs = [];
        let dist = -720;

        this.cards.forEach((card) => jobs.push(card.move(card.x + dist, card.y)));

        await Promise.all(jobs);
    }

    /**
     * Получить текущую сумму очков
     */
    get sum() {
        return this._score || this.calculateLocalSum();
    }

    /**
     * Проверить перебор
     */
    get bust() {
        return this.sum > 21;
    }
}
