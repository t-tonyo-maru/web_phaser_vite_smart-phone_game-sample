import Phaser from 'phaser';
import { normalizeVector } from '~/utils/vector/vector';

export interface PlayerConfig {
  velocity?: number;
  /** 0 で即時反応、1 で加速しない。既定値: 0.18 */
  inertia?: number;
  dashSpeed?: number;
  dashDurationMs?: number;
  bounce?: number;
  collideWorldBounds?: boolean;
  /** 被弾時のノックバック速度。既定値: 420 */
  knockbackSpeed?: number;
  /** ノックバック後の無敵時間と点滅時間（ミリ秒）。既定値: 4000 */
  invincibleDurationMs?: number;
}

export interface PlayerInput {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
}

/**
 * プレイヤーエンティティ。
 * プレイヤーのスプライト、物理挙動、アニメーション管理を担当する。
 */
export class Player extends Phaser.Physics.Arcade.Sprite {
  private static readonly SCALE_MULTIPLIER = 3;
  private readonly velocity: number;
  private readonly inertia: number;
  private readonly dashSpeed: number;
  private readonly dashDurationMs: number;
  private readonly lastDirection = new Phaser.Math.Vector2(1, 0);
  private isDashing = false;
  private readonly knockbackSpeed: number;
  private readonly invincibleDurationMs: number;
  private invincible = false;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    config: PlayerConfig = {}
  ) {
    super(scene, x, y, texture);

    // シーンに追加して物理演算を有効化する
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // 設定値を適用する
    this.setScale(Player.SCALE_MULTIPLIER);
    this.syncBodyAfterScale();

    this.velocity = config.velocity ?? 160;
    this.inertia = config.inertia ?? 0.18;
    this.dashSpeed = config.dashSpeed ?? 420;
    this.dashDurationMs = config.dashDurationMs ?? 140;
    this.setBounce(config.bounce ?? 0.01);
    this.setCollideWorldBounds(config.collideWorldBounds ?? true);
    this.knockbackSpeed = config.knockbackSpeed ?? 420;
    this.invincibleDurationMs = config.invincibleDurationMs ?? 4000;

    // アニメーションを設定する
    this.setupAnimations();
  }

  /**
   * プレイヤー用アニメーションを初期化する。
   */
  private setupAnimations(): void {
    const animsManager = this.scene.anims;

    // 左移動アニメーション
    if (!animsManager.exists('player_left')) {
      animsManager.create({
        key: 'player_left',
        frames: animsManager.generateFrameNumbers(this.texture.key, {
          start: 0,
          end: 3
        }),
        frameRate: 10,
        repeat: -1
      });
    }

    // 待機アニメーション
    if (!animsManager.exists('player_turn')) {
      animsManager.create({
        key: 'player_turn',
        frames: [{ key: this.texture.key, frame: 4 }],
        frameRate: 20
      });
    }

    // 右移動アニメーション
    if (!animsManager.exists('player_right')) {
      animsManager.create({
        key: 'player_right',
        frames: animsManager.generateFrameNumbers(this.texture.key, {
          start: 5,
          end: 8
        }),
        frameRate: 10,
        repeat: -1
      });
    }
  }

  /**
   * プレイヤーを左に移動させる。
   */
  moveLeft(): void {
    this.setVelocityX(-this.velocity);
    this.anims.play('player_left', true);
  }

  /**
   * プレイヤーを右に移動させる。
   */
  moveRight(): void {
    this.setVelocityX(this.velocity);
    this.anims.play('player_right', true);
  }

  /**
   * プレイヤーの移動を停止する。
   */
  stopMovement(): void {
    this.setVelocity(0, 0);
    this.anims.play('player_turn');
  }

  /**
   * 最後に向いていた方向へダッシュする。
   */
  dash(): void {
    if (this.isDashing) return;

    this.isDashing = true;
    this.playDashEffect();
    this.setVelocity(
      this.lastDirection.x * this.dashSpeed,
      this.lastDirection.y * this.dashSpeed
    );

    if (this.lastDirection.x < 0) {
      this.anims.play('player_left', true);
    } else if (this.lastDirection.x > 0) {
      this.anims.play('player_right', true);
    } else {
      this.anims.play('player_turn');
    }

    this.scene.time.delayedCall(this.dashDurationMs, () => {
      this.isDashing = false;
      this.setVelocity(0, 0);
    });
  }

  /**
   * 指定方向へダッシュする。方向は自動で正規化される。
   */
  dashToward(direction: Phaser.Math.Vector2): void {
    if (direction.lengthSq() > 0) {
      this.lastDirection.copy(direction).normalize();
    }
    this.dash();
  }

  /**
   * ダッシュ開始時の視覚エフェクトを再生する。
   * 本体のティント変更と残像のフェードアウトを行い、短時間後にティントを解除する。
   */
  private playDashEffect(): void {
    this.setTint(0x88e5ff);

    const afterImage = this.scene.add
      .image(this.x, this.y, this.texture.key, this.frame.name)
      .setScale(this.scaleX, this.scaleY)
      .setAlpha(0.6)
      .setDepth(this.depth - 1);

    this.scene.tweens.add({
      targets: afterImage,
      alpha: 0,
      duration: 200,
      ease: 'Quad.easeOut',
      onComplete: () => afterImage.destroy()
    });

    this.scene.time.delayedCall(120, () => {
      this.clearTint();
    });
  }

  /**
   * 入力状態に応じてプレイヤーを更新する。
   * 慣性を考慮した移動を行う。
   * @param input プレイヤーの入力状態
   */
  handleInput(input: PlayerInput): void {
    if (this.isDashing) return;

    const x = (input.right ? 1 : 0) - (input.left ? 1 : 0);
    const y = (input.down ? 1 : 0) - (input.up ? 1 : 0);

    const body = this.body as Phaser.Physics.Arcade.Body;

    if (x === 0 && y === 0) {
      // 慣性を考慮して減速する
      const vx = Phaser.Math.Linear(body.velocity.x, 0, this.inertia);
      const vy = Phaser.Math.Linear(body.velocity.y, 0, this.inertia);
      this.setVelocity(Math.abs(vx) < 1 ? 0 : vx, Math.abs(vy) < 1 ? 0 : vy);
      if (Math.abs(vx) < 1 && Math.abs(vy) < 1) {
        this.anims.play('player_turn');
      }
      return;
    }

    const length = Math.hypot(x, y);
    const nx = x / length;
    const ny = y / length;

    this.lastDirection.set(nx, ny);

    // 慣性を考慮して加速する
    const targetVx = nx * this.velocity;
    const targetVy = ny * this.velocity;
    this.setVelocity(
      Phaser.Math.Linear(body.velocity.x, targetVx, this.inertia),
      Phaser.Math.Linear(body.velocity.y, targetVy, this.inertia)
    );

    if (nx < 0) {
      this.anims.play('player_left', true);
    } else if (nx > 0) {
      this.anims.play('player_right', true);
    } else {
      this.anims.play('player_turn');
    }
  }

  /**
   * 指定座標から離れる方向へノックバックし、無敵点滅を開始する。
   * すでに無敵中なら何もしない。
   */
  knockback(fromX: number, fromY: number): void {
    if (this.invincible) return;

    const dx = this.x - fromX;
    const dy = this.y - fromY;
    const { x: nx, y: ny } = normalizeVector(dx, dy);

    this.setVelocity(nx * this.knockbackSpeed, ny * this.knockbackSpeed);
    this.startInvincible();
  }

  /** 被弾後の無敵時間中なら true を返す。 */
  getIsInvincible(): boolean {
    return this.invincible;
  }

  /**
   * 無敵状態を開始し、点滅アニメーションを再生する。
   * 既定時間の経過後にアルファ値を戻し、無敵状態を解除する。
   */
  private startInvincible(): void {
    this.invincible = true;

    // yoyo 1周期 = 120ms（減衰） + 120ms（復帰） = 240ms
    const repeat = Math.round(this.invincibleDurationMs / 240) - 1;

    this.scene.tweens.add({
      targets: this,
      alpha: 0.15,
      duration: 120,
      ease: 'Linear',
      yoyo: true,
      repeat,
      onComplete: () => {
        this.setAlpha(1);
        this.invincible = false;
      }
    });
  }

  /**
   * プレイヤーが地面に接しているかを返す。
   */
  isOnGround(): boolean {
    return this.body?.touching.down ?? false;
  }

  /**
   * 動的ボディのサイズをスケール後のスプライトサイズへ同期する。
   * 利用可能な場合は refreshBody も呼び、互換パスでも整合を保つ。
   */
  private syncBodyAfterScale(): void {
    const body = this.body as Phaser.Physics.Arcade.Body | undefined;
    body?.setSize(this.width, this.height, true);

    const refreshable = this as unknown as { refreshBody?: () => void };
    refreshable.refreshBody?.();
  }
}
