import Button from '../components/Button';

export default class PatientEligibilityGame extends Phaser.Scene {
    constructor() {
        super('PatientEligibilityGame');
        this.currentQuestionIndex = 0;
        this.responses = [];
        this.questions = [
            {
                text: "Do you exercise regularly?\n(at least 3 times a week)",
                category: "lifestyle",
                animation: "exercise"
            },
            {
                text: "Do you take any medications daily?",
                category: "medical",
                animation: "medication"
            },
            {
                text: "Have you participated in clinical trials before?",
                category: "experience",
                animation: "research"
            },
            {
                text: "Can you commit to weekly hospital visits?",
                category: "availability",
                animation: "hospital"
            },
            {
                text: "Do you have any allergies to medications?",
                category: "medical",
                animation: "allergy"
            }
        ];
    }

    init(data) {
        this.patientData = data.patientData;
    }

    preload() {
        // Load particle assets
        this.load.atlas('flares', 'assets/particles/flares.png', 'assets/particles/flares.json');
        this.load.image('particle', 'assets/particle.png');
    }

    create() {
        // Background with animated gradient
        this.createAnimatedBackground();

        // Title with particle effect
        this.createTitle();

        // Progress bar
        this.createProgressBar();

        // Show first question
        this.showQuestion();
    }

    createAnimatedBackground() {
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x1a2a3f, 0x1a2a3f, 0x0f1c2d, 0x0f1c2d, 1);
        bg.fillRect(0, 0, 1200, 800);

        // Add animated particles
        const particles = this.add.particles(0, 0, 'flares', {
            frame: ['blue', 'white'],
            color: [0x3498db, 0xffffff],
            colorEase: 'quad.out',
            lifespan: 2000,
            scale: { start: 0.3, end: 0 },
            blendMode: 'ADD',
            quantity: 1,
            frequency: 500,
            emitZone: {
                type: 'random',
                source: new Phaser.Geom.Rectangle(0, 0, 1200, 800)
            }
        });
    }

    createTitle() {
        const title = this.add.text(600, 100, 'Clinical Trial Eligibility', {
            fontSize: '48px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            fontWeight: 'bold'
        }).setOrigin(0.5);

        // Add glow effect
        title.setStroke('#3498db', 8);
        title.setShadow(2, 2, '#2980b9', 2, true, true);
    }

    createProgressBar() {
        const width = 600;
        const height = 20;
        const x = (1200 - width) / 2;
        const y = 180;

        // Background bar
        this.add.rectangle(x + width/2, y, width, height, 0x2c3e50);

        // Progress fill
        this.progressFill = this.add.rectangle(x, y, 0, height, 0x3498db)
            .setOrigin(0, 0.5);

        // Progress text
        this.progressText = this.add.text(600, y + 30, 
            `Question ${this.currentQuestionIndex + 1} of ${this.questions.length}`, {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
    }

    updateProgress() {
        const progress = (this.currentQuestionIndex + 1) / this.questions.length;
        const width = 600;

        this.tweens.add({
            targets: this.progressFill,
            width: width * progress,
            duration: 300,
            ease: 'Power2'
        });

        this.progressText.setText(
            `Question ${this.currentQuestionIndex + 1} of ${this.questions.length}`
        );
    }

    showQuestion() {
        const question = this.questions[this.currentQuestionIndex];

        // Clear previous question if exists
        if (this.questionContainer) {
            this.questionContainer.destroy();
        }

        // Create new question container
        this.questionContainer = this.add.container(600, 400);

        // Question card background with glow effect
        const cardBg = this.add.rectangle(0, 0, 700, 300, 0x34495e)
            .setStrokeStyle(4, 0x3498db)
            .setPipeline('Light2D');
        this.questionContainer.add(cardBg);

        // Add question text with animation
        const questionText = this.add.text(0, -50, question.text, {
            fontSize: '32px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            align: 'center',
            wordWrap: { width: 600 }
        }).setOrigin(0.5);
        this.questionContainer.add(questionText);

        // Create animated icons based on question category
        this.createQuestionAnimation(question.animation);

        // Yes/No buttons with hover effects
        const yesButton = new Button(this, -150, 80, 'YES', {
            width: 200,
            height: 60,
            backgroundColor: 0x27ae60,
            fontSize: '28px'
        }).onClick(() => this.handleAnswer(true));
        
        const noButton = new Button(this, 150, 80, 'NO', {
            width: 200,
            height: 60,
            backgroundColor: 0xe74c3c,
            fontSize: '28px'
        }).onClick(() => this.handleAnswer(false));

        this.questionContainer.add([yesButton.container, noButton.container]);

        // Entrance animation
        this.questionContainer.setScale(0);
        this.tweens.add({
            targets: this.questionContainer,
            scaleX: 1,
            scaleY: 1,
            duration: 500,
            ease: 'Back.out'
        });
    }

    createQuestionAnimation(type) {
        const container = this.add.container(0, -120);
        this.questionContainer.add(container);

        switch(type) {
            case 'exercise':
                this.createExerciseAnimation(container);
                break;
            case 'medication':
                this.createMedicationAnimation(container);
                break;
            case 'research':
                this.createResearchAnimation(container);
                break;
            case 'hospital':
                this.createHospitalAnimation(container);
                break;
            case 'allergy':
                this.createAllergyAnimation(container);
                break;
        }
    }

    handleAnswer(answer) {
        // Store response
        this.responses.push({
            question: this.questions[this.currentQuestionIndex].text,
            answer: answer,
            category: this.questions[this.currentQuestionIndex].category
        });

        // Animate question exit
        this.tweens.add({
            targets: this.questionContainer,
            scaleX: 0,
            scaleY: 0,
            duration: 300,
            ease: 'Back.in',
            onComplete: () => {
                this.currentQuestionIndex++;
                
                if (this.currentQuestionIndex < this.questions.length) {
                    this.updateProgress();
                    this.showQuestion();
                } else {
                    this.evaluateResponses();
                }
            }
        });
    }

    evaluateResponses() {
        // Calculate eligibility scores for different trial types
        const scores = {
            lifestyle: 0,
            medical: 0,
            experience: 0,
            availability: 0
        };

        this.responses.forEach(response => {
            if (response.answer) {
                scores[response.category]++;
            }
        });

        // Store results in patient data
        this.patientData.eligibilityScores = scores;
        this.patientData.responses = this.responses;

        // Show results scene
        this.showResults(scores);
    }

    showResults(scores) {
        // Clear screen
        if (this.questionContainer) {
            this.questionContainer.destroy();
        }

        // Create results container
        const resultsContainer = this.add.container(600, 400);

        // Results background
        const resultsBg = this.add.rectangle(0, 0, 800, 500, 0x34495e)
            .setStrokeStyle(4, 0x3498db);
        resultsContainer.add(resultsBg);

        // Results title
        const title = this.add.text(0, -200, 'Eligibility Results', {
            fontSize: '36px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            fontWeight: 'bold'
        }).setOrigin(0.5);
        resultsContainer.add(title);

        // Show scores with progress bars
        let yPos = -100;
        Object.entries(scores).forEach(([category, score]) => {
            const percentage = (score / this.questions.filter(q => q.category === category).length) * 100;
            this.createScoreBar(resultsContainer, category, percentage, yPos);
            yPos += 60;
        });

        // Continue button
        const continueBtn = new Button(this, 0, 180, 'Continue to Trials', {
            width: 300,
            height: 60,
            backgroundColor: 0x27ae60,
            fontSize: '28px'
        }).onClick(() => {
            this.scene.start('PatientDiagnosticGame', { patientData: this.patientData });
        });
        resultsContainer.add(continueBtn.container);

        // Entrance animation
        resultsContainer.setScale(0);
        this.tweens.add({
            targets: resultsContainer,
            scaleX: 1,
            scaleY: 1,
            duration: 500,
            ease: 'Back.out'
        });
    }

    createScoreBar(container, category, percentage, yPosition) {
        const width = 600;
        const height = 30;

        // Category label
        const label = this.add.text(-width/2, yPosition, 
            category.charAt(0).toUpperCase() + category.slice(1), {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        });
        container.add(label);

        // Background bar
        const barBg = this.add.rectangle(0, yPosition, width, height, 0x2c3e50);
        container.add(barBg);

        // Score bar
        const scoreBar = this.add.rectangle(-width/2, yPosition, 0, height, 0x3498db)
            .setOrigin(0, 0.5);
        container.add(scoreBar);

        // Animate score bar
        this.tweens.add({
            targets: scoreBar,
            width: width * (percentage / 100),
            duration: 1000,
            ease: 'Power2'
        });

        // Percentage text
        const percentText = this.add.text(width/2 + 10, yPosition, 
            `${Math.round(percentage)}%`, {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0, 0.5);
        container.add(percentText);
    }

    createExerciseAnimation(container) {
        // Running figure animation
        const figure = this.add.graphics();
        figure.lineStyle(4, 0x3498db);
        
        // Initial stick figure
        this.drawStickFigure(figure, 0, 0);
        container.add(figure);

        // Create separate tweens for scale and angle
        this.tweens.add({
            targets: figure,
            scaleX: 1.2,
            duration: 500,
            yoyo: true,
            repeat: -1
        });

        this.tweens.add({
            targets: figure,
            angle: 5,
            duration: 500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.inOut'
        });
    }

    createMedicationAnimation(container) {
        // Pill bottle
        const bottle = this.add.graphics();
        bottle.lineStyle(4, 0x3498db);
        bottle.fillStyle(0x2980b9, 1);
        bottle.fillRoundedRect(-20, -30, 40, 60, 8);
        bottle.strokeRoundedRect(-20, -30, 40, 60, 8);
        
        // Pills
        const pills = this.add.graphics();
        pills.fillStyle(0xe74c3c, 1);
        
        container.add([bottle, pills]);

        // Animate pills falling
        this.tweens.addCounter({
            from: 0,
            to: 360,
            duration: 2000,
            loop: -1,
            onUpdate: (tween) => {
                pills.clear();
                const angle = tween.getValue();
                pills.fillCircle(
                    Math.cos(angle * Math.PI / 180) * 30,
                    Math.sin(angle * Math.PI / 180) * 30 + 40,
                    8
                );
            }
        });
    }

    createResearchAnimation(container) {
        // Clipboard
        const clipboard = this.add.graphics();
        clipboard.lineStyle(4, 0x3498db);
        clipboard.fillStyle(0xecf0f1, 1);
        clipboard.fillRect(-40, -50, 80, 100);
        clipboard.strokeRect(-40, -50, 80, 100);
        
        // Lines of text
        for (let i = 0; i < 4; i++) {
            clipboard.fillStyle(0x2c3e50, 1);
            clipboard.fillRect(-30, -30 + (i * 20), 60, 4);
        }
        
        container.add(clipboard);

        // Animate clipboard
        this.tweens.add({
            targets: clipboard,
            y: 10,
            duration: 1500,
            yoyo: true,
            loop: -1,
            ease: 'Sine.inOut'
        });
    }

    createHospitalAnimation(container) {
        // Hospital building
        const hospital = this.add.graphics();
        hospital.lineStyle(4, 0x3498db);
        hospital.fillStyle(0xecf0f1, 1);
        
        // Main building
        hospital.fillRect(-50, -60, 100, 120);
        hospital.strokeRect(-50, -60, 100, 120);
        
        // Cross symbol
        hospital.lineStyle(6, 0xe74c3c);
        hospital.beginPath();
        hospital.moveTo(-20, -20);
        hospital.lineTo(20, -20);
        hospital.moveTo(0, -40);
        hospital.lineTo(0, 0);
        hospital.strokePath();
        
        container.add(hospital);

        // Pulse effect
        this.tweens.add({
            targets: hospital,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 1000,
            yoyo: true,
            loop: -1,
            ease: 'Sine.inOut'
        });
    }

    createAllergyAnimation(container) {
        // Create allergen particles
        const particles = this.add.particles(0, 0, 'particle', {
            frame: 'white',
            color: [0xe74c3c, 0xf1c40f],
            colorEase: 'quad.out',
            lifespan: 1000,
            scale: { start: 0.2, end: 0 },
            speed: 100,
            advance: 2000,
            blendMode: 'ADD',
            frequency: 50,
            quantity: 2,
            emitZone: {
                type: 'circle',
                source: new Phaser.Geom.Circle(0, 0, 50),
                quantity: 12
            }
        });
        
        container.add(particles);
    }

    drawStickFigure(graphics, x, y) {
        // Head
        graphics.strokeCircle(x, y - 30, 15);
        
        // Body
        graphics.beginPath();
        graphics.moveTo(x, y - 15);
        graphics.lineTo(x, y + 20);
        
        // Arms
        graphics.moveTo(x - 20, y);
        graphics.lineTo(x + 20, y);
        
        // Legs
        graphics.moveTo(x, y + 20);
        graphics.lineTo(x - 15, y + 50);
        graphics.moveTo(x, y + 20);
        graphics.lineTo(x + 15, y + 50);
        
        graphics.strokePath();
    }
} 