import { GAME_HEIGHT, GAME_WIDTH } from '~/consts/gameConfig';

/** プレイシーンのフィールドサイズ */
export const PLAY_FIELD_WIDTH = GAME_WIDTH * 2;
export const PLAY_FIELD_HEIGHT = GAME_HEIGHT * 2;

/** プレイヤー移動速度設定 */
export const PLAYER_MOVE_SPEED_BASE = 220;
export const PLAYER_MOVE_SPEED_MULTIPLIER = 2;
export const PLAYER_MOVE_SPEED =
  PLAYER_MOVE_SPEED_BASE * PLAYER_MOVE_SPEED_MULTIPLIER;

/** ダッシュ距離設定（距離 = 速度 x 時間） */
export const PLAYER_DASH_SPEED = 680;
export const PLAYER_DASH_DURATION_BASE_MS = 180;
export const PLAYER_DASH_DISTANCE_MULTIPLIER = 3;
export const PLAYER_DASH_DURATION_MS =
  PLAYER_DASH_DURATION_BASE_MS * PLAYER_DASH_DISTANCE_MULTIPLIER;

/** 初期スポーン位置 */
export const PLAYER_SPAWN_X = 180;
export const PLAYER_SPAWN_Y = PLAY_FIELD_HEIGHT - 220;

/** ゴールのランダム配置制約 */
export const GOAL_MARGIN = 200;
export const GOAL_MIN_DISTANCE_FROM_PLAYER = 680;
export const GOAL_SCALE = 2.6;

/** カメラ注視点オフセット（プレイヤー基準） */
export const CAMERA_FOCUS_OFFSET_X = 0;
export const CAMERA_FOCUS_OFFSET_Y = 0;
