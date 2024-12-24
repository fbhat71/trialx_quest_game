export default class Button {
    constructor(scene, x, y, text, options = {}) {
        const {
            width = 250,
            height = 60,
            fontSize = '32px',
            backgroundColor = 0x27ae60,
            textColor = '#ffffff'
        } = options;

        this.scene = scene;
        this.container = scene.add.container(x, y);

        // Background
        this.background = scene.add.rectangle(0, 0, width, height, backgroundColor)
            .setInteractive();

        // Text
        this.text = scene.add.text(0, 0, text, {
            fontSize: fontSize,
            fill: textColor,
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        this.container.add([this.background, this.text]);

        // Hover effects
        this.setupHoverEffects();
    }

    setupHoverEffects() {
        this.background.on('pointerover', () => {
            this.scene.tweens.add({
                targets: this.container,
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 100
            });
        });

        this.background.on('pointerout', () => {
            this.scene.tweens.add({
                targets: this.container,
                scaleX: 1,
                scaleY: 1,
                duration: 100
            });
        });
    }

    onClick(callback) {
        this.background.on('pointerdown', callback);
        return this;
    }

    destroy() {
        this.container.destroy();
    }
} 