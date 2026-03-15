import Phaser from 'phaser';
import { TITLE_SCENE_KEY } from '~/consts/sceneKeys';
import { createTitleHud } from './createHud';

export class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: TITLE_SCENE_KEY });
  }

  preload() {}

  create() {
    createTitleHud(this);
  }

  update() {}
}
