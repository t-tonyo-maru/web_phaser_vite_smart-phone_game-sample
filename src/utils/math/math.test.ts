import { describe, expect, it } from 'vitest';
import { clamp, lerp } from './math';

describe('lerp', () => {
  describe('正常系', () => {
    it('t=0 で a を返す', () => {
      expect(lerp(0, 100, 0)).toBe(0);
    });

    it('t=1 で b を返す', () => {
      expect(lerp(0, 100, 1)).toBe(100);
    });

    it('t=0.5 で中間値を返す', () => {
      expect(lerp(0, 100, 0.5)).toBe(50);
    });

    it('t=0.1 で正しい補間値を返す', () => {
      expect(lerp(10, 20, 0.1)).toBeCloseTo(11);
    });

    it('a と b が等しい場合は a を返す', () => {
      expect(lerp(42, 42, 0.5)).toBe(42);
    });

    it('負の値でも正しく補間する', () => {
      expect(lerp(-100, 100, 0.5)).toBe(0);
    });
  });

  describe('境界値', () => {
    it('t がわずかに 1 より大きい場合は b を超える値を返す', () => {
      expect(lerp(0, 100, 1.1)).toBeCloseTo(110);
    });

    it('t が負の場合は a より小さい値を返す', () => {
      expect(lerp(0, 100, -0.1)).toBeCloseTo(-10);
    });
  });

  describe('異常系', () => {
    it('NaN の t を渡すと NaN を返す', () => {
      expect(lerp(0, 100, NaN)).toBeNaN();
    });
  });
});

describe('clamp', () => {
  describe('正常系', () => {
    it('min より小さい値を min にクランプする', () => {
      expect(clamp(-5, 0, 10)).toBe(0);
    });

    it('max より大きい値を max にクランプする', () => {
      expect(clamp(15, 0, 10)).toBe(10);
    });

    it('範囲内の値はそのまま返す', () => {
      expect(clamp(5, 0, 10)).toBe(5);
    });

    it('min ちょうどの値はそのまま返す', () => {
      expect(clamp(0, 0, 10)).toBe(0);
    });

    it('max ちょうどの値はそのまま返す', () => {
      expect(clamp(10, 0, 10)).toBe(10);
    });

    it('負の範囲で正しくクランプする', () => {
      expect(clamp(-15, -10, -5)).toBe(-10);
    });
  });

  describe('境界値', () => {
    it('min と max が同じ値の場合はその値を返す', () => {
      expect(clamp(5, 7, 7)).toBe(7);
    });
  });

  describe('異常系', () => {
    it('value が NaN の場合は NaN を返す', () => {
      expect(clamp(NaN, 0, 10)).toBeNaN();
    });
  });
});
