import type Phaser from 'phaser';
import { Button } from '~/components/buttons';
import { TITLE_SCENE_KEY } from '~/consts/sceneKeys';

/**
 * リザルトシーンの HUD を生成する。
 * 経過時間の表示と、タイトルシーンへ戻るボタンを配置する。
 * @param scene HUD を描画する対象シーン
 * @param elapsedMs ゴールまでの経過時間（ミリ秒）
 */
export const createResultHud = (
  scene: Phaser.Scene,
  elapsedMs: number
): void => {
  const seconds = (elapsedMs / 1000).toFixed(2);

  scene.add
    .text(scene.cameras.main.centerX, 102, 'Result Scene', {
      fontSize: '96px',
      color: '#fff'
    })
    .setOrigin(0.5);

  scene.add
    .text(
      scene.cameras.main.centerX,
      scene.cameras.main.centerY - 200,
      `Goal Time:\n${seconds} sec`,
      {
        fontSize: '88px',
        color: '#FFD700'
      }
    )
    .setOrigin(0.5);

  new Button(scene, {
    x: scene.cameras.main.centerX,
    y: scene.cameras.main.centerY,
    width: 620,
    height: 150,
    text: 'Go to Title!',
    backgroundColor: 0x3a5ce0,
    hoverBackgroundColor: 0x2742ad,
    borderColor: 0xffffff,
    borderWidth: 3,
    borderRadius: 26,
    textStyle: {
      fontSize: '70px',
      color: '#ffffff',
      fontStyle: 'bold'
    },
    onClick: () => {
      scene.scene.start(TITLE_SCENE_KEY);
    }
  });
};
