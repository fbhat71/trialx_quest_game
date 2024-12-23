import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
        this.score = 0;
        this.patients = [];
        this.timeLeft = 300; // 5 minutes in seconds
        this.patientSatisfaction = 100;
        this.level = 1;
        this.powerUps = [];
        this.selectedTrial = null;
        this.recruitedPatients = 0;
        this.trialBudget = 0;
        this.spentBudget = 0;
        this.wrongAnswers = 0;
        this.maxWrongAnswers = 4;
    }

    init(data) {
        this.selectedTrial = data.selectedTrial;
        this.recruitedPatients = 0;
        this.trialBudget = data.selectedTrial.budget;
        this.spentBudget = 0;
        this.wrongAnswers = 0;
    }

    preload() {
        // Doctor sprite (human figure with white coat)
        const doctorGraphics = this.add.graphics();
        
        // White coat
        doctorGraphics.fillStyle(0xffffff);
        doctorGraphics.fillRect(8, 16, 16, 32);
        
        // Head
        doctorGraphics.fillStyle(0xffdbac);
        doctorGraphics.fillCircle(16, 10, 8);
        
        // Hair
        doctorGraphics.fillStyle(0x4a4a4a);
        doctorGraphics.fillRect(8, 4, 16, 6);
        
        // Face features
        doctorGraphics.lineStyle(1, 0x000000);
        // Eyes
        doctorGraphics.strokeCircle(13, 10, 1);
        doctorGraphics.strokeCircle(19, 10, 1);
        // Smile
        doctorGraphics.beginPath();
        doctorGraphics.arc(16, 12, 4, 0, Math.PI);
        doctorGraphics.strokePath();
        
        // Stethoscope
        doctorGraphics.lineStyle(2, 0x4a4a4a);
        doctorGraphics.beginPath();
        doctorGraphics.moveTo(12, 20);
        doctorGraphics.lineTo(20, 28);
        doctorGraphics.strokePath();
        doctorGraphics.fillCircle(20, 28, 3);
        
        doctorGraphics.generateTexture('doctor', 32, 48);
        doctorGraphics.destroy();

        // Patient sprite (human figure with casual clothes)
        const patientGraphics = this.add.graphics();
        
        // Body/Clothes
        patientGraphics.fillStyle(0x3498db); // Blue shirt
        patientGraphics.fillRect(8, 16, 16, 20);
        patientGraphics.fillStyle(0x34495e); // Dark pants
        patientGraphics.fillRect(8, 36, 16, 12);
        
        // Head
        patientGraphics.fillStyle(0xffdbac);
        patientGraphics.fillCircle(16, 10, 8);
        
        // Hair (random colors for variety)
        const hairColors = [0x4a4a4a, 0x8b4513, 0xd4af37];
        patientGraphics.fillStyle(hairColors[Math.floor(Math.random() * hairColors.length)]);
        patientGraphics.fillRect(8, 2, 16, 8);
        
        // Face features
        patientGraphics.lineStyle(1, 0x000000);
        // Eyes
        patientGraphics.strokeCircle(13, 10, 1);
        patientGraphics.strokeCircle(19, 10, 1);
        // Expression (slightly concerned)
        patientGraphics.beginPath();
        patientGraphics.arc(16, 14, 4, Math.PI, 0);
        patientGraphics.strokePath();
        
        // Arms
        patientGraphics.fillStyle(0xffdbac);
        patientGraphics.fillRect(4, 20, 4, 12);
        patientGraphics.fillRect(24, 20, 4, 12);
        
        patientGraphics.generateTexture('patient', 32, 48);
        patientGraphics.destroy();

        // Power-up sprites (different colored circles with symbols)
        const powerupTypes = [
            { color: 0xffff00, symbol: '⌛' }, // Time
            { color: 0xff00ff, symbol: '★' }, // Points
            { color: 0x00ffff, symbol: '♥' }  // Satisfaction
        ];

        powerupTypes.forEach((type, index) => {
            const powerupGraphics = this.add.graphics();
            powerupGraphics.lineStyle(2, 0xffffff);
            powerupGraphics.fillStyle(type.color);
            powerupGraphics.fillCircle(16, 16, 14);
            powerupGraphics.strokeCircle(16, 16, 14);
            
            // Add text symbol
            this.add.text(8, 4, type.symbol, {
                fontSize: '20px',
                fill: '#000'
            }).setOrigin(0, 0);
            
            powerupGraphics.generateTexture(`powerup${index}`, 32, 32);
            powerupGraphics.destroy();
        });

        // Create particle texture
        const particleGraphics = this.add.graphics();
        particleGraphics.fillStyle(0xffffff);
        particleGraphics.fillCircle(4, 4, 4);
        particleGraphics.generateTexture('particle', 8, 8);
        particleGraphics.destroy();
    }

    create() {
        // Background with gradient
        const background = this.add.graphics();
        background.fillGradientStyle(0x1a2a3f, 0x1a2a3f, 0x0f1c2d, 0x0f1c2d, 1);
        background.fillRect(0, 0, 1200, 800);

        // Add particle effect for ambient atmosphere
        this.addParticleEffect();

        // Create doctor character
        this.doctor = this.add.sprite(600, 400, 'doctor');
        this.doctor.setInteractive();
        
        // Add movement controls
        this.cursors = this.input.keyboard.createCursorKeys();

        // Generate random patients
        for (let i = 0; i < 5; i++) {
            this.createPatient();
        }

        // Create UI container
        this.uiContainer = this.add.container(0, 0);
        
        // Make UI header panel with gradient and glow
        const headerPanel = this.createGlowingPanel(600, 45, 1200, 90, 0x2c3e50);

        // Reorganize header UI elements with better spacing
        // Score section (far left)
        const scoreIcon = this.add.text(40, 25, '💎', { fontSize: '28px' });
        this.scoreText = this.add.text(80, 30, '0', { 
            fontSize: '24px',
            fill: '#fff',
            fontFamily: 'Arial',
            fontWeight: 'bold'
        });

        // Level section (left)
        const levelIcon = this.add.text(200, 25, '⭐', { fontSize: '28px' });
        this.levelText = this.add.text(240, 30, 'Level 1', { 
            fontSize: '24px',
            fill: '#fff',
            fontFamily: 'Arial',
            fontWeight: 'bold'
        });

        // Timer section (center-left)
        const timerIcon = this.add.text(400, 25, '⏱️', { fontSize: '28px' });
        this.timeText = this.add.text(440, 30, '5:00', { 
            fontSize: '24px',
            fill: '#fff',
            fontFamily: 'Arial',
            fontWeight: 'bold'
        });

        // Trial progress section (center-right)
        const trialIcon = this.add.text(600, 25, '👥', { fontSize: '28px' });
        this.trialProgressText = this.add.text(640, 30, 
            `${this.recruitedPatients}/${this.selectedTrial.requiredParticipants}`, { 
            fontSize: '24px',
            fill: '#fff',
            fontFamily: 'Arial',
            fontWeight: 'bold'
        });

        // Budget section (right)
        const budgetIcon = this.add.text(800, 25, '💰', { fontSize: '28px' });
        this.budgetText = this.add.text(840, 30, 
            `${this.spentBudget}/${this.trialBudget}`, { 
            fontSize: '24px',
            fill: '#fff',
            fontFamily: 'Arial',
            fontWeight: 'bold'
        });

        // Satisfaction section (far right)
        const satisfactionIcon = this.add.text(1000, 25, '❤️', { fontSize: '28px' });
        this.satisfactionMeter = this.createProgressBar(1040, 35, 120, 20, 0x00ff00);
        this.satisfactionText = this.add.text(1040, 30, '100%', { 
            fontSize: '24px',
            fill: '#fff',
            fontFamily: 'Arial',
            fontWeight: 'bold'
        });

        // Add all UI elements to container
        this.uiContainer.add([
            headerPanel,
            scoreIcon,
            this.scoreText,
            levelIcon,
            this.levelText,
            timerIcon,
            this.timeText,
            satisfactionIcon,
            this.satisfactionMeter,
            this.satisfactionText,
            trialIcon,
            this.trialProgressText,
            budgetIcon,
            this.budgetText
        ]);

        // Add hover effects to interactive elements
        this.addHoverEffects();

        // Timer event
        this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });

        // Spawn power-ups periodically
        this.time.addEvent({
            delay: 10000,
            callback: this.spawnPowerUp,
            callbackScope: this,
            loop: true
        });

        // Create sound effects
        this.correctSound = this.createBeepSound(440, 0.1); // A4 note
        this.wrongSound = this.createBeepSound(220, 0.1);   // A3 note
    }

    createPatient() {
        const x = Phaser.Math.Between(100, 1100);
        const y = Phaser.Math.Between(100, 700);
        const patient = this.add.sprite(x, y, 'patient');
        
        patient.setInteractive();
        patient.on('pointerdown', () => this.startQuiz(patient));

        // Store patient data as a property of the patient sprite
        patient.patientData = {
            age: Phaser.Math.Between(18, 80),
            condition: ['diabetes', 'hypertension', 'arthritis'][Phaser.Math.Between(0, 2)],
            severity: Phaser.Math.Between(1, 5),
            previousTreatments: Phaser.Math.Between(0, 3),
            allergies: Math.random() > 0.7,
            bloodPressure: {
                systolic: Phaser.Math.Between(100, 180),
                diastolic: Phaser.Math.Between(60, 100)
            }
        };

        this.patients.push(patient);
    }

    startQuiz(patient) {
        const questions = this.getQuestions(patient.patientData);
        this.showQuizDialog(questions, patient);
    }

    getQuestions(patientData) {
        const questions = [];
        const trial = this.selectedTrial;

        // Add questions based on trial criteria
        if (trial.criteria.maxAge) {
            questions.push({
                question: `Is this ${patientData.age} year old patient within the age range for ${trial.name}?`,
                correctAnswer: patientData.age <= trial.criteria.maxAge && 
                             (!trial.criteria.minAge || patientData.age >= trial.criteria.minAge),
                reward: 100
            });
        }

        if (trial.criteria.condition) {
            questions.push({
                question: `Does this patient's condition (${patientData.condition}) match the trial requirements?`,
                correctAnswer: patientData.condition === trial.criteria.condition,
                reward: 150
            });
        }

        if (trial.criteria.minSeverity) {
            questions.push({
                question: `Is the patient's severity level (${patientData.severity}) sufficient for the trial?`,
                correctAnswer: patientData.severity > trial.criteria.minSeverity,
                reward: 120
            });
        }

        if (trial.criteria.minSystolic) {
            questions.push({
                question: `Is the patient's blood pressure (${patientData.bloodPressure.systolic}/${patientData.bloodPressure.diastolic}) suitable?`,
                correctAnswer: patientData.bloodPressure.systolic > trial.criteria.minSystolic,
                reward: 130
            });
        }

        // Always return at least one question
        const selectedQuestions = questions.filter(() => Math.random() > 0.5);
        return selectedQuestions.length > 0 ? selectedQuestions.slice(0, 2) : [questions[0]];
    }

    showQuizDialog(questions, patient) {
        // Full screen overlay
        const overlay = this.add.rectangle(600, 400, 1200, 800, 0x000000, 0.7);
        
        // Create glass-like dialog - made larger and centered
        const dialog = this.add.container(600, 400);

        // Main background with gradient
        const glassBg = this.add.graphics();
        glassBg.fillGradientStyle(0x2c3e50, 0x2c3e50, 0x34495e, 0x34495e, 0.9);
        glassBg.fillRoundedRect(-400, -250, 800, 500, 20);
        glassBg.lineStyle(2, 0x3498db);
        glassBg.strokeRoundedRect(-400, -250, 800, 500, 20);

        // Add glow effect
        const glow = this.add.graphics();
        glow.lineStyle(16, 0x3498db, 0.1);
        glow.strokeRoundedRect(-408, -258, 816, 516, 24);

        // Header section - moved up slightly
        const headerContainer = this.add.container(0, -220);  // Changed from -200
        
        const title = this.add.text(0, 0, 'Patient Assessment', {
            fontSize: '36px',
            fill: '#fff',
            fontFamily: 'Arial',
            fontWeight: 'bold'
        }).setOrigin(0.5);

        const underline = this.add.graphics();
        underline.lineStyle(2, 0x3498db);
        underline.beginPath();
        underline.moveTo(-150, 30);
        underline.lineTo(150, 30);
        underline.strokePath();

        headerContainer.add([title, underline]);

        // Patient info section - moved left and up
        const infoContainer = this.add.container(-350, -120);  // Changed from -100
        
        // Info box background - made slightly smaller
        const infoBg = this.add.graphics();
        infoBg.fillStyle(0x2c3e50, 0.5);
        infoBg.fillRoundedRect(0, 0, 280, 140, 10);  // Changed size from 300, 150
        infoBg.lineStyle(1, 0x3498db);
        infoBg.strokeRoundedRect(0, 0, 280, 140, 10);

        const infoTitle = this.add.text(15, 15, 'Patient Details', {
            fontSize: '24px',
            fill: '#3498db',
            fontFamily: 'Arial',
            fontWeight: 'bold'
        });

        const infoText = this.add.text(15, 50, [
            `Age: ${patient.patientData.age} years`,
            `Condition: ${patient.patientData.condition}`,
            `Severity: ${patient.patientData.severity}`,
            `BP: ${patient.patientData.bloodPressure.systolic}/${patient.patientData.bloodPressure.diastolic}`
        ].join('\n'), {
            fontSize: '20px',
            fill: '#bdc3c7',
            fontFamily: 'Arial',
            lineSpacing: 10
        });

        infoContainer.add([infoBg, infoTitle, infoText]);

        // Question section - moved down and made wider
        const questionContainer = this.add.container(0, 50);  // Changed from 20
        
        const questionBg = this.add.graphics();
        questionBg.fillStyle(0x2c3e50, 0.5);
        questionBg.fillRoundedRect(-350, -40, 700, 80, 10);  // Adjusted height from 100
        questionBg.lineStyle(1, 0x3498db);
        questionBg.strokeRoundedRect(-350, -40, 700, 80, 10);

        const questionText = this.add.text(0, 0, questions[0].question, {
            fontSize: '24px',
            fill: '#fff',
            fontFamily: 'Arial',
            wordWrap: { width: 650 },
            align: 'center'
        }).setOrigin(0.5);

        questionContainer.add([questionBg, questionText]);

        // Create modern buttons
        const buttonsContainer = this.add.container(0, 170);  // Changed from 150
        
        const yesBtn = this.createAssessmentButton(-150, 0, 'YES', 0x27ae60);
        const noBtn = this.createAssessmentButton(150, 0, 'NO', 0xc0392b);

        buttonsContainer.add([yesBtn, noBtn]);

        // Add all sections to dialog
        dialog.add([glassBg, glow, headerContainer, infoContainer, questionContainer, buttonsContainer]);

        // Entrance animation
        dialog.setScale(0);
        this.tweens.add({
            targets: dialog,
            scaleX: 1,
            scaleY: 1,
            duration: 300,
            ease: 'Back.out'
        });

        // Store current question index
        dialog.currentQuestionIndex = 0;

        // Button click handlers
        yesBtn.first.on('pointerdown', () => this.handleAssessmentAnswer(true, dialog, questions, patient, overlay));
        noBtn.first.on('pointerdown', () => this.handleAssessmentAnswer(false, dialog, questions, patient, overlay));
    }

    createAssessmentButton(x, y, text, color) {
        const button = this.add.container(x, y);
        
        const bg = this.add.graphics();
        bg.fillGradientStyle(color, color, 0x1a2a3f, 0x1a2a3f, 1);
        bg.fillRoundedRect(-80, -30, 160, 60, 15);
        bg.lineStyle(2, 0xffffff, 0.5);
        bg.strokeRoundedRect(-80, -30, 160, 60, 15);
        bg.setInteractive(new Phaser.Geom.Rectangle(-80, -30, 160, 60), Phaser.Geom.Rectangle.Contains);

        const txt = this.add.text(0, 0, text, {
            fontSize: '28px',
            fill: '#fff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        button.add([bg, txt]);

        // Add hover effect
        bg.on('pointerover', () => {
            this.tweens.add({
                targets: button,
                scaleX: 1.1,
                scaleY: 1.1,
                y: y - 5,
                duration: 100,
                ease: 'Back.Out'
            });
        }).on('pointerout', () => {
            this.tweens.add({
                targets: button,
                scaleX: 1,
                scaleY: 1,
                y: y,
                duration: 100,
                ease: 'Back.In'
            });
        });

        return button;
    }

    handleAssessmentAnswer(answer, dialog, questions, patient, overlay) {
        this.tweens.add({
            targets: dialog,
            scaleX: 0,
            scaleY: 0,
            duration: 200,
            ease: 'Back.in',
            onComplete: () => {
                this.answerQuestion(answer, questions[dialog.currentQuestionIndex], patient, [overlay, dialog]);
            }
        });
    }

    answerQuestion(answer, question, patient, elements) {
        const correct = answer === question.correctAnswer;
        const cost = question.reward * this.level;
        
        // Clean up dialog elements first
        elements.forEach(element => element.destroy());
        
        // Show feedback popup
        const feedbackContainer = this.add.container(600, 300);
        feedbackContainer.setDepth(1000);

        const feedbackBg = this.add.rectangle(0, 0, 400, 150, 0x2c3e50, 0.9)
            .setStrokeStyle(4, correct ? 0x2ecc71 : 0xe74c3c);
        
        const feedbackTitle = this.add.text(0, -30, 
            correct ? 'Patient Successfully Recruited!' : 'Patient Not Eligible', {
            fontSize: '28px',
            fill: '#fff',
            fontFamily: 'Arial',
            fontWeight: 'bold'
        }).setOrigin(0.5);

        const feedbackDetails = this.add.text(0, 20, 
            correct ? 
            `+${cost} points\nSatisfaction +5%` : 
            'Satisfaction -10%\nTry another patient', {
            fontSize: '20px',
            fill: '#fff',
            fontFamily: 'Arial',
            align: 'center'
        }).setOrigin(0.5);

        feedbackContainer.add([feedbackBg, feedbackTitle, feedbackDetails]);
        feedbackContainer.setAlpha(0);

        // Animate feedback popup
        this.tweens.add({
            targets: feedbackContainer,
            alpha: 1,
            y: 250,
            duration: 500,
            ease: 'Back.out',
            onComplete: () => {
                // Remove feedback after delay
                this.time.delayedCall(1500, () => {
                    this.tweens.add({
                        targets: feedbackContainer,
                        alpha: 0,
                        y: 200,
                        duration: 300,
                        onComplete: () => feedbackContainer.destroy()
                    });
                });
            }
        });
        
        if (!correct) {
            this.wrongAnswers++;
            this.wrongSound.play();
            this.patientSatisfaction = Math.max(0, this.patientSatisfaction - 10);
            
            if (this.wrongAnswers >= this.maxWrongAnswers) {
                this.children.list.forEach(child => {
                    if (child.type === 'Container' && child !== this.uiContainer) {
                        child.destroy();
                    }
                });
                this.gameOver('Too Many Wrong Answers!');
                return;
            }
        } else {
            this.recruitedPatients++;
            this.spentBudget += cost;
            this.score += cost;
            this.correctSound.play();
            this.patientSatisfaction = Math.min(100, this.patientSatisfaction + 5);
            
            patient.destroy();
            this.patients = this.patients.filter(p => p !== patient);
            
            if (this.recruitedPatients >= this.selectedTrial.requiredParticipants) {
                this.children.list.forEach(child => {
                    if (child.type === 'Container' && child !== this.uiContainer) {
                        child.destroy();
                    }
                });
                this.trialComplete();
                return;
            }
            
            if (this.patients.length < 5) {
                this.createPatient();
            }
        }

        this.updateUI();
    }

    updateTimer() {
        this.timeLeft--;
        if (this.timeLeft <= 0) {
            this.gameOver('Time\'s Up!');
            return;
        }
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        this.timeText.setText(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    }

    spawnPowerUp() {
        const x = Phaser.Math.Between(100, 1100);
        const y = Phaser.Math.Between(100, 700);
        const powerUpIndex = Phaser.Math.Between(0, 2);
        const powerUpType = ['time', 'points', 'satisfaction'][powerUpIndex];
        
        const powerUp = this.add.sprite(x, y, `powerup${powerUpIndex}`);
        powerUp.setInteractive();
        powerUp.powerUpType = powerUpType;
        
        powerUp.on('pointerdown', () => {
            this.collectPowerUp(powerUp);
        });
        
        this.powerUps.push(powerUp);
    }

    collectPowerUp(powerUp) {
        switch (powerUp.powerUpType) {
            case 'time':
                this.timeLeft += 30;
                break;
            case 'points':
                this.score += 50;
                break;
            case 'satisfaction':
                this.patientSatisfaction = Math.min(100, this.patientSatisfaction + 10);
                break;
        }
        
        powerUp.destroy();
        this.powerUps = this.powerUps.filter(p => p !== powerUp);
        this.updateUI();
    }

    levelUp() {
        this.level++;
        this.levelText.setText(`Level: ${this.level}`);
        this.timeLeft += 60; // Bonus time
    }

    updateUI() {
        this.scoreText.setText(this.score.toString());
        this.updateProgressBar(
            this.satisfactionMeter,
            640, 35, 120, 20,
            this.patientSatisfaction > 50 ? 0x00ff00 : 0xff0000,
            this.patientSatisfaction / 100
        );
        this.satisfactionText.setText(`${this.patientSatisfaction}%`);
        this.trialProgressText.setText(`${this.recruitedPatients}/${this.selectedTrial.requiredParticipants}`);
        this.budgetText.setText(`${this.spentBudget}/${this.trialBudget}`);
    }

    gameOver(reason = 'Time\'s Up!') {
        // Stop the game
        this.scene.stop();

        // Create a new scene for game over
        const GameOverScene = new Phaser.Scene('GameOverScene');
        
        GameOverScene.create = () => {
            // Background
            const bg = this.add.rectangle(0, 0, 1200, 800, 0x000000);
            bg.setOrigin(0, 0);
            bg.setAlpha(0.8);

            // Game Over text
            this.add.text(600, 200, 'GAME OVER', {
                fontSize: '64px',
                fill: '#ff0000',
                fontFamily: 'Arial',
                fontWeight: 'bold'
            }).setOrigin(0.5);

            // Reason text
            this.add.text(600, 300, reason, {
                fontSize: '32px',
                fill: '#ffffff',
                fontFamily: 'Arial'
            }).setOrigin(0.5);

            // Stats
            const stats = [
                `Score: ${this.score}`,
                `Participants: ${this.recruitedPatients}/${this.selectedTrial.requiredParticipants}`,
                `Budget: ${this.spentBudget}/${this.trialBudget}`,
                `Wrong Answers: ${this.wrongAnswers}/${this.maxWrongAnswers}`
            ].join('\n');

            this.add.text(600, 400, stats, {
                fontSize: '24px',
                fill: '#ffffff',
                fontFamily: 'Arial',
                align: 'center'
            }).setOrigin(0.5);

            // Restart button
            const button = this.add.rectangle(600, 500, 200, 60, 0x00ff00);
            button.setInteractive();

            const buttonText = this.add.text(600, 500, 'Try Again', {
                fontSize: '24px',
                fill: '#000000',
                fontFamily: 'Arial'
            }).setOrigin(0.5);

            button.on('pointerdown', () => {
                this.scene.start('TrialSelectionScene');
            });
        };

        // Add and start the game over scene
        this.scene.add('GameOverScene', GameOverScene, true);
    }

    update() {
        // Doctor movement
        if (this.cursors.left.isDown) {
            this.doctor.x -= 4;
        }
        if (this.cursors.right.isDown) {
            this.doctor.x += 4;
        }
        if (this.cursors.up.isDown) {
            this.doctor.y -= 4;
        }
        if (this.cursors.down.isDown) {
            this.doctor.y += 4;
        }
    }

    createBeepSound(frequency, duration) {
        return {
            play: () => {
                const context = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = context.createOscillator();
                const gainNode = context.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(context.destination);
                
                oscillator.frequency.value = frequency;
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0.1, context.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + duration);
                
                oscillator.start(context.currentTime);
                oscillator.stop(context.currentTime + duration);
            }
        };
    }

    createProgressBar(x, y, width, height, color) {
        const bar = this.add.graphics();
        const border = this.add.graphics();

        // Draw border
        border.lineStyle(2, 0xffffff);
        border.strokeRect(x, y, width, height);

        this.updateProgressBar(bar, x, y, width, height, color, 1);
        return bar;
    }

    updateProgressBar(bar, x, y, width, height, color, percentage) {
        bar.clear();
        bar.fillStyle(color);
        bar.fillRect(x, y, width * percentage, height);
    }

    addHoverEffects() {
        const addButtonEffect = (button) => {
            button.setInteractive({ useHandCursor: true })
                .on('pointerover', () => {
                    button.setScale(1.1);
                    this.tweens.add({
                        targets: button,
                        alpha: 0.8,
                        duration: 100
                    });
                })
                .on('pointerout', () => {
                    button.setScale(1);
                    this.tweens.add({
                        targets: button,
                        alpha: 1,
                        duration: 100
                    });
                });
        };

        [this.scoreText, this.timeText, this.levelText].forEach(addButtonEffect);
    }

    createGlowingPanel(x, y, width, height, color) {
        const container = this.add.container(x, y);
        
        // Glow effect
        const glow = this.add.graphics();
        glow.lineStyle(16, color, 0.1);
        glow.strokeRoundedRect(-width/2 - 8, -height/2 - 8, width + 16, height + 16, 8);
        
        // Main panel with gradient
        const panel = this.add.graphics();
        panel.fillGradientStyle(color, color, 0x1a2a3f, 0x1a2a3f, 1);
        panel.fillRoundedRect(-width/2, -height/2, width, height, 8);
        panel.lineStyle(2, 0x3498db);
        panel.strokeRoundedRect(-width/2, -height/2, width, height, 8);
        
        container.add([glow, panel]);
        return container;
    }

    addParticleEffect() {
        // Create particle manager with texture key
        const particles = this.add.particles('particle');
        
        // Top particles
        const topEmitter = particles.emit('top-particles', {
            x: { min: 0, max: 800 },
            y: -10,
            lifespan: 3000,
            speedY: { min: 20, max: 50 },
            scale: { start: 0.1, end: 0 },
            emitZone: { type: 'random', source: new Phaser.Geom.Rectangle(0, -10, 800, 1) },
            frequency: 500,
            quantity: 1,
            blendMode: 'ADD',
            alpha: { start: 0.3, end: 0 },
            tint: 0x3498db
        });

        // Bottom particles
        const bottomEmitter = particles.emit('bottom-particles', {
            x: { min: 0, max: 800 },
            y: 610,
            lifespan: 3000,
            speedY: { min: -50, max: -20 },
            scale: { start: 0.1, end: 0 },
            emitZone: { type: 'random', source: new Phaser.Geom.Rectangle(0, 610, 800, 1) },
            frequency: 500,
            quantity: 1,
            blendMode: 'ADD',
            alpha: { start: 0.3, end: 0 },
            tint: 0x3498db
        });

        // Store emitters for later reference if needed
        this.particleEmitters = {
            top: topEmitter,
            bottom: bottomEmitter
        };
    }

    addDecorations() {
        // Add subtle pulse animation to UI elements
        this.tweens.add({
            targets: [this.scoreText, this.timeText, this.levelText, this.satisfactionText],
            scaleX: 1.05,
            scaleY: 1.05,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    trialComplete() {
        // Stop game activity but don't pause the scene
        this.input.enabled = false;
        
        // Create overlay and panel
        const overlay = this.add.rectangle(0, 0, 1200, 800, 0x000000, 0.8);
        overlay.setOrigin(0, 0);
        overlay.setDepth(1000);

        // Create success panel
        const panel = this.add.container(600, 400);
        panel.setDepth(1001);

        // Victory text
        const resultText = this.add.text(600, 200, 'YOU WIN!', {
            fontSize: '64px',
            fill: '#2ecc71',
            fontFamily: 'Arial',
            fontWeight: 'bold'
        }).setOrigin(0.5).setDepth(1001);

        // Congratulations text
        const congratsText = this.add.text(600, 280, 'Trial Successfully Completed!', {
            fontSize: '32px',
            fill: '#fff',
            fontFamily: 'Arial',
            fontWeight: 'bold'
        }).setOrigin(0.5).setDepth(1001);

        // Stats
        const stats = [
            `Participants Recruited: ${this.recruitedPatients}/${this.selectedTrial.requiredParticipants}`,
            `Budget Spent: ${this.spentBudget}/${this.trialBudget}`,
            `Patient Satisfaction: ${this.patientSatisfaction}%`,
            `Wrong Decisions: ${this.wrongAnswers}`,
            `Final Score: ${this.score}`
        ].join('\n');

        const statsText = this.add.text(600, 380, stats, {
            fontSize: '24px',
            fill: '#fff',
            fontFamily: 'Arial',
            align: 'center'
        }).setOrigin(0.5).setDepth(1001);

        // Create restart button with container for better interaction
        const buttonContainer = this.add.container(600, 500);
        buttonContainer.setDepth(1001);

        const buttonBg = this.add.rectangle(0, 0, 200, 60, 0x27ae60)
            .setInteractive()
            .setOrigin(0.5);

        const buttonText = this.add.text(0, 0, 'Start New Trial', {
            fontSize: '24px',
            fill: '#fff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        buttonContainer.add([buttonBg, buttonText]);

        // Button interaction
        buttonBg.on('pointerover', () => {
            buttonContainer.setScale(1.1);
        });

        buttonBg.on('pointerout', () => {
            buttonContainer.setScale(1);
        });

        buttonBg.on('pointerdown', () => {
            // Disable further input
            this.input.enabled = false;
            
            // Fade out effect
            this.cameras.main.fadeOut(300, 0, 0, 0);
            
            this.cameras.main.once('camerafadeoutcomplete', () => {
                // Clean up current scene
                this.scene.stop();
                // Start trial selection scene
                this.scene.start('TrialSelectionScene');
            });
        });

        // Add celebration particles
        const particles = this.add.particles();
        particles.setDepth(1002);
        
        // Emit particles
        particles.emit({
            frame: 'particle',
            x: { min: 0, max: 1200 },
            y: 800,
            lifespan: 3000,
            speedY: { min: -300, max: -500 },
            speedX: { min: -50, max: 50 },
            scale: { start: 0.2, end: 0 },
            quantity: 5,
            frequency: 50,
            blendMode: 'ADD',
            tint: [ 0x2ecc71, 0x3498db, 0xf1c40f ]
        });

        // Clean up particles after delay
        this.time.delayedCall(5000, () => {
            if (particles) {
                particles.destroy();
            }
        });
    }

    createButton(x, y, text, color, callback) {
        const button = this.add.container(x, y);
        
        // Button background with gradient
        const bg = this.add.graphics();
        bg.fillGradientStyle(color, color, 0x1a2a3f, 0x1a2a3f, 1);
        bg.fillRoundedRect(-100, -30, 200, 60, 15);
        bg.lineStyle(2, 0xffffff, 0.5);
        bg.strokeRoundedRect(-100, -30, 200, 60, 15);
        bg.setInteractive(new Phaser.Geom.Rectangle(-100, -30, 200, 60), Phaser.Geom.Rectangle.Contains);

        const txt = this.add.text(0, 0, text, {
            fontSize: '28px',
            fill: '#fff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        button.add([bg, txt]);

        // Add hover effect
        bg.on('pointerover', () => {
            this.tweens.add({
                targets: button,
                scaleX: 1.1,
                scaleY: 1.1,
                y: y - 5,
                duration: 100,
                ease: 'Back.Out'
            });
        }).on('pointerout', () => {
            this.tweens.add({
                targets: button,
                scaleX: 1,
                scaleY: 1,
                y: y,
                duration: 100,
                ease: 'Back.In'
            });
        });

        // Add click handler
        bg.on('pointerdown', () => {
            this.tweens.add({
                targets: button,
                scaleX: 0.95,
                scaleY: 0.95,
                duration: 50,
                yoyo: true,
                onComplete: callback
            });
        });

        return button;
    }
} 