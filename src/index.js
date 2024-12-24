import Phaser from 'phaser';
import RoleSelectionScene from './scenes/RoleSelectionScene';
import TrialSelectionScene from './scenes/TrialSelectionScene';
import GameScene from './scenes/GameScene';
import AnalyticsScene from './scenes/AnalyticsScene';
import TreatmentDashboardScene from './scenes/TreatmentDashboardScene';
import PatientStatusScene from './scenes/PatientStatusScene';
import TrialsChartScene from './scenes/TrialsChartScene';


const config = {
    type: Phaser.AUTO,
    width: 1200,
    height: 800,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    },
    scene: [RoleSelectionScene, TrialSelectionScene, GameScene, AnalyticsScene,TreatmentDashboardScene,PatientStatusScene,TrialsChartScene]

};

new Phaser.Game(config); 