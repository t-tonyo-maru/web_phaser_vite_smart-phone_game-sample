import type { PlayerInput } from '~/entities/player';

/**
 * ジョイスティックベクトルをプレイヤー入力に変換する純粋関数。
 */
export const resolveJoystickInput = (
  joystickVector: { x: number; y: number },
  threshold: number
): PlayerInput => {
  return {
    left: joystickVector.x < -threshold,
    right: joystickVector.x > threshold,
    up: joystickVector.y < -threshold,
    down: joystickVector.y > threshold
  };
};

/**
 * 入力状態から移動方向ベクトルを返す。無入力なら null を返す。
 */
export const resolveMoveDirection = (
  input: PlayerInput
): { x: number; y: number } | null => {
  const x = (input.right ? 1 : 0) - (input.left ? 1 : 0);
  const y = (input.down ? 1 : 0) - (input.up ? 1 : 0);
  if (x === 0 && y === 0) return null;

  const length = Math.hypot(x, y);
  return {
    x: x / length,
    y: y / length
  };
};
