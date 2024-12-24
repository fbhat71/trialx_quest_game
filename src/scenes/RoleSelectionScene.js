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
        
        // Title - moved down a bit
        this.add.text(600, 150, 'Select Your Role', {
            fontSize: '64px',
            fill: '#fff',
            fontFamily: 'Arial',
            fontWeight: 'bold'
        }).setOrigin(0.5);

        // Adjust doctor card position to the left
        const doctorCard = this.add.container(400, 400);
        
        // Card background - made larger
        const cardBg = this.add.rectangle(0, 0, 400, 500, 0x34495e)
            .setInteractive()
            .setStrokeStyle(4, 0x3498db);

        // Doctor icon - made larger
        const doctorGraphics = this.add.graphics();
        doctorGraphics.fillStyle(0xffffff);
        doctorGraphics.fillRect(-24, -36, 48, 72);
        doctorGraphics.fillStyle(0xffdbac);
        doctorGraphics.fillCircle(0, -45, 12);
        doctorGraphics.fillStyle(0x4a4a4a);
        doctorGraphics.fillRect(-24, -54, 48, 9);
        doctorGraphics.lineStyle(2, 0x4a4a4a);
        doctorGraphics.strokeCircle(0, -45, 12);

        // Role title - adjusted position and size
        const roleTitle = this.add.text(0, 80, 'Doctor', {
            fontSize: '48px',
            fill: '#fff',
            fontFamily: 'Arial',
            fontWeight: 'bold'
        }).setOrigin(0.5);

        // Role description - adjusted position and size
        const description = this.add.text(0, 160, 
            'Recruit patients for clinical trials\nManage patient satisfaction\nEarn rewards for successful trials', {
            fontSize: '24px',
            fill: '#fff',
            fontFamily: 'Arial',
            align: 'center',
            lineSpacing: 15
        }).setOrigin(0.5);

        // Start button - made larger and adjusted position
        const startBtn = this.add.container(0, 300);
        const btnBg = this.add.rectangle(0, 0, 250, 60, 0x27ae60)
            .setInteractive();
        const btnText = this.add.text(0, 0, 'Start Game', {
            fontSize: '32px',
            fill: '#fff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        startBtn.add([btnBg, btnText]);

        // Add all elements to the card
        doctorCard.add([cardBg, doctorGraphics, roleTitle, description, startBtn]);

        // Add hover effects
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

        cardBg.on('pointerover', () => {
            this.tweens.add({
                targets: doctorCard,
                y: 390,
                duration: 200
            });
        }).on('pointerout', () => {
            this.tweens.add({
                targets: doctorCard,
                y: 400,
                duration: 200
            });
        });

        // Start game on button click
        btnBg.on('pointerdown', () => {
            this.tweens.add({
                targets: doctorCard,
                scaleX: 0,
                scaleY: 0,
                duration: 300,
                ease: 'Back.in',
                onComplete: () => {
                    this.scene.start('TrialSelectionScene');
                }
            });
        });

        // Entrance animation
        doctorCard.setScale(0);
        this.tweens.add({
            targets: doctorCard,
            scaleX: 1,
            scaleY: 1,
            duration: 500,
            ease: 'Back.out'
        });

        // Create patient volunteer card
        const patientCard = this.add.container(800, 400);
        
        // Card background
        const patientCardBg = this.add.rectangle(0, 0, 400, 500, 0x34495e)
            .setInteractive()
            .setStrokeStyle(4, 0x3498db);

        // Patient volunteer icon
        const patientGraphics = this.add.graphics();
        patientGraphics.fillStyle(0xffffff);
        patientGraphics.fillRect(-24, -36, 48, 72);
        patientGraphics.fillStyle(0xffdbac);
        patientGraphics.fillCircle(0, -45, 12);
        patientGraphics.lineStyle(2, 0x4a4a4a);
        patientGraphics.strokeCircle(0, -45, 12);

        // Role title
        const patientRoleTitle = this.add.text(0, 80, 'Patient Volunteer', {
            fontSize: '48px',
            fill: '#fff',
            fontFamily: 'Arial',
            fontWeight: 'bold'
        }).setOrigin(0.5);

        // Role description
        const patientDescription = this.add.text(0, 160, 
            'Participate in clinical trials\nTrack your health progress\nEarn rewards for participation', {
            fontSize: '24px',
            fill: '#fff',
            fontFamily: 'Arial',
            align: 'center',
            lineSpacing: 15
        }).setOrigin(0.5);

        // Start button
        const patientStartBtn = this.add.container(0, 300);
        const patientBtnBg = this.add.rectangle(0, 0, 250, 60, 0x27ae60)
            .setInteractive();
        const patientBtnText = this.add.text(0, 0, 'Start Game', {
            fontSize: '32px',
            fill: '#fff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        patientStartBtn.add([patientBtnBg, patientBtnText]);

        // Add all elements to the patient card
        patientCard.add([patientCardBg, patientGraphics, patientRoleTitle, patientDescription, patientStartBtn]);

        // Add hover effects for patient card
        patientBtnBg.on('pointerover', () => {
            this.tweens.add({
                targets: patientStartBtn,
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 100
            });
        }).on('pointerout', () => {
            this.tweens.add({
                targets: patientStartBtn,
                scaleX: 1,
                scaleY: 1,
                duration: 100
            });
        });

        patientCardBg.on('pointerover', () => {
            this.tweens.add({
                targets: patientCard,
                y: 390,
                duration: 200
            });
        }).on('pointerout', () => {
            this.tweens.add({
                targets: patientCard,
                y: 400,
                duration: 200
            });
        });

        // Start game on patient button click
        patientBtnBg.on('pointerdown', () => {
            this.tweens.add({
                targets: patientCard,
                scaleX: 0,
                scaleY: 0,
                duration: 300,
                ease: 'Back.in',
                onComplete: () => {
                    this.scene.start('PatientTrialScene'); // Create this scene later
                }
            });
        });

        // Entrance animation for patient card
        patientCard.setScale(0);
        this.tweens.add({
            targets: patientCard,
            scaleX: 1,
            scaleY: 1,
            duration: 500,
            ease: 'Back.out',
            delay: 100 // Slight delay after doctor card
        });
    }
} 