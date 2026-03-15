---
name: architecture
description: プロジェクト全体におけるアーキテクチャ SKILL
---

# アーキテクチャ指針

## 技術スタック概要

- 言語・ランタイムとバージョン
  - 開発環境: Node.js v24 以上
  - ゲーム自体はブラウザで動かします。環境は最新ブラウザを対象とします。
- フレームワーク / ライブラリ
  - Phaser
  - TypeScript
- ビルドツール・パッケージマネージャー
  - Vite
  - npm
- テストフレームワーク
  - Vitest
- リンター / フォーマッター
  - biome

## プロジェクト構成と役割

実際の本プロジェクトは次の構成を前提にします。

```
src/
├── assets/                  # ゲームアセット
├── components/              # UI 操作部品の格納先
├── consts/                  # ゲーム全体で共通の定数
│   ├── gameConfig.ts        # 画面サイズや物理設定
│   ├── hudConfig.ts         # HUD 共通サイズや入力閾値
│   └── sceneKeys.ts         # Scene キー定数
├── entities/                # Scene 上に表現するプレイヤーやアイテムなどのゲームオブジェクト
├── scenes/                  # Phaser ゲームの Scene 格納先
│   └── scene-title          # 1 つの Scene の格納先
│       ├── config.ts        # 1 つの Scene 内で利用する定数
│       ├── index.ts         # Scene 本体
│       ├── createHud.ts     # Scene の create にて、Hud をセットアップする処理
│       ├── createWorld.ts   # Scene の create にて、World をセットアップする処理
│       ├── preloadXXX.ts    # Scene の preload で呼び出す処理。preload を肥大化を防ぐために外部化する
│       ├── updateXXX.ts     # Scene の update で呼び出す処理。update を肥大化を防ぐために外部化する
│       └── createXXX.ts     # Scene の create で呼び出す処理。create を肥大化を防ぐために外部化する
├── utils/                   # ゲーム全体で共通のユーティリティ
├── config.ts                # Phaser 設定
├── main.ts                  # エントリーポイント
└── reset.css
```

## レイヤ責務（必須）

- Scene (`src/scenes`)
  - 進行管理とオブジェクト配置に専念する
  - `index.ts` は進行制御に寄せる。
    `preload` / `create` / `update` が肥大化したら `preload*.ts` / `create*.ts` / `update*.ts` へ関心事に別けて分割する
  - Scene 固有の定数は該当 Scene 配下の `config.ts` に閉じ込める
  - 直接ロジックを抱え込みすぎず、Entity / Component / Utils に委譲する
  - Scene遷移は `src/consts/sceneKeys.ts` のキーを使用し、文字列直書きを禁止する
- Entity (`src/entities`)
  - 物理挙動・入力反映・アニメーションなど、ゲームオブジェクト自身のふるまいを持つ
  - UI表示テキストやシーン遷移責務は持たない
- Component (`src/components`)
  - Scene横断で再利用される UI/入力部品を提供する
  - 例: `Button`, `RoundButton`, `JoystickController`, `MiniMap`
- Utils (`src/utils`)
  - Phaserゲーム全体で利用するユーザビリティ関数
  - 副作用を持たない純粋関数を置く
  - テスト可能性を優先し、Scene/Entity依存を持たせない

## 実装原則

- モバイル優先: タッチ操作・視認性・可操作領域を優先して設計する
- update軽量化: `update()` は入力解釈と必要最小限の状態更新のみにする
- ライフサイクル管理: `shutdown` / `destroy` で input listener や GameObject を確実に解放する
- 最小差分: 既存命名・既存責務に合わせ、不要なファイル移動や大規模整形はしない
- 段階的拡張: まず動作する最小構成を作り、必要に応じて Component/Utils を追加する
- 過度な最適化は回避する: 持続的な開発を実現するため、過度な部分最適化は避ける

## Scene設計チェックリスト

- `preload` はアセットロードに限定されているか
- `create` はオブジェクト生成と接続に集中しているか
- `update` は早期returnで軽量化されているか
- シーン遷移時に渡すデータ（例: score）は型と責務が明確か

## 変更時の判断基準

- シーン固有で再利用しない処理は Scene 内に置く
- Scene 内でも `preload` / `create` / `update` が肥大化したら `preload*.ts` / `create*.ts` / `update*.ts` へ関心事に別けて分割する
- 複数 Scene で使う入力/UI は Component に分離する
- 演算ロジックや変換処理は Utils に抽出する
- 「どこに置くべきか」曖昧なら、まず最小実装を Scene に置き、再利用が見えた時点で抽出する
