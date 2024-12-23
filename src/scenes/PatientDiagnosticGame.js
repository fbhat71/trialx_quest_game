import Button from '../components/Button';

export default class PatientDiagnosticGame extends Phaser.Scene {
    constructor() {
        super('PatientDiagnosticGame');
        this.symptoms = [];
        this.currentStep = 'body';
        this.selectedSymptoms = [];
    }

    init(data) {
        this.patientData = data.patientData;
    }

    create() {
        // Background
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x1a2a3f, 0x1a2a3f, 0x0f1c2d, 0x0f1c2d, 1);
        bg.fillRect(0, 0, 1200, 800);

        // Title
        this.add.text(600, 50, 'Help us understand your symptoms', {
            fontSize: '36px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            fontWeight: 'bold'
        }).setOrigin(0.5);

        // Instructions
        this.add.text(600, 100, 'Click on the areas where you experience symptoms', {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);

        this.createBodyMap();
    }

    createBodyMap() {
        // Create interactive body regions
        const bodyContainer = this.add.container(600, 400);

        // Head region
        const head = this.add.circle(0, -150, 40, 0x3498db)
            .setInteractive()
            .setAlpha(0.6);
        
        // Chest region
        const chest = this.add.rectangle(0, -50, 100, 100, 0x3498db)
            .setInteractive()
            .setAlpha(0.6);

        // Stomach region
        const stomach = this.add.rectangle(0, 50, 100, 100, 0x3498db)
            .setInteractive()
            .setAlpha(0.6);

        // Arms
        const leftArm = this.add.rectangle(-70, -50, 40, 150, 0x3498db)
            .setInteractive()
            .setAlpha(0.6);
        const rightArm = this.add.rectangle(70, -50, 40, 150, 0x3498db)
            .setInteractive()
            .setAlpha(0.6);

        // Legs
        const leftLeg = this.add.rectangle(-30, 150, 40, 150, 0x3498db)
            .setInteractive()
            .setAlpha(0.6);
        const rightLeg = this.add.rectangle(30, 150, 40, 150, 0x3498db)
            .setInteractive()
            .setAlpha(0.6);

        // Add all body parts to container
        bodyContainer.add([head, chest, stomach, leftArm, rightArm, leftLeg, rightLeg]);

        // Map of body parts to their symptom categories
        const bodyPartMap = {
            head: ['Headache', 'Dizziness', 'Vision problems', 'Memory issues'],
            chest: ['Chest pain', 'Breathing difficulty', 'Heart palpitations', 'Coughing'],
            stomach: ['Nausea', 'Abdominal pain', 'Digestive issues', 'Loss of appetite'],
            leftArm: ['Joint pain', 'Muscle weakness', 'Numbness', 'Limited mobility'],
            rightArm: ['Joint pain', 'Muscle weakness', 'Numbness', 'Limited mobility'],
            leftLeg: ['Joint pain', 'Muscle weakness', 'Numbness', 'Limited mobility'],
            rightLeg: ['Joint pain', 'Muscle weakness', 'Numbness', 'Limited mobility']
        };

        // Add interaction for each body part
        [
            { part: head, name: 'head' },
            { part: chest, name: 'chest' },
            { part: stomach, name: 'stomach' },
            { part: leftArm, name: 'leftArm' },
            { part: rightArm, name: 'rightArm' },
            { part: leftLeg, name: 'leftLeg' },
            { part: rightLeg, name: 'rightLeg' }
        ].forEach(({ part, name }) => {
            part.on('pointerover', () => {
                part.setAlpha(1);
            });

            part.on('pointerout', () => {
                if (!this.selectedSymptoms.some(s => s.region === name)) {
                    part.setAlpha(0.6);
                }
            });

            part.on('pointerdown', () => {
                this.showSymptomSelector(name, bodyPartMap[name], part);
            });
        });

        // Continue button
        const continueBtn = new Button(this, 600, 700, 'Continue', {
            backgroundColor: 0x27ae60
        }).onClick(() => {
            if (this.selectedSymptoms.length > 0) {
                this.analyzeSymptomsAndProceed();
            }
        });
    }

    showSymptomSelector(region, symptoms, bodyPart) {
        // Create popup container
        const popup = this.add.container(600, 400);

        // Popup background
        const bg = this.add.rectangle(0, 0, 400, 500, 0x2c3e50)
            .setStrokeStyle(2, 0x3498db);
        popup.add(bg);

        // Title
        const title = this.add.text(0, -200, `Select symptoms in this area`, {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        popup.add(title);

        // Add symptom options
        symptoms.forEach((symptom, index) => {
            const yPos = -100 + (index * 60);
            const btn = new Button(this, 0, yPos, symptom, {
                width: 300,
                height: 40,
                backgroundColor: this.selectedSymptoms.some(s => s.symptom === symptom) 
                    ? 0x27ae60 
                    : 0x3498db
            }).onClick(() => {
                const existingIndex = this.selectedSymptoms.findIndex(
                    s => s.symptom === symptom && s.region === region
                );
                
                if (existingIndex >= 0) {
                    this.selectedSymptoms.splice(existingIndex, 1);
                    bodyPart.setAlpha(0.6);
                } else {
                    this.selectedSymptoms.push({ region, symptom });
                    bodyPart.setAlpha(1);
                }
                
                popup.destroy();
            });
            
            popup.add(btn.container);
        });

        // Close button
        const closeBtn = new Button(this, 0, 180, 'Close', {
            width: 200,
            backgroundColor: 0xe74c3c
        }).onClick(() => {
            popup.destroy();
        });
        popup.add(closeBtn.container);
    }

    async analyzeSymptomsAndProceed() {
        // Group symptoms by region
        const symptomSummary = this.selectedSymptoms.reduce((acc, curr) => {
            if (!acc[curr.region]) {
                acc[curr.region] = [];
            }
            acc[curr.region].push(curr.symptom);
            return acc;
        }, {});

        // Update patient data
        this.patientData.symptoms = symptomSummary;

        // Use OpenAI to analyze symptoms and suggest possible conditions
        try {
            const openai = new OpenAI({
                apiKey: 'your-api-key-here' // Replace with your OpenAI API key
            });

            const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{
                    role: "system",
                    content: `Based on these symptoms: ${JSON.stringify(symptomSummary)}, 
                    suggest the top 3 most likely medical conditions that should be investigated.
                    Consider the patient's age (${this.patientData.age}) and gender (${this.patientData.gender}).
                    Format as a JSON array of condition names only.`
                }]
            });

            const suggestedConditions = JSON.parse(response.choices[0].message.content);
            this.patientData.suggestedConditions = suggestedConditions;

        } catch (error) {
            console.error('Error analyzing symptoms:', error);
            this.patientData.suggestedConditions = ['Unable to analyze symptoms'];
        }

        // Proceed to condition selection
        this.scene.start('PatientTrialScene', { 
            patientData: this.patientData,
            startAtDisease: true 
        });
    }
} 