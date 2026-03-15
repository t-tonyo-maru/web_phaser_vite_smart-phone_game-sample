/**
 * a から b に向けて t の割合だけ線形補間する。
 * t=0 で a、t=1 で b を返す。
 */
export const lerp = (a: number, b: number, t: number): number => {
  return a + (b - a) * t;
};

/**
 * 値を最小値から最大値の範囲に収める。
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};
