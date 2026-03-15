import Phaser from 'phaser';
import { lerp } from '~/utils/math/math';

export interface FocusPointConfig {
  /** 0 で即時追従、1 で停止。既定値: 0.08 */
  lerpFactor?: number;
}

/**
 * 注視点エンティティ。
 * カメラの注視対象として振る舞い、毎フレームなめらかにプレイヤーへ追従する。
 * カメラはプレイヤー自身ではなくこのオブジェクトを追うことで、
 * 少し遅れて追従する表現を作る。
 */
export class FocusPoint extends Phaser.GameObjects.GameObject {
  x: number;
  y: number;
  private readonly lerpFactor: number;

  constructor(
    scene: Phaser.Scene,
    startX: number,
    startY: number,
    config: FocusPointConfig = {}
  ) {
    super(scene, 'FocusPoint');
    scene.add.existing(this);

    this.x = startX;
    this.y = startY;
    this.lerpFactor = config.lerpFactor ?? 0.08;
  }

  /**
   * 注視点の位置を目標座標へ更新する。
   * シーンの update() から毎フレーム呼び出す。
   */
  updateTarget(targetX: number, targetY: number): void {
    this.x = lerp(this.x, targetX, this.lerpFactor);
    this.y = lerp(this.y, targetY, this.lerpFactor);
  }
}
