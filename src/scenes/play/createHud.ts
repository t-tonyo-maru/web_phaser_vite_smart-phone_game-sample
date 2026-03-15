import type Phaser from 'phaser';
import { JoystickController } from '~/components/joystick';
import { MiniMap } from '~/components/mini-map';
import { RoundButton } from '~/components/round-button';
import { GAME_HEIGHT, GAME_WIDTH } from '~/consts/gameConfig';
import {
  HUD_BUTTON,
  HUD_DASH_BUTTON,
  HUD_GUIDE_TEXT,
  HUD_MINI_MAP
} from '~/consts/hudConfig';
import { PLAY_FIELD_HEIGHT, PLAY_FIELD_WIDTH } from '~/scenes/play/config';
import { getSafeAreaInsetsInGame } from '~/utils/device/safeArea';
import { clamp } from '~/utils/math/math';

export interface PlayHudCreateResult {
  dashButton: RoundButton;
  joystick: JoystickController;
  miniMap: MiniMap;
}

/**
 * プレイシーンの HUD を生成する。
 * ダッシュボタン、ジョイスティック、ミニマップ、および操作ガイド表示を配置して返す。
 * @param scene HUD を描画する対象シーン
 * @param onDash ダッシュボタン押下時に呼び出すコールバック
 * @returns 生成した HUD コンポーネント一式
 */
export const createPlayHud = (
  scene: Phaser.Scene,
  onDash: () => void
): PlayHudCreateResult => {
  const safeArea = getSafeAreaInsetsInGame(scene);
  const dashRadius = clamp(
    GAME_WIDTH * HUD_BUTTON.radiusRatioByWidth,
    HUD_BUTTON.minRadius,
    HUD_BUTTON.maxRadius
  );
  const dashX =
    GAME_WIDTH - safeArea.right - HUD_BUTTON.edgeMargin - dashRadius;
  const dashY =
    GAME_HEIGHT - safeArea.bottom - HUD_BUTTON.edgeMargin - dashRadius;

  const dashButton = new RoundButton(scene, {
    x: dashX,
    y: dashY,
    radius: dashRadius,
    label: HUD_DASH_BUTTON.label,
    color: HUD_DASH_BUTTON.color,
    pressedColor: HUD_DASH_BUTTON.pressedColor,
    textStyle: {
      fontSize: `${Math.round(dashRadius * 0.6)}px`,
      color: '#ffffff',
      fontStyle: 'bold'
    },
    onClick: onDash
  });
  dashButton.setDepth(1500).setScrollFactor(0);

  scene.input.addPointer(2);
  const joystick = new JoystickController(scene, {
    exclusionZones: [dashButton.getBounds()]
  });

  const miniMapWidth = Math.max(
    HUD_MINI_MAP.minWidth,
    Math.round(GAME_WIDTH * HUD_MINI_MAP.widthRatioByWidth)
  );
  const miniMapHeight = Math.max(
    HUD_MINI_MAP.minHeight,
    Math.round(GAME_HEIGHT * HUD_MINI_MAP.heightRatioByHeight)
  );

  const miniMap = new MiniMap(scene, {
    x: GAME_WIDTH - safeArea.right - HUD_BUTTON.edgeMargin - miniMapWidth,
    y: safeArea.top + HUD_BUTTON.edgeMargin,
    width: miniMapWidth,
    height: miniMapHeight,
    worldWidth: PLAY_FIELD_WIDTH,
    worldHeight: PLAY_FIELD_HEIGHT
  });

  const guideFontSize = Math.round(
    clamp(
      GAME_WIDTH * HUD_GUIDE_TEXT.fontSizeRatioByWidth,
      HUD_GUIDE_TEXT.minFontSize,
      HUD_GUIDE_TEXT.maxFontSize
    )
  );

  scene.add
    .text(
      safeArea.left + HUD_BUTTON.edgeMargin,
      safeArea.top + HUD_BUTTON.edgeMargin,
      'Move: Joystick / Dash: Button',
      {
        fontSize: `${guideFontSize}px`,
        color: '#ffffff'
      }
    )
    .setScrollFactor(0)
    .setDepth(1200);

  return {
    dashButton,
    joystick,
    miniMap
  };
};
