import Phaser from 'phaser';

export default class PatientStatusScene extends Phaser.Scene {
    constructor() {
        super('PatientStatusScene');
    }

    init(data) {
        // Make sure data.patientStatusData exists before using it
        if (data && data.patientStatusData) {
            this.patientStatusData = data.patientStatusData; // Get the data passed from AnalyticsScene
        } else {
            this.patientStatusData = {}; // Default to an empty object if no data is passed
            console.error('No patient status data passed');
        }
    }

    create() {
        this.createBackground();
        this.createHeader();

        // Display the table
        if (Object.keys(this.patientStatusData).length > 0) {
            this.createTable(this.patientStatusData);
        } else {
            // If no data, show a message
            this.add.text(600, 400, 'No patient status data available', {
                fontSize: '24px',
                fill: '#e74c3c',
                fontFamily: 'Arial',
                align: 'center',
            }).setOrigin(0.5);
        }
    }

    createBackground() {
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x1a2a3f, 0x1a2a3f, 0x0f1c2d, 0x0f1c2d, 1);
        bg.fillRect(0, 0, 1200, 800);
    }

    createHeader() {
        const headerContainer = this.add.container(600, 30);

        const title = this.add.text(0, 0, 'Patient Status Table', {
            fontSize: '64px',
            fill: '#fff',
            fontFamily: 'Arial',
            fontWeight: 'bold',
        }).setOrigin(0.5);

        const subtitle = this.add.text(5, 70, 'Current Status of Patients in Trials', {
            fontSize: '24px',
            fill: '#bdc3c7',
            fontFamily: 'Arial',
        }).setOrigin(0.5);

        headerContainer.add([title, subtitle]);
    }

    createTable(data) {
        const startX = 100; // Starting X position for the table
        const startY = 200; // Starting Y position for the table
        const rowHeight = 40; // Height of each row
        const columnSpacing = 300; // Spacing between columns

        // Column headers
        this.add.text(startX, startY, 'Patient Statuses', {
            fontSize: '24px',
            fill: '#fff',
            fontFamily: 'Arial',
            fontWeight: 'bold',
        });

        this.add.text(startX + columnSpacing, startY, 'Total Patients', {
            fontSize: '24px',
            fill: '#fff',
            fontFamily: 'Arial',
            fontWeight: 'bold',
        });

        // Draw rows
        let rowIndex = 1;
        for (const [status, count] of Object.entries(data)) {
            const rowY = startY + rowIndex * rowHeight;

            // Status Name (Column 1)
            this.add.text(startX, rowY, status, {
                fontSize: '20px',
                fill: '#fff',
                fontFamily: 'Arial',
            });

            // Count (Column 2)
            this.add.text(startX + columnSpacing, rowY, count, {
                fontSize: '20px',
                fill: '#fff',
                fontFamily: 'Arial',
            });

            rowIndex++;
        }
    }
}
