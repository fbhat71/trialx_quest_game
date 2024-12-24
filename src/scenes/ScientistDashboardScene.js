import Phaser from 'phaser';
import { getScientistDashboardData } from '../services/scientistService';

export default class ScientistDashboardScene extends Phaser.Scene {
    constructor() {
        super('ScientistDashboardScene');
    }

    create() {
        this.createBackground();
        this.createHeader();

        // Fetch scientist dashboard data
        const stats = getScientistDashboardData();
        this.displayStats(stats);
    }

    createBackground() {
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x1a2a3f, 0x1a2a3f, 0x0f1c2d, 0x0f1c2d, 1);
        bg.fillRect(0, 0, 1200, 800);
    }

    createHeader() {
        const headerContainer = this.add.container(600, 80);

        // Main title
        const title = this.add.text(0, 0, 'Scientist Dashboard', {
            fontSize: '64px',
            fill: '#fff',
            fontFamily: 'Arial',
            fontWeight: 'bold'
        }).setOrigin(0.5);

        headerContainer.add([title]);
    }

    displayStats(stats) {
        const x = 600;
        const y = 300;
        const spacing = 100;

        // Display the total number of patients
        const patientsText = this.add.text(x, y, `Total Patients: ${stats.totalPatients}`, {
            fontSize: '32px',
            fill: '#fff',
            fontFamily: 'Arial',
        }).setOrigin(0.5);

        // Display the total number of trials
        const trialsText = this.add.text(x, y + spacing, `Total Trials: ${stats.totalTrials}`, {
            fontSize: '32px',
            fill: '#fff',
            fontFamily: 'Arial',
        }).setOrigin(0.5);
    }
}
