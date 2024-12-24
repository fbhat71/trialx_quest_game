import Phaser from 'phaser';

export default class TrialsChartScene extends Phaser.Scene {
    constructor() {
        super('TrialsChartScene');
    }

    init(data) {
        this.barData = data.barData;
    }

    create() {
        this.createBackground();
        this.drawBarChart(this.barData);
    }

    createBackground() {
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x1a2a3f, 0x1a2a3f, 0x0f1c2d, 0x0f1c2d, 1);
        bg.fillRect(0, 0, 1200, 800);
    }

    drawBarChart(data) {
        const barChartX = 200; // X position for the chart
        const barChartY = 500; // Y position for the chart
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
}
