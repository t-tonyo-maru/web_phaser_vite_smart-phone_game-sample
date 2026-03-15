import Phaser from 'phaser';

export interface RoundButtonConfig {
  x: number;
  y: number;
  radius: number;
  label?: string;
  textStyle?: Phaser.Types.GameObjects.Text.TextStyle;
  color?: number;
  alpha?: number;
  pressedColor?: number;
  strokeColor?: number;
  strokeWidth?: number;
  onClick: () => void;
}

/**
 * タッチ UI 向けの円形ボタンコンポーネント。
 *
 * 当たり判定は画面上のポインター座標をそのまま使って行うため、
 * メインカメラがスクロールしていても正しく動作する。
 */
export class RoundButton {
  private readonly scene: Phaser.Scene;
  private readonly container: Phaser.GameObjects.Container;
  private readonly bg: Phaser.GameObjects.Arc;
  private readonly labelText: Phaser.GameObjects.Text | undefined;
  private readonly config: Required<RoundButtonConfig>;
  private pressedPointerId: number | undefined;

  constructor(scene: Phaser.Scene, config: RoundButtonConfig) {
    this.scene = scene;

    this.config = {
      ...config,
      label: config.label ?? '',
      textStyle: config.textStyle ?? {
        fontSize: '108px',
        color: '#ffffff',
        fontFamily: 'Arial'
      },
      color: config.color ?? 0x3498db,
      alpha: config.alpha ?? 1,
      pressedColor: config.pressedColor ?? 0x2980b9,
      strokeColor: config.strokeColor ?? 0xffffff,
      strokeWidth: config.strokeWidth ?? 3
    };

    this.bg = scene.add
      .circle(0, 0, this.config.radius, this.config.color, this.config.alpha)
      .setStrokeStyle(this.config.strokeWidth, this.config.strokeColor, 0.8);

    const children: Phaser.GameObjects.GameObject[] = [this.bg];

    if (this.config.label) {
      this.labelText = scene.add
        .text(0, 0, this.config.label, this.config.textStyle)
        .setOrigin(0.5);
      children.push(this.labelText);
    }

    this.container = scene.add.container(config.x, config.y, children);

    // シーン全体のポインターイベントとスクリーン座標での当たり判定を使う。
    // これによりカメラスクロール位置に依存せずボタンが正しく動作する。
    scene.input.on('pointerdown', this.onPointerDown, this);
    scene.input.on('pointerup', this.onPointerUp, this);
    scene.input.on('pointerupoutside', this.onPointerUp, this);

    scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.destroy());
  }

  /**
   * ボタンコンテナの描画深度を設定する。
   * @param depth 設定する深度
   * @returns メソッドチェーン用の自身
   */
  setDepth(depth: number): this {
    this.container.setDepth(depth);
    return this;
  }

  /**
   * ボタンコンテナのスクロール係数を設定する。
   * @param x X 方向のスクロール係数
   * @param y Y 方向のスクロール係数。省略時は x と同値
   * @returns メソッドチェーン用の自身
   */
  setScrollFactor(x: number, y?: number): this {
    this.container.setScrollFactor(x, y);
    return this;
  }

  /**
   * ボタンの表示・非表示を切り替える。
   * @param visible 表示する場合は true
   * @returns メソッドチェーン用の自身
   */
  setVisible(visible: boolean): this {
    this.container.setVisible(visible);
    return this;
  }

  /**
   * ジョイスティック除外領域などに利用できる外接矩形を返す。
   * @returns ボタンのスクリーン座標系における矩形
   */
  getBounds(): { x: number; y: number; width: number; height: number } {
    const r = this.config.radius;
    return {
      x: this.config.x - r,
      y: this.config.y - r,
      width: r * 2,
      height: r * 2
    };
  }

  /**
   * リソースとイベントリスナーを解放する。
   */
  destroy(): void {
    this.scene.input.off('pointerdown', this.onPointerDown, this);
    this.scene.input.off('pointerup', this.onPointerUp, this);
    this.scene.input.off('pointerupoutside', this.onPointerUp, this);
    this.container.destroy();
  }

  /**
   * ポインター座標が円形ボタン内に含まれるかを判定する。
   * @param pointer 判定対象のポインター
   * @returns ボタン内であれば true
   */
  private isInside(pointer: Phaser.Input.Pointer): boolean {
    const dx = pointer.x - this.config.x;
    const dy = pointer.y - this.config.y;
    return dx * dx + dy * dy <= this.config.radius * this.config.radius;
  }

  /**
   * ポインター押下時の処理を行う。
   * ボタン内で押された場合に押下状態へ遷移し、見た目を更新する。
   * @param pointer 押下イベントのポインター
   */
  private onPointerDown(pointer: Phaser.Input.Pointer): void {
    if (this.pressedPointerId !== undefined) return;
    if (!this.isInside(pointer)) return;

    this.pressedPointerId = pointer.id;
    this.bg.setFillStyle(this.config.pressedColor, this.config.alpha);
    this.container.setScale(0.93);
  }

  /**
   * ポインター解放時の処理を行う。
   * 押下中のポインターがボタン内で離された場合にクリックを発火する。
   * @param pointer 解放イベントのポインター
   */
  private onPointerUp(pointer: Phaser.Input.Pointer): void {
    if (pointer.id !== this.pressedPointerId) return;

    const wasInside = this.isInside(pointer);
    this.pressedPointerId = undefined;
    this.bg.setFillStyle(this.config.color, this.config.alpha);
    this.container.setScale(1);

    if (wasInside) {
      this.config.onClick();
    }
  }
}
