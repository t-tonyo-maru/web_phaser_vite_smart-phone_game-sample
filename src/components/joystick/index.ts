import Phaser from 'phaser';
import { clampToLength, normalizeVector } from '~/utils/vector/vector';

export interface JoystickExclusionZone {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface JoystickConfig {
  baseRadius?: number;
  thumbRadius?: number;
  baseColor?: number;
  baseAlpha?: number;
  thumbColor?: number;
  thumbAlpha?: number;
  strokeWidth?: number;
  strokeColor?: number;
  strokeAlpha?: number;
  exclusionZones?: JoystickExclusionZone[];
}

/**
 * タッチ・マウス入力用の仮想ジョイスティックコントローラー。
 * ジョイスティック入力の管理だけを担当する。
 */
export class JoystickController {
  private scene: Phaser.Scene;
  private fixedCircle: Phaser.GameObjects.Arc;
  private movableCircle: Phaser.GameObjects.Arc;
  private center = new Phaser.Math.Vector2(0, 0);
  private vector = new Phaser.Math.Vector2(0, 0);
  private pointerId: number | undefined;
  private readonly baseRadius: number;
  private readonly thumbRadius: number;
  private readonly exclusionZones: JoystickExclusionZone[];

  constructor(scene: Phaser.Scene, config: JoystickConfig = {}) {
    this.scene = scene;
    this.baseRadius = config.baseRadius ?? 168;
    this.thumbRadius = config.thumbRadius ?? 102;
    this.exclusionZones = config.exclusionZones ?? [];

    // 外側の固定円を作成する
    this.fixedCircle = this.scene.add
      .circle(
        0,
        0,
        this.baseRadius,
        config.baseColor ?? 0xffffff,
        config.baseAlpha ?? 0.18
      )
      .setStrokeStyle(
        config.strokeWidth ?? 2,
        config.strokeColor ?? 0xffffff,
        config.strokeAlpha ?? 0.5
      )
      .setDepth(1000)
      .setScrollFactor(0)
      .setVisible(false);

    // 内側の可動円を作成する
    this.movableCircle = this.scene.add
      .circle(
        0,
        0,
        this.thumbRadius,
        config.thumbColor ?? 0xffffff,
        config.thumbAlpha ?? 0.5
      )
      .setDepth(1001)
      .setScrollFactor(0)
      .setVisible(false);

    // 入力ハンドラーを登録する
    this.scene.input.on('pointerdown', this.handlePointerDown, this);
    this.scene.input.on('pointermove', this.handlePointerMove, this);
    this.scene.input.on('pointerup', this.handlePointerUp, this);
    this.scene.input.on('pointerupoutside', this.handlePointerUp, this);

    // シーンを破棄したときに、JoyStick も破棄する
    this.scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.destroy();
    });
  }

  /**
   * 現在のジョイスティック入力ベクトルを返す。
   * @returns x と y がそれぞれ -1 から 1 に正規化されたベクトル
   */
  getVector(): Phaser.Math.Vector2 {
    return this.vector;
  }

  /**
   * ジョイスティックが現在操作中かを返す。
   */
  isActive(): boolean {
    return this.pointerId !== undefined;
  }

  /**
   * リソースとイベントリスナーを解放する。
   */
  destroy(): void {
    this.scene.input.off('pointerdown', this.handlePointerDown, this);
    this.scene.input.off('pointermove', this.handlePointerMove, this);
    this.scene.input.off('pointerup', this.handlePointerUp, this);
    this.scene.input.off('pointerupoutside', this.handlePointerUp, this);

    this.fixedCircle.destroy();
    this.movableCircle.destroy();
  }

  /**
   * ポインター押下時の処理を行う。
   * 既に操作中でない場合のみ、除外領域チェックを通過したポインターを操作対象として開始する。
   * @param pointer 押下イベントのポインター情報
   */
  private handlePointerDown(pointer: Phaser.Input.Pointer): void {
    if (this.pointerId !== undefined) return;

    // ポインターが除外領域内かどうかを確認する
    for (const zone of this.exclusionZones) {
      if (
        pointer.x >= zone.x &&
        pointer.x <= zone.x + zone.width &&
        pointer.y >= zone.y &&
        pointer.y <= zone.y + zone.height
      ) {
        return; // 除外領域のタッチは無視する
      }
    }

    this.pointerId = pointer.id;
    this.center.set(pointer.x, pointer.y);

    this.fixedCircle.setPosition(pointer.x, pointer.y).setVisible(true);
    this.movableCircle.setPosition(pointer.x, pointer.y).setVisible(true);

    this.updateFromPointer(pointer);
  }

  /**
   * ポインター移動時の処理を行う。
   * 現在操作中のポインターに一致した場合のみ、ジョイスティック入力を更新する。
   * @param pointer 移動イベントのポインター情報
   */
  private handlePointerMove(pointer: Phaser.Input.Pointer): void {
    if (pointer.id !== this.pointerId) return;

    this.updateFromPointer(pointer);
  }

  /**
   * ポインター解放時の処理を行う。
   * 操作中のポインターが離されたら入力をリセットし、ジョイスティック表示を非表示にする。
   * @param pointer 解放イベントのポインター情報
   */
  private handlePointerUp(pointer: Phaser.Input.Pointer): void {
    if (pointer.id !== this.pointerId) return;

    this.pointerId = undefined;
    this.vector.set(0, 0);
    this.fixedCircle.setVisible(false);
    this.movableCircle.setVisible(false);
  }

  /**
   * ポインター位置からジョイスティックの見た目と入力ベクトルを更新する。
   * 可動円は固定円の半径内に収め、入力ベクトルは -1 から 1 の範囲に正規化して設定する。
   * @param pointer 現在位置を反映するポインター情報
   */
  private updateFromPointer(pointer: Phaser.Input.Pointer): void {
    const dx = pointer.x - this.center.x;
    const dy = pointer.y - this.center.y;

    const clamped = clampToLength(dx, dy, this.baseRadius);
    const thumbX = this.center.x + clamped.x;
    const thumbY = this.center.y + clamped.y;

    this.movableCircle.setPosition(thumbX, thumbY);

    if (dx === 0 && dy === 0) {
      this.vector.set(0, 0);
      return;
    }

    const length = Math.hypot(dx, dy);
    const scale = Math.min(length, this.baseRadius) / this.baseRadius;
    const { x: nx, y: ny } = normalizeVector(dx, dy);
    this.vector.set(nx * scale, ny * scale);
  }
}
