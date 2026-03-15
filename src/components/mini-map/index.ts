import Phaser from 'phaser';

export interface MiniMapConfig {
  /** 画面上のミニマップ左上 X 座標 */
  x?: number;
  /** 画面上のミニマップ左上 Y 座標 */
  y?: number;
  width?: number;
  height?: number;
  /** ミニマップが表すワールド幅 */
  worldWidth: number;
  /** ミニマップが表すワールド高さ */
  worldHeight: number;
  backgroundColor?: number;
  backgroundAlpha?: number;
  borderColor?: number;
  playerColor?: number;
  goalColor?: number;
}

/**
 * ミニマップコンポーネント。
 * エンティティ位置を俯瞰表示する小さな地図の描画を担当する。
 */
export class MiniMap {
  private readonly gfx: Phaser.GameObjects.Graphics;
  private readonly cfg: Required<MiniMapConfig>;
  private destroyed = false;

  constructor(scene: Phaser.Scene, config: MiniMapConfig) {
    this.cfg = {
      x: config.x ?? 20,
      y: config.y ?? 20,
      width: config.width ?? 200,
      height: config.height ?? 160,
      worldWidth: config.worldWidth,
      worldHeight: config.worldHeight,
      backgroundColor: config.backgroundColor ?? 0x000000,
      backgroundAlpha: config.backgroundAlpha ?? 0.5,
      borderColor: config.borderColor ?? 0xffffff,
      playerColor: config.playerColor ?? 0x00ff00,
      goalColor: config.goalColor ?? 0xffd700
    };

    this.gfx = scene.add.graphics();
    this.gfx.setDepth(2000).setScrollFactor(0);

    scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.destroy();
    });
  }

  /**
   * プレイヤーとゴールのワールド座標をミニマップ座標へ変換して描画する。
   * 背景と枠線も毎回描き直し、最新状態のミニマップ表示に更新する。
   * @param playerX プレイヤーのワールド X 座標
   * @param playerY プレイヤーのワールド Y 座標
   * @param goalX ゴールのワールド X 座標
   * @param goalY ゴールのワールド Y 座標
   */
  drawPlayerAndGoal(
    playerX: number,
    playerY: number,
    goalX: number,
    goalY: number
  ): void {
    const { x, y, width, height, worldWidth, worldHeight } = this.cfg;

    this.gfx.clear();

    this.gfx.fillStyle(this.cfg.backgroundColor, this.cfg.backgroundAlpha);
    this.gfx.fillRect(x, y, width, height);

    this.gfx.lineStyle(2, this.cfg.borderColor, 0.8);
    this.gfx.strokeRect(x, y, width, height);

    const toMapX = (wx: number) => x + (wx / worldWidth) * width;
    const toMapY = (wy: number) => y + (wy / worldHeight) * height;

    this.gfx.fillStyle(this.cfg.goalColor, 1);
    this.gfx.fillCircle(toMapX(goalX), toMapY(goalY), 5);

    this.gfx.fillStyle(this.cfg.playerColor, 1);
    this.gfx.fillCircle(toMapX(playerX), toMapY(playerY), 5);
  }

  /**
   * ミニマップ描画リソースを破棄する。
   * 複数回呼ばれても安全なように、初回のみ破棄処理を実行する。
   */
  destroy(): void {
    if (this.destroyed) return;
    this.destroyed = true;
    this.gfx.destroy();
  }
}
