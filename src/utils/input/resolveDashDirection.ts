import { normalizeVector } from '~/utils/vector/vector';

/**
 * ダッシュ方向を決定する純粋関数。
 * 入力中は入力方向を優先し、無入力時は直前方向を使う。
 */
export const resolveDashDirection = (
  currentInput: { x: number; y: number },
  lastDirection: { x: number; y: number }
): { x: number; y: number } => {
  const inputLengthSq =
    currentInput.x * currentInput.x + currentInput.y * currentInput.y;
  if (inputLengthSq > 0) {
    return normalizeVector(currentInput.x, currentInput.y);
  }

  const lastLengthSq =
    lastDirection.x * lastDirection.x + lastDirection.y * lastDirection.y;
  if (lastLengthSq > 0) {
    return normalizeVector(lastDirection.x, lastDirection.y);
  }

  return { x: 1, y: 0 };
};
