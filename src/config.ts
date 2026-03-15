import Phaser from 'phaser';
import { GAME_GRAVITY, GAME_HEIGHT, GAME_WIDTH } from '~/consts/gameConfig';
import { PlayScene } from '~/scenes/play';
import { ResultScene } from '~/scenes/result';
import { TitleScene } from '~/scenes/title';

export const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: GAME_WIDTH,
    height: GAME_HEIGHT
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: GAME_GRAVITY,
      debug: import.meta.env.MODE === 'development'
    }
  },
  scene: [TitleScene, PlayScene, ResultScene]
};
