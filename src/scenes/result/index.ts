import Phaser from 'phaser';
import { RESULT_SCENE_KEY } from '~/consts/sceneKeys';
import { createResultHud } from './createHud';

export class ResultScene extends Phaser.Scene {
  constructor() {
    super({ key: RESULT_SCENE_KEY });
  }

  preload() {}

  create(data: { elapsedMs?: number }) {
    const elapsedMs = data.elapsedMs ?? 0;

    createResultHud(this, elapsedMs);
  }

  update() {}
}
