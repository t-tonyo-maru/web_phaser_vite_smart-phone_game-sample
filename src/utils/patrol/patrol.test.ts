import { describe, expect, it } from 'vitest';
import { calcPatrolResult, type PatrolState } from './patrol';

describe('calcPatrolResult', () => {
  const originX = 100;
  const distance = 80;
  const speed = 60;

  describe('forward 状態', () => {
    const state: PatrolState = 'forward';

    it('右端未満なら forward を継続し正の速度を返す', () => {
      const result = calcPatrolResult(120, originX, distance, state, speed);
      expect(result.velocityX).toBe(speed);
      expect(result.nextState).toBe('forward');
      expect(result.flipX).toBe(false);
    });

    it('右端に達したら backward に切り替え負の速度を返す', () => {
      const result = calcPatrolResult(
        originX + distance,
        originX,
        distance,
        state,
        speed
      );
      expect(result.velocityX).toBe(-speed);
      expect(result.nextState).toBe('backward');
      expect(result.flipX).toBe(true);
    });

    it('右端を超過した場合も backward に切り替える', () => {
      const result = calcPatrolResult(
        originX + distance + 5,
        originX,
        distance,
        state,
        speed
      );
      expect(result.nextState).toBe('backward');
    });

    it('originX ちょうどでは forward を継続する', () => {
      const result = calcPatrolResult(originX, originX, distance, state, speed);
      expect(result.nextState).toBe('forward');
    });
  });

  describe('backward 状態', () => {
    const state: PatrolState = 'backward';

    it('左端未満まで移動していないなら backward を継続し負の速度を返す', () => {
      const result = calcPatrolResult(80, originX, distance, state, speed);
      expect(result.velocityX).toBe(-speed);
      expect(result.nextState).toBe('backward');
      expect(result.flipX).toBe(true);
    });

    it('左端に達したら forward に切り替え正の速度を返す', () => {
      const result = calcPatrolResult(
        originX - distance,
        originX,
        distance,
        state,
        speed
      );
      expect(result.velocityX).toBe(speed);
      expect(result.nextState).toBe('forward');
      expect(result.flipX).toBe(false);
    });

    it('左端を超過した場合も forward に切り替える', () => {
      const result = calcPatrolResult(
        originX - distance - 5,
        originX,
        distance,
        state,
        speed
      );
      expect(result.nextState).toBe('forward');
    });
  });

  describe('境界値・特殊ケース', () => {
    it('patrolDistance=0 の場合は常に折り返す (forward)', () => {
      const result = calcPatrolResult(originX, originX, 0, 'forward', speed);
      expect(result.nextState).toBe('backward');
    });

    it('speed=0 でも状態遷移は正常に動作する', () => {
      const result = calcPatrolResult(
        originX + distance,
        originX,
        distance,
        'forward',
        0
      );
      expect(result.velocityX).toBeCloseTo(0);
      expect(result.nextState).toBe('backward');
    });
  });
});
