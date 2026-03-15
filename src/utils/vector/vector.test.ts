import { describe, expect, it } from 'vitest';
import { clampToLength, normalizeVector } from './vector';

describe('normalizeVector', () => {
  describe('正常系', () => {
    it('正の方向ベクトルを単位ベクトルに変換する', () => {
      const result = normalizeVector(3, 4);
      expect(result.x).toBeCloseTo(0.6);
      expect(result.y).toBeCloseTo(0.8);
    });

    it('負の方向ベクトルを単位ベクトルに変換する', () => {
      const result = normalizeVector(-3, -4);
      expect(result.x).toBeCloseTo(-0.6);
      expect(result.y).toBeCloseTo(-0.8);
    });

    it('既に単位ベクトルの場合はそのまま返す', () => {
      const result = normalizeVector(1, 0);
      expect(result.x).toBeCloseTo(1);
      expect(result.y).toBeCloseTo(0);
    });

    it('斜め45度のベクトルを正規化する', () => {
      const result = normalizeVector(1, 1);
      const expected = 1 / Math.SQRT2;
      expect(result.x).toBeCloseTo(expected);
      expect(result.y).toBeCloseTo(expected);
    });

    it('X軸方向のみのベクトルを正規化する', () => {
      const result = normalizeVector(5, 0);
      expect(result.x).toBeCloseTo(1);
      expect(result.y).toBeCloseTo(0);
    });

    it('Y軸方向のみのベクトルを正規化する', () => {
      const result = normalizeVector(0, -10);
      expect(result.x).toBeCloseTo(0);
      expect(result.y).toBeCloseTo(-1);
    });
  });

  describe('境界値', () => {
    it('ゼロベクトルの場合は {x:1, y:0} を返す', () => {
      const result = normalizeVector(0, 0);
      expect(result).toEqual({ x: 1, y: 0 });
    });

    it('正規化後のベクトル長は1に近い', () => {
      const result = normalizeVector(3, 4);
      const length = Math.hypot(result.x, result.y);
      expect(length).toBeCloseTo(1);
    });
  });

  describe('異常系', () => {
    it('NaN を含む入力は NaN を返す', () => {
      const result = normalizeVector(NaN, 0);
      expect(result.x).toBeNaN();
    });

    it('Infinity を含む入力は NaN を返す (Infinity/Infinity=NaN)', () => {
      // Math.hypot(Infinity, 0) = Infinity → Infinity / Infinity = NaN
      const result = normalizeVector(Infinity, 0);
      expect(result.x).toBeNaN();
    });
  });
});

describe('clampToLength', () => {
  describe('正常系', () => {
    it('長さが maxLength 以内ならそのまま返す', () => {
      const result = clampToLength(3, 4, 10);
      expect(result.x).toBeCloseTo(3);
      expect(result.y).toBeCloseTo(4);
    });

    it('長さが maxLength を超える場合にクランプする', () => {
      const result = clampToLength(3, 4, 2.5); // 長さ5 → 2.5にクランプ
      const length = Math.hypot(result.x, result.y);
      expect(length).toBeCloseTo(2.5);
    });

    it('クランプ後の方向は変わらない', () => {
      const original = normalizeVector(3, 4);
      const clamped = clampToLength(3, 4, 2.5);
      const clampedDir = normalizeVector(clamped.x, clamped.y);
      expect(clampedDir.x).toBeCloseTo(original.x);
      expect(clampedDir.y).toBeCloseTo(original.y);
    });

    it('長さがちょうど maxLength の場合はそのまま返す', () => {
      const result = clampToLength(3, 4, 5); // 長さ=5=maxLength
      expect(result.x).toBeCloseTo(3);
      expect(result.y).toBeCloseTo(4);
    });
  });

  describe('境界値', () => {
    it('ゼロベクトルは {x:0, y:0} を返す', () => {
      const result = clampToLength(0, 0, 10);
      expect(result).toEqual({ x: 0, y: 0 });
    });

    it('maxLength=0 の場合は {x:0, y:0} を返す', () => {
      const result = clampToLength(3, 4, 0);
      expect(result.x).toBeCloseTo(0);
      expect(result.y).toBeCloseTo(0);
    });
  });
});
