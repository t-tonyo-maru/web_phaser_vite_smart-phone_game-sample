import { describe, expect, it } from 'vitest';
import { resolveDashDirection } from './resolveDashDirection';

describe('resolveDashDirection', () => {
  it('入力中は現在入力の正規化方向を返す', () => {
    const direction = resolveDashDirection({ x: 3, y: 4 }, { x: -1, y: 0 });

    expect(direction.x).toBeCloseTo(0.6);
    expect(direction.y).toBeCloseTo(0.8);
  });

  it('無入力時は直前方向を返す', () => {
    const direction = resolveDashDirection({ x: 0, y: 0 }, { x: 0, y: -2 });

    expect(direction.x).toBeCloseTo(0);
    expect(direction.y).toBeCloseTo(-1);
  });

  it('入力も直前方向も無い場合は右向きを返す', () => {
    const direction = resolveDashDirection({ x: 0, y: 0 }, { x: 0, y: 0 });

    expect(direction.x).toBeCloseTo(1);
    expect(direction.y).toBeCloseTo(0);
  });
});
