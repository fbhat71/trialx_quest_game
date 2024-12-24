import Phaser from 'phaser';

export default class AnalyticsScene extends Phaser.Scene {
    constructor() {
        super('AnalyticsScene');
    }

    create() {
        this.createBackground();
        this.createHeader();

        // Fetch analytics data
        const analyticsData = this.getAnalyticsData();
        const barData = this.getBarData();

        // Display data in cards
        this.displayAnalyticsCards(analyticsData);

        // Draw bar chart
        this.drawBarChart(barData);
    }

    createBackground() {
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x1a2a3f, 0x1a2a3f, 0x0f1c2d, 0x0f1c2d, 1);
        bg.fillRect(0, 0, 1200, 800);
    }

    createHeader() {
        const headerContainer = this.add.container(600, 30);

        const title = this.add.text(0, 0, 'Analytics Dashboard', {
            fontSize: '64px',
            fill: '#fff',
            fontFamily: 'Arial',
            fontWeight: 'bold',
        }).setOrigin(0.5);

        const subtitle = this.add.text(5, 70, '', {
            fontSize: '24px',
            fill: '#bdc3c7',
            fontFamily: 'Arial',
        }).setOrigin(0.5);

        headerContainer.add([title, subtitle]);
    }

    getAnalyticsData() {
        return {
            totalPatients: 350,
            totalTrials: 20,
            totalRecruitment: 15,
            successfulTrials: 12,
            ongoingTrials: 8,
        };
    }

    getBarData() {
        return {
            Active: 11,
            InActive: 9,
        };
    }

    getPhaseData() {
        return {
            "Phase I": 7,
            "Phase II": 6,
            "Phase III": 3,
            "Phase IV" :2,
            "Phase V" : 2,
        };
    }

    displayAnalyticsCards(data) {
        const startX = 200; // Starting X position for the first card
        const startY = 200; // Starting Y position for the first row
        const cardWidth = 250; // Card width
        const cardHeight = 150; // Card height
        const horizontalSpacing = 300; // Horizontal spacing between cards
        const verticalSpacing = 200; // Vertical spacing between rows

        const dataEntries = Object.entries(data);

        dataEntries.forEach(([key, value], index) => {
            const row = Math.floor(index / 3); // Row index
            const col = index % 3; // Column index
            const cardX = startX + col * horizontalSpacing;
            const cardY = startY + row * verticalSpacing;

            const card = this.add.container(cardX, cardY);

            // Card background
            const cardBg = this.add.rectangle(0, 0, cardWidth, cardHeight, 0x34495e).setStrokeStyle(4, 0xffffff);

            // Title text with capitalized first letter
            const title = this.add.text(0, -30, key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()), {
                fontSize: '20px',
                fill: '#fff',
                fontFamily: 'Arial',
                align: 'center',
            }).setOrigin(0.5);

            // Value text
            const valueText = this.add.text(0, 30, value, {
                fontSize: '28px',
                fill: '#27ae60',
                fontFamily: 'Arial',
                fontWeight: 'bold',
            }).setOrigin(0.5);

            // Set the size of the container for hit detection
            card.setSize(cardWidth, cardHeight);  // Set the container's size for interactive detection

            // Make "Total Trials" card clickable
            if (key === 'totalTrials') {
                card.setInteractive();
                card.on('pointerdown', () => {
                    console.log('Total Trials clicked!');
                    this.scene.start('TrialsChartScene', { barData: this.getPhaseData() }); // Pass data to the next scene
                });
            }

            if (key === 'totalPatients') {
                card.setInteractive();
                card.on('pointerdown', () => {
                    console.log('Total Patients clicked!');
                    // Make sure you pass the patient status data
                    this.scene.start('PatientStatusScene', {
                        patientStatusData: this.getPatientStatusData() // Pass the data here
                    });
                });
            }


            if (key === 'ongoingTrials') {
                card.setInteractive();
                card.on('pointerdown', () => {
                    console.log('Total Ongoing Trials!');
                    // Correctly pass the ongoingTrialData to the next scene
                    this.scene.start('TreatmentDashboardScene', {
                        ongoingTrialData: [
                            { trialId: 1, treatmentName: 'New Vaccine', patientsInvolved: 30, successRate: 80, feedback: 'Positive response from most patients' },
                            { trialId: 2, treatmentName: 'Pain Relief Drug', patientsInvolved: 50, successRate: 75, feedback: 'Moderate effectiveness' },
                            { trialId: 3, treatmentName: 'Anticancer Therapy', patientsInvolved: 40, successRate: 90, feedback: 'Very promising results' },
                            { trialId: 4, treatmentName: 'Diabetes Medication', patientsInvolved: 35, successRate: 70, feedback: 'Need more trials for conclusive results' },
                            { trialId: 5, treatmentName: 'Heart Disease Drug', patientsInvolved: 25, successRate: 85, feedback: 'Good response from most patients' },
                            { trialId: 6, treatmentName: 'Blood Pressure Medicine', patientsInvolved: 60, successRate: 80, feedback: 'Successful in reducing blood pressure' },
                            { trialId: 7, treatmentName: 'Flu Vaccine', patientsInvolved: 45, successRate: 88, feedback: 'Effective for most people' },
                            { trialId: 8, treatmentName: 'Migraine Relief', patientsInvolved: 20, successRate: 65, feedback: 'Still under review' }
                        ]
                    });
                });
            }
            
            

            card.add([cardBg, title, valueText]);
        });
    }

    drawBarChart(data) {
        const barChartX = 300; // X position for the chart
        const barChartY = 700; // Y position for the chart
        const chartWidth = 1000; // Total width of the chart
        const chartHeight = 200; // Total height of the chart

        const dataValues = Object.values(data);
        const maxDataValue = Math.max(...dataValues);
        const barWidth = chartWidth / dataValues.length - 20; // Adjust bar width for spacing
        const barSpacing = (chartWidth - dataValues.length * barWidth) / (dataValues.length - 1); // Spacing between bars

        dataValues.forEach((value, index) => {
            const barHeight = (value / maxDataValue) * chartHeight; // Scale bars to fit chart height
            const barX = barChartX + index * (barWidth + barSpacing);
            const barY = barChartY - barHeight;

            // Bar
            this.add.rectangle(barX, barChartY - barHeight / 2, barWidth, barHeight, 0x3498db);

            // Label for each bar
            this.add.text(barX, barChartY + 20, Object.keys(data)[index], {
                fontSize: '14px',
                fill: '#fff',
                fontFamily: 'Arial',
                align: 'center',
            }).setOrigin(0.5);

            // Value above each bar
            this.add.text(barX, barY - 10, value, {
                fontSize: '16px',
                fill: '#27ae60',
                fontFamily: 'Arial',
                fontWeight: 'bold',
                align: 'center',
            }).setOrigin(0.5);
        });
    }

    // Example patient status data
    getPatientStatusData() {
        return {
            'Final - Declined Prior to Visit': 50,
            'Final - DQ': 40,
            'Additional Prescreener': 30,
            'Considering Participation': 80,
            'Attempting to Contact': 60,
            'All VWR - Follow Ups done': 90
        };
    }
}
