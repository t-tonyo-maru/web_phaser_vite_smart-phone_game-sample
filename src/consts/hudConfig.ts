/**
 * HUD レイアウト定数
 */

/** 仮想ボタン共通設定 */
export const HUD_BUTTON = {
  radiusRatioByWidth: 0.11,
  minRadius: 84,
  maxRadius: 132,
  edgeMargin: 24
} as const;

/** HUD ミニマップ相対サイズ */
export const HUD_MINI_MAP = {
  widthRatioByWidth: 0.22,
  heightRatioByHeight: 0.09,
  minWidth: 180,
  minHeight: 132
} as const;

/** HUD ガイドテキスト */
export const HUD_GUIDE_TEXT = {
  fontSizeRatioByWidth: 0.041,
  minFontSize: 22,
  maxFontSize: 44
} as const;

/** ダッシュボタン */
export const HUD_DASH_BUTTON = {
  color: 0x2ecc71,
  pressedColor: 0x27ae60,
  label: '🏃'
} as const;

/** ジョイスティック入力のデッドゾーン閾値 */
export const JOYSTICK_THRESHOLD = 0.35;

/** スコア表示用テキストスタイル */
export const SCORE_TEXT_STYLE = {
  fontSize: '120px',
  color: '#fff'
} as const;
