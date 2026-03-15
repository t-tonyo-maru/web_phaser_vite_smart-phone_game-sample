export type PatrolState = 'forward' | 'backward';

export interface PatrolResult {
  /** 次フレームに設定すべき X 速度 */
  velocityX: number;
  /** 次のパトロール状態 */
  nextState: PatrolState;
  /** スプライトを左右反転するか */
  flipX: boolean;
}

/**
 * パトロール移動の結果を計算する純粋関数。
 *
 * @param x             現在の X 座標
 * @param originX       パトロール原点の X 座標
 * @param patrolDistance 原点からの最大移動距離
 * @param state         現在のパトロール状態
 * @param speed         移動速度（正の値）
 */
export const calcPatrolResult = (
  x: number,
  originX: number,
  patrolDistance: number,
  state: PatrolState,
  speed: number
): PatrolResult => {
  if (state === 'forward') {
    if (x >= originX + patrolDistance) {
      return { velocityX: -speed, nextState: 'backward', flipX: true };
    }
    return { velocityX: speed, nextState: 'forward', flipX: false };
  }

  // state === 'backward'
  if (x <= originX - patrolDistance) {
    return { velocityX: speed, nextState: 'forward', flipX: false };
  }
  return { velocityX: -speed, nextState: 'backward', flipX: true };
};
