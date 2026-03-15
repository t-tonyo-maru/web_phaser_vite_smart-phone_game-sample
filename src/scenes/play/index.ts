import Phaser from 'phaser';
import connpassImg from '~/assets/image/connpass.png';
import doorImg from '~/assets/image/door.png';
import playerImg from '~/assets/image/player.png';
import skyImg from '~/assets/image/sky.png';
import type { JoystickController } from '~/components/joystick';
import type { MiniMap } from '~/components/mini-map';
import { JOYSTICK_THRESHOLD } from '~/consts/hudConfig';
import { PLAY_SCENE_KEY, RESULT_SCENE_KEY } from '~/consts/sceneKeys';
import type { FocusPoint } from '~/entities/focus-point';
import type { Player } from '~/entities/player';
import {
  CAMERA_FOCUS_OFFSET_X,
  CAMERA_FOCUS_OFFSET_Y
} from '~/scenes/play/config';
import { resolveDashDirection } from '~/utils/input/resolveDashDirection';
import {
  resolveJoystickInput,
  resolveMoveDirection
} from '~/utils/input/resolveJoystickInput';
import { createPlayHud } from './createHud';
import { createPlayWorld } from './createWorld';

export class PlayScene extends Phaser.Scene {
  private player: Player | undefined;
  private focusPoint: FocusPoint | undefined;
  private goal: Phaser.Physics.Arcade.Image | undefined;
  private joystick: JoystickController | undefined;
  private miniMap: MiniMap | undefined;
  private lastMoveDirection = new Phaser.Math.Vector2(1, 0);
  private startedAtMs = 0;

  constructor() {
    super({ key: PLAY_SCENE_KEY });
  }

  preload() {
    this.load.spritesheet('player', playerImg, {
      frameWidth: 32,
      frameHeight: 48
    });
    this.load.image('sky', skyImg);
    this.load.image('door', doorImg);
    this.load.image('connpass', connpassImg);
  }

  create() {
    this.startedAtMs = this.time.now;

    const world = createPlayWorld(this, () => {
      this.handleReachGoal();
    });
    this.player = world.player;
    this.focusPoint = world.focusPoint;
    this.goal = world.goal;

    const hud = createPlayHud(this, () => {
      this.handleDashPress();
    });
    this.joystick = hud.joystick;
    this.miniMap = hud.miniMap;
  }

  update() {
    if (
      !this.player ||
      !this.focusPoint ||
      !this.goal ||
      !this.joystick ||
      !this.miniMap
    ) {
      return;
    }

    this.focusPoint.updateTarget(
      this.player.x + CAMERA_FOCUS_OFFSET_X,
      this.player.y + CAMERA_FOCUS_OFFSET_Y
    );

    const input = resolveJoystickInput(
      this.joystick.getVector(),
      JOYSTICK_THRESHOLD
    );

    this.player.handleInput(input);

    const moveDirection = resolveMoveDirection(input);
    if (moveDirection) {
      this.lastMoveDirection.set(moveDirection.x, moveDirection.y);
    }

    this.miniMap.drawPlayerAndGoal(
      this.player.x,
      this.player.y,
      this.goal.x,
      this.goal.y
    );
  }

  /**
   * ダッシュボタン押下時の処理を行う。
   * ジョイスティック入力と直前の移動方向からダッシュ方向を決定し、プレイヤーへ適用する。
   */
  private handleDashPress(): void {
    if (!this.player || !this.joystick) return;

    const dashDirection = resolveDashDirection(
      this.joystick.getVector(),
      this.lastMoveDirection
    );

    this.player.dashToward(
      new Phaser.Math.Vector2(dashDirection.x, dashDirection.y)
    );
  }

  /**
   * ゴール到達時の処理を行う。
   * プレイ開始からの経過時間を算出して、リザルトシーンへ遷移する。
   */
  private handleReachGoal(): void {
    const elapsedMs = this.time.now - this.startedAtMs;
    this.scene.start(RESULT_SCENE_KEY, { elapsedMs });
  }
}
