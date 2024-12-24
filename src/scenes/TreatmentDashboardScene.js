import Phaser from 'phaser';

export default class TreatmentDashboardScene extends Phaser.Scene {
    constructor() {
        super('TreatmentDashboardScene');
    }

    init(data) {
        // Make sure to check if the data is available
        if (data && data.patientStatusData) {
            this.patientStatusData = data.patientStatusData; // Access passed data
        } else {
            console.error('No patient status data found!');
            this.patientStatusData = {}; // Set to an empty object or handle accordingly
        }
    }

    create() {
        this.createBackground();
        this.createHeader();

        // Create a container for all the trial details
        this.trialContainer = this.add.container(0, 0);
        
        // Display ongoing trial details
        this.displayTrialDetails();

        // Make the trial container draggable to simulate scrolling
        this.input.on('pointerdown', this.onDragStart, this);
        this.input.on('pointermove', this.onDragMove, this);
        this.input.on('pointerup', this.onDragEnd, this);

        // Creating a slider for success rate adjustment
        const sliderContainer = this.add.dom(600, 500)
            .createFromHTML('<input type="range" min="0" max="100" value="80" step="1" id="successRateSlider">');

        const slider = sliderContainer.getChildByID('successRateSlider');

        slider.addEventListener('input', (event) => {
            const value = event.target.value;
            this.updateSuccessRate(value);
        });
    }

    createBackground() {
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x1a2a3f, 0x1a2a3f, 0x0f1c2d, 0x0f1c2d, 1);
        bg.fillRect(0, 0, 1200, 800);
    }

    createHeader() {
        const headerContainer = this.add.container(600, 30);

        const title = this.add.text(0, 0, 'Treatment Dashboard', {
            fontSize: '48px',
            fill: '#fff',
            fontFamily: 'Arial',
            fontWeight: 'bold',
        }).setOrigin(0.5);

        const subtitle = this.add.text(0, 70, 'Test and track treatments for ongoing trials', {
            fontSize: '24px',
            fill: '#bdc3c7',
            fontFamily: 'Arial',
        }).setOrigin(0.5);

        headerContainer.add([title, subtitle]);
    }

    displayTrialDetails() {
        // Simulated data for ongoing trials (8 trials)
        const ongoingTrialData = [
            { trialId: 1, treatmentName: 'New Vaccine', patientsInvolved: 30, successRate: 80, feedback: 'Positive response from most patients' },
            { trialId: 2, treatmentName: 'Pain Relief Drug', patientsInvolved: 50, successRate: 75, feedback: 'Moderate effectiveness' },
            { trialId: 3, treatmentName: 'Anticancer Therapy', patientsInvolved: 40, successRate: 90, feedback: 'Very promising results' },
            { trialId: 4, treatmentName: 'Diabetes Medication', patientsInvolved: 35, successRate: 70, feedback: 'Need more trials for conclusive results' },
            { trialId: 5, treatmentName: 'Heart Disease Drug', patientsInvolved: 25, successRate: 85, feedback: 'Good response from most patients' },
            { trialId: 6, treatmentName: 'Blood Pressure Medicine', patientsInvolved: 60, successRate: 80, feedback: 'Successful in reducing blood pressure' },
            { trialId: 7, treatmentName: 'Flu Vaccine', patientsInvolved: 45, successRate: 88, feedback: 'Effective for most people' },
            { trialId: 8, treatmentName: 'Migraine Relief', patientsInvolved: 20, successRate: 65, feedback: 'Still under review' }
        ];

        // Position to start displaying trials
        let trialYPosition = 200;

        ongoingTrialData.forEach(trial => {
            // Display trial details
            this.add.text(200, trialYPosition, `Trial ID: ${trial.trialId}`, {
                fontSize: '24px',
                fill: '#fff',
                fontFamily: 'Arial',
            });

            this.add.text(200, trialYPosition + 40, `Treatment: ${trial.treatmentName}`, {
                fontSize: '24px',
                fill: '#fff',
                fontFamily: 'Arial',
            });

            this.add.text(200, trialYPosition + 80, `Patients Involved: ${trial.patientsInvolved}`, {
                fontSize: '24px',
                fill: '#fff',
                fontFamily: 'Arial',
            });

            this.add.text(200, trialYPosition + 120, `Success Rate: ${trial.successRate}%`, {
                fontSize: '24px',
                fill: '#fff',
                fontFamily: 'Arial',
            });

            this.add.text(200, trialYPosition + 160, `Feedback: ${trial.feedback}`, {
                fontSize: '24px',
                fill: '#fff',
                fontFamily: 'Arial',
            });

            // Add a "Test Treatment" button for each trial
            const testButton = this.add.text(200, trialYPosition + 200, 'Test Treatment', {
                fontSize: '24px',
                fill: '#fff',
                fontFamily: 'Arial',
                backgroundColor: '#3498db',
                padding: { x: 10, y: 5 },
            }).setInteractive();

            testButton.on('pointerdown', () => {
                this.testTreatment(trial); // Pass the trial data to the testTreatment function
            });

            // Increase Y position for the next trial
            trialYPosition += 250;
        });
    }

    testTreatment(trial) {
        // Simulate testing a treatment
        console.log(`Testing Treatment for Trial ID: ${trial.trialId}...`);

        // Simulate a change in success rate (random for demonstration)
        const newSuccessRate = Phaser.Math.Between(60, 100);
        this.updateSuccessRate(trial, newSuccessRate);
    }

    updateSuccessRate(trial, newSuccessRate) {
        // Update the success rate for the specific trial and display it
        this.children.removeAll();  // Clear previous content
        this.createHeader();         // Recreate the header
        this.displayTrialDetails();  // Re-display trial details with updated success rate

        // Update the success rate for the specific trial
        const trialYPosition = 200 + (trial.trialId - 1) * 250; // Calculate Y position for the specific trial
        this.add.text(600, trialYPosition + 200, `Updated Success Rate for Trial ID ${trial.trialId}: ${newSuccessRate}%`, {
            fontSize: '32px',
            fill: '#27ae60',
            fontFamily: 'Arial',
        });
    }

    onDragStart(pointer) {
        // When the drag starts, save the initial position of the pointer
        this.startY = pointer.y;
        this.initialScrollY = this.trialContainer.y;
    }

    onDragMove(pointer) {
        // Calculate the new Y position for the container based on pointer movement
        const deltaY = pointer.y - this.startY;
        this.trialContainer.y = this.initialScrollY + deltaY;
    }

    onDragEnd() {
        // After drag ends, we can finalize the position if needed
        this.initialScrollY = this.trialContainer.y;
    }
}
