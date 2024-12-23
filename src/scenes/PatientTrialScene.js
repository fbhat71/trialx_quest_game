import Phaser from 'phaser';
import OpenAI from 'openai';
import TextInput from '../components/TextInput';
import Button from '../components/Button';

export default class PatientTrialScene extends Phaser.Scene {
    constructor() {
        super('PatientTrialScene');
        this.patientData = {};
        this.currentStep = 'name';
        this.questions = [];
        this.currentQuestionIndex = 0;
    }

    create() {
        // Background with gradient
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x1a2a3f, 0x1a2a3f, 0x0f1c2d, 0x0f1c2d, 1);
        bg.fillRect(0, 0, 1200, 800);
        
        // Title
        this.add.text(600, 150, 'Patient Registration', {
            fontSize: '64px',
            fill: '#fff',
            fontFamily: 'Arial',
            fontWeight: 'bold'
        }).setOrigin(0.5);

        // Create form elements
        this.createForm();
    }

    createForm() {
        switch (this.currentStep) {
            case 'name':
                this.createInputField('Enter your name:');
                break;
            case 'age':
                this.createInputField('Enter your age:');
                break;
            case 'gender':
                this.createGenderSelection();
                break;
            case 'disease':
                this.createDiseaseSelection();
                break;
            case 'questionnaire':
                this.showQuestion();
                break;
            case 'complete':
                this.showSummary();
                break;
        }
    }

    createCard(content) {
        if (this.mainContainer) {
            this.mainContainer.destroy();
        }

        this.mainContainer = this.add.container(600, 400);
        
        // Card background
        const cardBg = this.add.rectangle(0, 0, 600, 500, 0x34495e)
            .setStrokeStyle(4, 0x3498db);

        this.mainContainer.add([cardBg, ...content]);

        // Entrance animation
        this.mainContainer.setScale(0);
        this.tweens.add({
            targets: this.mainContainer,
            scaleX: 1,
            scaleY: 1,
            duration: 300,
            ease: 'Back.out'
        });
    }

    createInputField(label) {
        const content = [];

        // Label with white color
        const labelText = this.add.text(0, -150, label, {
            fontSize: '28px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            fontWeight: 'bold'
        }).setOrigin(0.5);
        content.push(labelText);

        // Create input
        const input = new TextInput(this, 0, -80, 400, 60, {
            fontSize: '24px'
        });
        content.push(input.container);

        // Create button
        const submitBtn = new Button(this, 0, 50, 'Continue')
            .onClick(() => {
                const value = input.getValue();
                if (value.trim() !== '') {
                    this.handleInput(value);
                }
            });
        content.push(submitBtn.container);

        this.createCard(content);
    }

    createGenderSelection() {
        const content = [];

        const label = this.add.text(0, -150, 'Select your gender:', {
            fontSize: '28px',
            fill: '#fff',
            fontFamily: 'Arial',
            fontWeight: 'bold'
        }).setOrigin(0.5);
        content.push(label);

        const options = ['Male', 'Female', 'Other'];
        options.forEach((option, index) => {
            const btn = new Button(
                this,
                0,
                -50 + (index * 80),
                option,
                {
                    width: 200,
                    height: 50,
                    fontSize: '24px'
                }
            ).onClick(() => this.handleInput(option));
            content.push(btn.container);
        });

        this.createCard(content);
    }

    createDiseaseSelection() {
        const content = [];

        // Label with white color
        const labelText = this.add.text(0, -150, 'What medical condition are you seeking treatment for?', {
            fontSize: '28px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            fontWeight: 'bold',
            wordWrap: { width: 500 },
            align: 'center'
        }).setOrigin(0.5);
        content.push(labelText);

        // Create input
        const input = new TextInput(this, 0, -50, 400, 60, {
            fontSize: '24px',
            placeholder: 'Enter your condition'
        });
        content.push(input.container);

        // Helper text in lighter white
        const helperText = this.add.text(0, 20, 'Example: Diabetes, Asthma, Heart Disease, etc.', {
            fontSize: '16px',
            fill: '#cccccc',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        content.push(helperText);

        // Create button
        const submitBtn = new Button(this, 0, 100, 'Continue')
            .onClick(() => {
                const value = input.getValue();
                if (value.trim() !== '') {
                    this.handleInput(value);
                }
            });
        content.push(submitBtn.container);

        this.createCard(content);
    }

    showQuestion() {
        const content = [];

        // Question progress in blue-white
        const progressText = this.add.text(0, -180, `Question ${this.currentQuestionIndex + 1} of 5`, {
            fontSize: '20px',
            fill: '#7cd6ff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        content.push(progressText);

        // Question text in white
        const questionText = this.add.text(0, -120, this.questions[this.currentQuestionIndex], {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            align: 'center',
            wordWrap: { width: 500 }
        }).setOrigin(0.5);
        content.push(questionText);

        // Create input
        const input = new TextInput(this, 0, 0, 500, 100, {
            fontSize: '20px',
            multiline: true
        });
        content.push(input.container);

        // Create button
        const submitBtn = new Button(this, 0, 100, 'Next')
            .onClick(() => {
                const value = input.getValue();
                if (value.trim() !== '') {
                    this.handleInput(value);
                }
            });
        content.push(submitBtn.container);

        this.createCard(content);
    }

    showSummary() {
        const content = [];
        
        const summaryText = this.add.text(0, -100, 
            `Thank you for completing the questionnaire!\n\n` +
            `Name: ${this.patientData.name}\n` +
            `Age: ${this.patientData.age}\n` +
            `Gender: ${this.patientData.gender}\n` +
            `Condition: ${this.patientData.disease}\n\n` +
            `Your responses have been recorded.`, {
            fontSize: '24px',
            fill: '#ffffff',
            align: 'center',
            wordWrap: { width: 500 }
        }).setOrigin(0.5);

        const continueBtn = new Button(this, 0, 100, 'Continue to Trials')
            .onClick(() => {
                this.scene.start('PatientDashboardScene', { patientData: this.patientData });
            });

        content.push(summaryText, continueBtn.container);
        this.createCard(content);
    }

    async handleInput(value) {
        if (!value || value.trim() === '') {
            return;
        }

        switch (this.currentStep) {
            case 'name':
                this.patientData.name = value;
                this.currentStep = 'age';
                break;
            case 'age':
                if (!isNaN(value) && parseInt(value) > 0) {
                    this.patientData.age = parseInt(value);
                    this.currentStep = 'gender';
                }
                break;
            case 'gender':
                this.patientData.gender = value;
                this.scene.start('PatientDiagnosticGame', { patientData: this.patientData });
                return;
            case 'disease':
                this.patientData.disease = value;
                await this.generateQuestions();
                this.currentStep = 'questionnaire';
                break;
            case 'questionnaire':
                this.patientData[`question${this.currentQuestionIndex + 1}`] = value;
                this.currentQuestionIndex++;
                if (this.currentQuestionIndex >= this.questions.length) {
                    this.currentStep = 'complete';
                }
                break;
        }
        
        this.createForm();
    }

    async generateQuestions() {
        try {
            const openai = new OpenAI({
                apiKey: 'your-api-key-here' // Replace with your OpenAI API key
            });

            const prompt = `Generate 5 specific medical questions for a patient with ${this.patientData.disease}. 
            The questions should:
            1. Help understand the severity and history of their condition
            2. Identify key symptoms and triggers
            3. Assess impact on daily life
            4. Understand current treatments
            5. Evaluate related health factors
            
            Format each question clearly and professionally.`;

            const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{
                    role: "system",
                    content: prompt
                }],
                temperature: 0.7,
                max_tokens: 500
            });

            this.questions = response.choices[0].message.content
                .split('\n')
                .filter(q => q.trim())
                .slice(0, 5);

        } catch (error) {
            console.error('Error generating questions:', error);
            // Fallback questions if API fails
            this.questions = [
                `How long have you been experiencing symptoms of ${this.patientData.disease}?`,
                "What are your main symptoms, and how severe are they on a scale of 1-10?",
                "Are you currently taking any medications for this condition?",
                "How does this condition affect your daily activities?",
                "Have you received any previous treatments for this condition?"
            ];
        }
    }
} 