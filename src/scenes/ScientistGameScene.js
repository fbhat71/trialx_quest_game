// ScientistGameScene.js (already provided)
class ScientistGameScene extends Phaser.Scene {
    constructor() {
        super('ScientistGameScene');
    }

    preload() {
        // Preload assets like images, sounds, etc.
        this.load.image('taskIcon', '/home/tabinda/Downloads/img.png');  // Icon for tasks
        this.load.image('bg', '/home/tabinda/Downloads/img.png');  // Background image
    }

    create() {
        // Set up the background
        this.add.image(600, 400, 'bg');

        // Title of the scene
        this.add.text(600, 50, 'Scientist Game: Research & Discover', {
            fontSize: '48px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            fontWeight: 'bold'
        }).setOrigin(0.5);

        // Description for the game
        this.add.text(600, 150, 'Design innovative clinical trials\nAnalyze data to advance medicine\nUnlock new research discoveries', {
            fontSize: '28px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            align: 'center',
            lineSpacing: 20
        }).setOrigin(0.5);

        // Task Button - Simulate a task to design clinical trials
        const designTaskBtn = this.add.text(600, 300, 'Design Clinical Trials', {
            fontSize: '32px',
            fill: '#ff9f00',
            fontFamily: 'Arial',
            fontWeight: 'bold'
        }).setOrigin(0.5).setInteractive();

        // Button interaction for the task
        designTaskBtn.on('pointerdown', () => {
            this.simulateDesignTask();
        });

        // Task Button - Simulate analyzing data
        const analyzeDataBtn = this.add.text(600, 400, 'Analyze Data', {
            fontSize: '32px',
            fill: '#1f77b4',
            fontFamily: 'Arial',
            fontWeight: 'bold'
        }).setOrigin(0.5).setInteractive();

        analyzeDataBtn.on('pointerdown', () => {
            this.simulateDataAnalysis();
        });

        // Task Button - Simulate unlocking new discoveries
        const unlockDiscoveryBtn = this.add.text(600, 500, 'Unlock Discoveries', {
            fontSize: '32px',
            fill: '#2ecc71',
            fontFamily: 'Arial',
            fontWeight: 'bold'
        }).setOrigin(0.5).setInteractive();

        unlockDiscoveryBtn.on('pointerdown', () => {
            this.simulateDiscovery();
        });

        // Back Button to Role Selection
        const backButton = this.add.text(600, 600, 'Back to Role Selection', {
            fontSize: '24px',
            fill: '#e74c3c',
            fontFamily: 'Arial',
            fontWeight: 'bold'
        }).setOrigin(0.5).setInteractive();

        backButton.on('pointerdown', () => {
            this.scene.start('RoleSelectionScene');  // Return to the role selection scene
        });
    }

    // Simulate the clinical trial design task
    simulateDesignTask() {
        this.add.text(600, 700, 'Designing Clinical Trials... Success!', {
            fontSize: '24px',
            fill: '#f1c40f',
            fontFamily: 'Arial',
            fontWeight: 'bold'
        }).setOrigin(0.5);
    }

    // Simulate data analysis task
    simulateDataAnalysis() {
        this.add.text(600, 700, 'Analyzing Data... Data Cleared!', {
            fontSize: '24px',
            fill: '#3498db',
            fontFamily: 'Arial',
            fontWeight: 'bold'
        }).setOrigin(0.5);
    }

    // Simulate a research discovery task
    simulateDiscovery() {
        this.add.text(600, 700, 'Unlocking New Discoveries... Breakthrough!', {
            fontSize: '24px',
            fill: '#2ecc71',
            fontFamily: 'Arial',
            fontWeight: 'bold'
        }).setOrigin(0.5);
    }
}

// RoleSelectionScene.js
class RoleSelectionScene extends Phaser.Scene {
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
            0x8e44ad, 0x2980b9, 'ScientistGameScene'  // Use ScientistGameScene here
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
                    this.scene.start(nextScene); // Move to next scene
                }
            });
        });

        // Add all elements to the card
        card.add([cardBg, icon, roleTitle, roleDescription, startBtn]);

        return card;
    }
}

// Game Configuration
const config = {
    type: Phaser.AUTO,
    width: 1200,
    height: 800,
    scene: [RoleSelectionScene, ScientistGameScene],  // Make sure both scenes are included here
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    }
};

const game = new Phaser.Game(config);
