# web_phaser_vite_smart-phone_game-sample

プレビュー: https://t-tonyo-maru.github.io/web_phaser_vite_smart-phone_game-sample/

※スマートフォンでアクセスしてください

## クイックスタート

1. 手元の環境を Node.js `v24` 以上にする
2. `npm i` を実行する
3. `npm run dev:host` を実行する
4. 手元の PC とスマートフォンを、同じ Wifi SSID に接続する
5. `npm run dev:host` 実行時に表示されたアドレスに、スマートフォンでアクセスする

## よく使うコマンド

| コマンド           | 説明                  |
| ------------------ | --------------------- |
| `npm run dev`      | ローカル起動          |
| `npm run dev:host` | 同一Wi-Fi内の実機確認 |
| `npm run lint`     | Biome で静的チェック  |
| `npm run test`     | Vitest 実行           |
| `npm run build`    | 本番ビルド            |

## 端末差異対策（実装済み）

- Safe Area（ノッチ）
  - `index.html` で `viewport-fit=cover` を有効化
  - `src/styles.css` で `env(safe-area-inset-*)` を CSS 変数化
  - `src/utils/device/safeArea.ts` でゲーム座標に変換して HUD 配置に反映
- 画面向きロック方針
  - `src/utils/device/orientationPolicy.ts` で、初回操作時に `portrait` lock を試行
  - lock 非対応端末でも動作継続し、現在向きを `dataset` に保持
- HUD の相対配置
  - `src/scenes/play/createHud.ts` で固定 px を減らし、画面比率 + Safe Area で配置
  - 主要サイズは `src/consts/hudConfig.ts` で一元調整

## リンク

- [Phaser](https://phaser.io/)
- [Vite](https://ja.vite.dev/)
- [Vitest](https://vitest.dev/)
