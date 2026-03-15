import type Phaser from 'phaser';

export interface SafeAreaInsets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

const parsePx = (value: string): number => {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const readSafeAreaInsetsCssPx = (): SafeAreaInsets => {
  const styles = window.getComputedStyle(document.documentElement);

  return {
    top: parsePx(styles.getPropertyValue('--safe-area-top')),
    right: parsePx(styles.getPropertyValue('--safe-area-right')),
    bottom: parsePx(styles.getPropertyValue('--safe-area-bottom')),
    left: parsePx(styles.getPropertyValue('--safe-area-left'))
  };
};

/**
 * CSS ピクセルのセーフエリアを、ゲーム座標系へ変換して返す。
 */
export const getSafeAreaInsetsInGame = (
  scene: Phaser.Scene
): SafeAreaInsets => {
  const insetsPx = readSafeAreaInsetsCssPx();
  const displayScale = scene.scale.displayScale;

  const scaleX = displayScale.x || 1;
  const scaleY = displayScale.y || 1;

  return {
    top: insetsPx.top / scaleY,
    right: insetsPx.right / scaleX,
    bottom: insetsPx.bottom / scaleY,
    left: insetsPx.left / scaleX
  };
};
