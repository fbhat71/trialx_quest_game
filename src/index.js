import Phaser from 'phaser';
import RoleSelectionScene from './scenes/RoleSelectionScene';
import TrialSelectionScene from './scenes/TrialSelectionScene';
import GameScene from './scenes/GameScene';
import PatientTrialScene from './scenes/PatientTrialScene';
import PatientEligibilityGame from './scenes/PatientEligibilityGame';

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
    scene: [RoleSelectionScene, TrialSelectionScene, GameScene, PatientTrialScene, PatientEligibilityGame]
};

new Phaser.Game(config); 