import Phaser from 'phaser';
import { FocusPoint } from '~/entities/focus-point';
import { Player } from '~/entities/player';
import {
  CAMERA_FOCUS_OFFSET_X,
  CAMERA_FOCUS_OFFSET_Y,
  GOAL_MARGIN,
  GOAL_MIN_DISTANCE_FROM_PLAYER,
  GOAL_SCALE,
  PLAY_FIELD_HEIGHT,
  PLAY_FIELD_WIDTH,
  PLAYER_DASH_DURATION_MS,
  PLAYER_DASH_SPEED,
  PLAYER_MOVE_SPEED,
  PLAYER_SPAWN_X,
  PLAYER_SPAWN_Y
} from '~/scenes/play/config';

export interface PlayWorldCreateResult {
  player: Player;
  focusPoint: FocusPoint;
  goal: Phaser.Physics.Arcade.Image;
}

/**
 * プレイシーンのワールド要素を生成して初期化する。
 * 背景、プレイヤー、カメラ追従用フォーカスポイント、ゴール配置、ゴール到達判定を構築する。
 * @param scene ワールドを生成する対象シーン
 * @param onReachGoal プレイヤーがゴールに重なった際に呼び出すコールバック
 * @returns 生成したプレイヤー・フォーカスポイント・ゴール
 */
export const createPlayWorld = (
  scene: Phaser.Scene,
  onReachGoal: () => void
): PlayWorldCreateResult => {
  scene.add
    .image(0, 0, 'sky')
    .setOrigin(0, 0)
    .setDisplaySize(PLAY_FIELD_WIDTH, PLAY_FIELD_HEIGHT)
    .setDepth(-1);

  scene.physics.world.setBounds(0, 0, PLAY_FIELD_WIDTH, PLAY_FIELD_HEIGHT);
  scene.cameras.main.setBounds(0, 0, PLAY_FIELD_WIDTH, PLAY_FIELD_HEIGHT);

  scene.add
    .image(PLAY_FIELD_WIDTH / 2, PLAY_FIELD_HEIGHT / 2, 'connpass')
    .setOrigin(0.5, 0.5);

  const player = new Player(scene, PLAYER_SPAWN_X, PLAYER_SPAWN_Y, 'player', {
    velocity: PLAYER_MOVE_SPEED,
    inertia: 0.18,
    dashSpeed: PLAYER_DASH_SPEED,
    dashDurationMs: PLAYER_DASH_DURATION_MS,
    bounce: 0,
    collideWorldBounds: true
  });

  const focusPoint = new FocusPoint(
    scene,
    player.x + CAMERA_FOCUS_OFFSET_X,
    player.y + CAMERA_FOCUS_OFFSET_Y
  );
  scene.cameras.main.startFollow(focusPoint, true, 0.12, 0.12);

  const goalPosition = createRandomGoalPosition();
  const goal = scene.physics.add
    .image(goalPosition.x, goalPosition.y, 'door')
    .setImmovable(true)
    .setScale(GOAL_SCALE)
    .setTint(0xffd54a);

  scene.add
    .text(goal.x, goal.y - 120, 'GOAL!', {
      fontSize: '60px',
      color: '#ffe169',
      fontStyle: 'bold',
      stroke: '#6b3f00',
      strokeThickness: 10
    })
    .setOrigin(0.5)
    .setDepth(goal.depth + 1);

  scene.physics.add.overlap(player, goal, onReachGoal);

  return {
    player,
    focusPoint,
    goal
  };
};

/**
 * ゴールの配置座標をランダムに生成する。
 * プレイヤー初期位置から一定距離以上離れた候補を優先し、見つからない場合はフォールバック座標を返す。
 * @returns ゴール配置に使うワールド座標
 */
const createRandomGoalPosition = (): { x: number; y: number } => {
  for (let i = 0; i < 24; i += 1) {
    const x = Phaser.Math.Between(GOAL_MARGIN, PLAY_FIELD_WIDTH - GOAL_MARGIN);
    const y = Phaser.Math.Between(GOAL_MARGIN, PLAY_FIELD_HEIGHT - GOAL_MARGIN);
    const distance = Phaser.Math.Distance.Between(
      x,
      y,
      PLAYER_SPAWN_X,
      PLAYER_SPAWN_Y
    );
    if (distance >= GOAL_MIN_DISTANCE_FROM_PLAYER) {
      return { x, y };
    }
  }

  return {
    x: PLAY_FIELD_WIDTH - GOAL_MARGIN,
    y: GOAL_MARGIN
  };
};
