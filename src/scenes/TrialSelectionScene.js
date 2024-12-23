import Phaser from 'phaser';
import { getFallbackTrials } from '../services/trialService';

export default class TrialSelectionScene extends Phaser.Scene {
    constructor() {
        super('TrialSelectionScene');
    }

    create() {
        this.createBackground();
        this.createHeader();
        
        // Use fallback trials directly instead of trying to generate from OpenAI
        const trials = getFallbackTrials();
        this.createTrialCards(trials);
    }

    createLoadingText() {
        this.loadingText = this.add.text(600, 300, 'Loading Clinical Trials...', {
            fontSize: '32px',
            fill: '#fff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
    }

    createBackground() {
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x1a2a3f, 0x1a2a3f, 0x0f1c2d, 0x0f1c2d, 1);
        bg.fillRect(0, 0, 1200, 800);

        // Add subtle background pattern
        for (let i = 0; i < 20; i++) {
            const x = Phaser.Math.Between(0, 1200);
            const y = Phaser.Math.Between(0, 800);
            const circle = this.add.circle(x, y, 2, 0x3498db, 0.3);
            this.tweens.add({
                targets: circle,
                alpha: 0,
                duration: 2000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.InOut'
            });
        }
    }

    createHeader() {
        const headerContainer = this.add.container(600, 80);

        // Main title
        const title = this.add.text(0, 0, 'Select Clinical Trial', {
            fontSize: '64px',
            fill: '#fff',
            fontFamily: 'Arial',
            fontWeight: 'bold'
        }).setOrigin(0.5);

        // Subtitle
        const subtitle = this.add.text(0, 80, 'Choose a trial to begin recruitment', {
            fontSize: '24px',
            fill: '#bdc3c7',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        headerContainer.add([title, subtitle]);
    }

    createTrialCards(trials) {
        const startY = 280;
        const spacing = 200;

        trials.forEach((trial, index) => {
            this.createTrialCard(600, startY + index * spacing, trial);
        });
    }

    createTrialCard(x, y, trial) {
        const card = this.add.container(x, y);
        
        // Card background
        const bg = this.createCardBackground();
        
        // Content sections
        const headerSection = this.createCardHeader(trial);
        const requirementsSection = this.createRequirementsList(trial);
        const statsSection = this.createStatsSection(trial);
        
        card.add([bg, headerSection, requirementsSection, statsSection]);
        
        this.addCardInteractivity(card, bg, y, trial);
    }

    createCardBackground() {
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x2c3e50, 0x2c3e50, 0x34495e, 0x34495e, 1);
        bg.fillRoundedRect(-400, -80, 800, 160, 16);
        bg.lineStyle(2, 0x3498db);
        bg.strokeRoundedRect(-400, -80, 800, 160, 16);
        bg.setInteractive(new Phaser.Geom.Rectangle(-400, -80, 800, 160), Phaser.Geom.Rectangle.Contains);
        return bg;
    }

    createCardHeader(trial) {
        const container = this.add.container(-350, -60);
        
        const icon = this.add.text(0, 0, trial.icon, { fontSize: '40px' });
        const name = this.add.text(60, 0, trial.name, {
            fontSize: '32px',
            fill: '#fff',
            fontFamily: 'Arial',
            fontWeight: 'bold'
        });

        const difficulty = this.add.text(60, 40, trial.difficulty, {
            fontSize: '16px',
            fill: this.getDifficultyColor(trial.difficulty),
            fontFamily: 'Arial',
            fontWeight: 'bold'
        });

        return container.add([icon, name, difficulty]);
    }

    createRequirementsList(trial) {
        const container = this.add.container(-350, -10);
        const requirements = this.formatRequirements(trial);
        
        const columns = this.splitIntoColumns(requirements, 2);
        columns.forEach((column, columnIndex) => {
            column.forEach((req, rowIndex) => {
                container.add(this.add.text(columnIndex * 250, rowIndex * 25, req, {
                    fontSize: '18px',
                    fill: '#bdc3c7',
                    fontFamily: 'Arial'
                }));
            });
        });

        return container;
    }

    createStatsSection(trial) {
        const container = this.add.container(200, -20);
        
        // Participants box
        const participantsBox = this.createStatsBox(
            0, -30, 
            `${trial.requiredParticipants} Patients`,
            0x3498db
        );

        // Budget box
        const budgetBox = this.createStatsBox(
            0, 20,
            `Budget: ${trial.budget}`,
            0x2ecc71
        );

        return container.add([participantsBox.box, participantsBox.text, budgetBox.box, budgetBox.text]);
    }

    createStatsBox(x, y, text, color) {
        const box = this.add.graphics();
        box.fillStyle(color, 0.2);
        box.fillRoundedRect(x, y, 180, 40, 8);
        box.lineStyle(2, color);
        box.strokeRoundedRect(x, y, 180, 40, 8);

        const textObj = this.add.text(x + 90, y + 10, text, {
            fontSize: '20px',
            fill: this.rgbToHex(color),
            fontFamily: 'Arial',
            fontWeight: 'bold'
        }).setOrigin(0.5);

        return { box, text: textObj };
    }

    addCardInteractivity(card, bg, baseY, trial) {
        // Hover effect
        bg.on('pointerover', () => this.onCardHover(card, baseY));
        bg.on('pointerout', () => this.onCardOut(card, baseY));
        bg.on('pointerdown', () => this.onCardClick(card, trial));

        // Floating animation
        this.addFloatingAnimation(card, baseY);
    }

    // Helper methods
    formatRequirements(trial) {
        const requirements = [
            `👤 Age: ${trial.criteria.minAge || 18}-${trial.criteria.maxAge} years`,
            `🏥 Condition: ${trial.criteria.condition}`
        ];

        if (trial.criteria.minBloodSugar) {
            requirements.push(`🩺 Min Blood Sugar: ${trial.criteria.minBloodSugar}`);
        }
        if (trial.criteria.minSystolic) {
            requirements.push(`💉 Min Blood Pressure: ${trial.criteria.minSystolic}`);
        }
        if (trial.criteria.minSeverity) {
            requirements.push(`📊 Min Severity: ${trial.criteria.minSeverity}`);
        }
        if (trial.criteria.maxPreviousTreatments !== undefined) {
            requirements.push(`📋 Max Previous Treatments: ${trial.criteria.maxPreviousTreatments}`);
        }

        return requirements;
    }

    splitIntoColumns(array, columns) {
        const itemsPerColumn = Math.ceil(array.length / columns);
        return Array.from({ length: columns }, (_, i) => 
            array.slice(i * itemsPerColumn, (i + 1) * itemsPerColumn)
        );
    }

    getDifficultyColor(difficulty) {
        const colors = {
            'Easy': '#2ecc71',
            'Medium': '#f1c40f',
            'Hard': '#e74c3c'
        };
        return colors[difficulty] || '#fff';
    }

    rgbToHex(color) {
        return '#' + color.toString(16).padStart(6, '0');
    }

    // Animation methods
    onCardHover(card, baseY) {
        this.tweens.add({
            targets: card,
            scaleX: 1.02,
            scaleY: 1.02,
            y: baseY - 5,
            duration: 200,
            ease: 'Cubic.out'
        });
    }

    onCardOut(card, baseY) {
        this.tweens.add({
            targets: card,
            scaleX: 1,
            scaleY: 1,
            y: baseY,
            duration: 200,
            ease: 'Cubic.out'
        });
    }

    onCardClick(card, trial) {
        this.tweens.add({
            targets: card,
            scaleX: 0.98,
            scaleY: 0.98,
            duration: 100,
            yoyo: true,
            onComplete: () => {
                this.cameras.main.fadeOut(300, 0, 0, 0);
                this.cameras.main.once('camerafadeoutcomplete', () => {
                    this.scene.start('GameScene', { selectedTrial: trial });
                });
            }
        });
    }

    addFloatingAnimation(card, baseY) {
        this.tweens.add({
            targets: card,
            y: baseY + 3,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.inOut'
        });
    }
} 