/**
 * ベクトル (x, y) を単位ベクトルに正規化する。
 * ゼロベクトルの場合は {x: 1, y: 0} を返す。
 */
export const normalizeVector = (
  x: number,
  y: number
): { x: number; y: number } => {
  const length = Math.hypot(x, y);
  if (length === 0) return { x: 1, y: 0 };
  return { x: x / length, y: y / length };
};

/**
 * ベクトル (x, y) の長さを最大長以下に収めて返す。
 * 長さが最大長以内ならそのまま返す。
 */
export const clampToLength = (
  x: number,
  y: number,
  maxLength: number
): { x: number; y: number } => {
  const length = Math.hypot(x, y);
  if (length <= maxLength) return { x, y };
  const scale = maxLength / length;
  return { x: x * scale, y: y * scale };
};
