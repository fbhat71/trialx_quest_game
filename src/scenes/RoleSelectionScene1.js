import Phaser from 'phaser';

export default class RoleSelectionScene extends Phaser.Scene {
    constructor() {
        super('RoleSelectionScene');
    }

    create() {
        // Background with gradient
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x1a2a3f, 0x1a2a3f, 0x0f1c2d, 0x0f1c2d, 1);
        bg.fillRect(0, 0, 1200, 800);

        // Title
        this.add.text(600, 100, 'Select Your Role', {
            fontSize: '64px',
            fill: '#fff',
            fontFamily: 'Arial',
            fontWeight: 'bold'
        }).setOrigin(0.5);

        // Create doctor role card
        const doctorCard = this.createRoleCard(400, 400, 'Doctor',
            'Recruit patients for clinical trials\nManage patient satisfaction\nEarn rewards for successful trials',
            0x34495e, 0x27ae60, 'TrialSelectionScene'
        );

        // Create scientist role card
        const scientistCard = this.createRoleCard(800, 400, 'Scientist',
            'Design innovative clinical trials\nAnalyze data to advance medicine\nUnlock new research discoveries',
            0x8e44ad, 0x2980b9, 'ResearchSelectionScene'
        );

        // Entrance animations for both cards
        doctorCard.setScale(0);
        scientistCard.setScale(0);

        this.tweens.add({
            targets: doctorCard,
            scaleX: 1,
            scaleY: 1,
            duration: 500,
            ease: 'Back.out',
        });

        this.tweens.add({
            targets: scientistCard,
            scaleX: 1,
            scaleY: 1,
            duration: 500,
            ease: 'Back.out',
            delay: 200,
        });
    }

    createRoleCard(x, y, role, description, cardColor, buttonColor, nextScene) {
        const card = this.add.container(x, y);

        // Card background
        const cardBg = this.add.rectangle(0, 0, 400, 500, cardColor)
            .setInteractive()
            .setStrokeStyle(4, 0xffffff);

        // Role icon placeholder
        const icon = this.add.graphics();
        icon.fillStyle(0xffffff);
        icon.fillCircle(0, -100, 40);

        // Role title
        const roleTitle = this.add.text(0, -30, role, {
            fontSize: '48px',
            fill: '#fff',
            fontFamily: 'Arial',
            fontWeight: 'bold'
        }).setOrigin(0.5);

        // Role description
        const roleDescription = this.add.text(0, 60, description, {
            fontSize: '24px',
            fill: '#fff',
            fontFamily: 'Arial',
            align: 'center',
            lineSpacing: 15
        }).setOrigin(0.5);

        // Start button
        const startBtn = this.add.container(0, 200);
        const btnBg = this.add.rectangle(0, 0, 250, 60, buttonColor)
            .setInteractive();
        const btnText = this.add.text(0, 0, 'Start Game', {
            fontSize: '32px',
            fill: '#fff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        startBtn.add([btnBg, btnText]);

        // Button interaction
        btnBg.on('pointerover', () => {
            this.tweens.add({
                targets: startBtn,
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 100
            });
        }).on('pointerout', () => {
            this.tweens.add({
                targets: startBtn,
                scaleX: 1,
                scaleY: 1,
                duration: 100
            });
        });

        btnBg.on('pointerdown', () => {
            this.tweens.add({
                targets: card,
                scaleX: 0,
                scaleY: 0,
                duration: 300,
                ease: 'Back.in',
                onComplete: () => {
                    this.scene.start(nextScene);
                }
            });
        });

        // Add all elements to the card
        card.add([cardBg, icon, roleTitle, roleDescription, startBtn]);

        return card;
    }
}