import Phaser from 'phaser';

export interface ButtonConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  textStyle?: Phaser.Types.GameObjects.Text.TextStyle;
  backgroundColor?: number;
  backgroundAlpha?: number;
  hoverBackgroundColor?: number;
  hoverBackgroundAlpha?: number;
  borderColor?: number;
  borderWidth?: number;
  borderRadius?: number;
  onClick: () => void;
}

/**
 * Phaser シーンで再利用できるボタンコンポーネント。
 * ボタンの描画と操作処理を担当する。
 */
export class Button {
  private readonly scene: Phaser.Scene;
  private readonly container: Phaser.GameObjects.Container;
  private readonly background: Phaser.GameObjects.Graphics;
  private readonly text: Phaser.GameObjects.Text;
  private readonly config: Required<ButtonConfig>;
  private pressedPointerId: number | undefined;

  constructor(scene: Phaser.Scene, config: ButtonConfig) {
    this.scene = scene;

    // デフォルト値を設定する
    this.config = {
      ...config,
      textStyle: config.textStyle ?? {
        fontSize: '72px',
        color: '#ffffff',
        fontFamily: 'Arial'
      },
      backgroundColor: config.backgroundColor ?? 0x4a90e2,
      backgroundAlpha: config.backgroundAlpha ?? 1,
      hoverBackgroundColor: config.hoverBackgroundColor ?? 0x357abd,
      hoverBackgroundAlpha: config.hoverBackgroundAlpha ?? 1,
      borderColor: config.borderColor ?? 0xffffff,
      borderWidth: config.borderWidth ?? 0,
      borderRadius: config.borderRadius ?? 8
    };

    // 背景描画用の Graphics を作成する
    this.background = this.scene.add.graphics();
    this.drawBackground(false);

    // テキストを作成する
    this.text = this.scene.add.text(
      0,
      0,
      this.config.text,
      this.config.textStyle
    );
    this.text.setOrigin(0.5);

    // 要素をまとめるコンテナを作成する
    this.container = this.scene.add.container(this.config.x, this.config.y, [
      this.background,
      this.text
    ]);

    // カメラスクロールやマルチタッチ環境でも動作させるため、シーン全体でポインターイベントを処理する。
    this.scene.input.on('pointerdown', this.handlePointerDown, this);
    this.scene.input.on('pointerup', this.handlePointerUp, this);
    this.scene.input.on('pointerupoutside', this.handlePointerUp, this);

    // シーンを破棄したときに、ボタンも破棄する
    this.scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.destroy();
    });
  }

  /**
   * 内部で保持している Phaser のコンテナを返す。
   */
  getContainer(): Phaser.GameObjects.Container {
    return this.container;
  }

  /**
   * ボタンの表示テキストを更新する。
   */
  setText(text: string): this {
    this.text.setText(text);
    return this;
  }

  /**
   * ボタンの位置を設定する。
   */
  setPosition(x: number, y: number): this {
    this.container.setPosition(x, y);
    return this;
  }

  /**
   * ボタンの表示状態を設定する。
   */
  setVisible(visible: boolean): this {
    this.container.setVisible(visible);
    return this;
  }

  /**
   * ボタンの描画深度を設定する。
   */
  setDepth(depth: number): this {
    this.container.setDepth(depth);
    return this;
  }

  /**
   * ボタンのスクロール係数を設定する。
   */
  setScrollFactor(x: number, y?: number): this {
    this.container.setScrollFactor(x, y);
    return this;
  }

  /**
   * リソースとイベントリスナーを解放する。
   */
  destroy(): void {
    this.scene.input.off('pointerdown', this.handlePointerDown, this);
    this.scene.input.off('pointerup', this.handlePointerUp, this);
    this.scene.input.off('pointerupoutside', this.handlePointerUp, this);

    this.background.destroy();
    this.text.destroy();
    this.container.destroy();
  }

  /** ジョイスティック除外領域などに使えるスクリーン座標系の矩形 */
  getBounds(): { x: number; y: number; width: number; height: number } {
    return {
      x: this.config.x - this.config.width / 2,
      y: this.config.y - this.config.height / 2,
      width: this.config.width,
      height: this.config.height
    };
  }

  /**
   * ボタン背景を現在状態に応じた色と透明度で再描画する。
   * @param isHover ホバー（押下）状態として描画する場合は true
   */
  private drawBackground(isHover: boolean): void {
    this.background.clear();

    const color = isHover
      ? this.config.hoverBackgroundColor
      : this.config.backgroundColor;
    const alpha = isHover
      ? this.config.hoverBackgroundAlpha
      : this.config.backgroundAlpha;

    this.background.fillStyle(color, alpha);

    if (this.config.borderWidth > 0) {
      this.background.lineStyle(
        this.config.borderWidth,
        this.config.borderColor,
        1
      );
    }

    const x = -this.config.width / 2;
    const y = -this.config.height / 2;

    if (this.config.borderRadius > 0) {
      this.background.fillRoundedRect(
        x,
        y,
        this.config.width,
        this.config.height,
        this.config.borderRadius
      );
      if (this.config.borderWidth > 0) {
        this.background.strokeRoundedRect(
          x,
          y,
          this.config.width,
          this.config.height,
          this.config.borderRadius
        );
      }
    } else {
      this.background.fillRect(x, y, this.config.width, this.config.height);
      if (this.config.borderWidth > 0) {
        this.background.strokeRect(x, y, this.config.width, this.config.height);
      }
    }
  }

  /**
   * 指定ポインター座標がボタン矩形内にあるかを判定する。
   * @param pointer 判定対象のポインター
   * @returns ボタン内であれば true
   */
  private isInside(pointer: Phaser.Input.Pointer): boolean {
    const left = this.config.x - this.config.width / 2;
    const right = this.config.x + this.config.width / 2;
    const top = this.config.y - this.config.height / 2;
    const bottom = this.config.y + this.config.height / 2;
    return (
      pointer.x >= left &&
      pointer.x <= right &&
      pointer.y >= top &&
      pointer.y <= bottom
    );
  }

  /**
   * ポインター押下時に対象がボタン内であれば押下状態を開始する。
   * @param pointer 押下イベントのポインター
   */
  private handlePointerDown(pointer: Phaser.Input.Pointer): void {
    if (this.pressedPointerId !== undefined) return;
    if (!this.isInside(pointer)) return;

    this.pressedPointerId = pointer.id;
    this.drawBackground(true);
    this.container.setScale(0.95);
  }

  /**
   * 押下中ポインターの解放を処理し、ボタン内で離された場合にクリックを発火する。
   * @param pointer 解放イベントのポインター
   */
  private handlePointerUp(pointer: Phaser.Input.Pointer): void {
    if (pointer.id !== this.pressedPointerId) return;

    const wasInside = this.isInside(pointer);
    this.pressedPointerId = undefined;
    this.drawBackground(false);
    this.container.setScale(1);

    if (wasInside) {
      this.config.onClick();
    }
  }
}
