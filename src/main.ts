import Phaser from 'phaser';
import 'reset.css';
import './styles.css';

import { config } from './config';
import { setupPortraitOrientationPolicy } from './utils/device/orientationPolicy';

const game = new Phaser.Game(config);
setupPortraitOrientationPolicy();

window.addEventListener('resize', () => {
  game.scale.refresh();
});
