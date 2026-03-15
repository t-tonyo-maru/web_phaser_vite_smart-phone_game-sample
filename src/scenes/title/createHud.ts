import type Phaser from 'phaser';
import { Button } from '~/components/buttons';
import { PLAY_SCENE_KEY } from '~/consts/sceneKeys';
import { GAME_VERSION } from '~/consts/version';

/**
 * タイトルシーンの HUD を生成する。
 * ゲームタイトルや実行モード表示、およびゲーム開始ボタンを配置する。
 * @param scene HUD を描画する対象シーン
 */
export const createTitleHud = (scene: Phaser.Scene): void => {
  scene.add
    .text(scene.cameras.main.centerX, 102, `Game Title v${GAME_VERSION}`, {
      fontSize: '96px',
      color: '#fff'
    })
    .setOrigin(0.5);

  scene.add
    .text(
      scene.cameras.main.centerX,
      254,
      `Vite モード:\n${import.meta.env.MODE}`,
      {
        fontSize: '54px',
        color: '#fff'
      }
    )
    .setOrigin(0.5);

  new Button(scene, {
    x: scene.cameras.main.centerX,
    y: scene.cameras.main.centerY,
    width: 460,
    height: 160,
    text: 'PLAY!',
    backgroundColor: 0x1e8f5f,
    hoverBackgroundColor: 0x176d48,
    borderColor: 0xffffff,
    borderWidth: 3,
    borderRadius: 28,
    textStyle: {
      fontSize: '84px',
      color: '#ffffff',
      fontStyle: 'bold'
    },
    onClick: () => {
      scene.scene.start(PLAY_SCENE_KEY);
    }
  });
};
