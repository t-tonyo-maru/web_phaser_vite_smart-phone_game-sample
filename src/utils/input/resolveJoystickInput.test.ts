import { describe, expect, it } from 'vitest';
import {
  resolveJoystickInput,
  resolveMoveDirection
} from './resolveJoystickInput';

describe('resolveJoystickInput', () => {
  it('閾値を超えるベクトルで入力方向を判定する', () => {
    const input = resolveJoystickInput({ x: 0.6, y: -0.8 }, 0.35);

    expect(input.left).toBe(false);
    expect(input.right).toBe(true);
    expect(input.up).toBe(true);
    expect(input.down).toBe(false);
  });

  it('閾値以内のベクトルは無入力として扱う', () => {
    const input = resolveJoystickInput({ x: 0.1, y: -0.2 }, 0.35);

    expect(input.left).toBe(false);
    expect(input.right).toBe(false);
    expect(input.up).toBe(false);
    expect(input.down).toBe(false);
  });
});

describe('resolveMoveDirection', () => {
  it('斜め入力を正規化して返す', () => {
    const direction = resolveMoveDirection({
      left: false,
      right: true,
      up: true,
      down: false
    });

    expect(direction?.x).toBeCloseTo(Math.SQRT1_2, 3);
    expect(direction?.y).toBeCloseTo(-Math.SQRT1_2, 3);
  });

  it('無入力時は null を返す', () => {
    const direction = resolveMoveDirection({
      left: false,
      right: false,
      up: false,
      down: false
    });

    expect(direction).toBeNull();
  });
});
