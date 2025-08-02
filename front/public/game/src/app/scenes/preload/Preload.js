export default class extends Phaser.Scene {
    constructor(name) {
        super(name);
    }

    init() {
        let cx = this.cameras.main.centerX;
        let cy = this.cameras.main.centerY;

        let x = cx;
        let y = cy - 100;
        let logo = new Phaser.GameObjects.Sprite(this, x, y, 'preload_logo');
        this.add.existing(logo);

        x = cx;
        y = logo.getBounds().bottom + 50;
        let bar = new Phaser.GameObjects.Sprite(this, x, y, 'preload_bar');
        this.add.existing(bar);

        let width = bar.displayWidth;
        let height = bar.displayHeight;

        this.load.on('progress', (value) => {
            let scale = width * value;
            bar.setCrop(0, 0, scale, height);
        });
    }

    preload() {
        // fonts
        let fonts = ['roboto'];
        fonts.forEach((font) => this.load.bitmapFont(font, `fonts/${font}_0.png`, `fonts/${font}.fnt`));

        this.load.json('config', 'config.json');

        // audiosprites
        this.game.audio.load(this, ['sound', 'music']);

        // atlases
        this.load.setPath(`images`);
        this.load.multiatlas('atlas', `atlas.json?v=${Math.random()}`);

        // spine
        // this.load.setPath('spine');
        // this.load.spine('hero', 'hero.json', 'hero.atlas', true);
    }

    create() {
        this.game.audio.play('music', 'ost');
        this.scene.start('Game');
    }
}
