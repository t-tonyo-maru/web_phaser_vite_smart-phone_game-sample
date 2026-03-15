---
applyTo: "**"
---

# Copilot Instructions

## 基本ルール

- 回答は必ず日本語で行うこと。
- 変更量が 200 行を超える可能性が高い場合は、事前にユーザー確認を取ること。
- 大きい変更は、着手前に計画を提示して合意を取ること。
- 実装前に既存コードを調査し、既存パターン・命名・責務分割に合わせること。
- 不確かな仕様は推測で進めず、「こういうことですか?」の形式で確認すること。

## このプロジェクトで重視する方針

本プロジェクトは スマートフォン向け Phaser ゲームテンプレート です。  
実装時は次の優先順位で判断してください。

1. モバイル操作性（タッチ操作・画面サイズ適応）
2. シーン責務の明確化（Title / Play / Result）
3. 型安全性と可読性（TypeScript）
4. テスト容易性（ユーティリティを純粋関数として分離）

## 技術スタック / 実行コマンド

- Node.js: v24 以上
- 言語: TypeScript
- ゲームエンジン: Phaser
- ビルド: Vite
- Lint / Format: biome
- Test: Vitest

基本コマンド:

1. `npm i`
2. `npm run dev`
3. `npm run test`
4. `npm run build`

## 実装時の作業手順（必須）

1. 関連ファイルを探索し、既存構成に合わせた差分設計を作る。
2. `scene` / `entity` / `component` / `utils` のどこに責務を置くかを先に決める。
3. 最小差分で実装する（不要なリネーム・大規模整形を避ける）。
4. 変更箇所に応じてテストを追加または更新する。
5. 最後に lint・test・build の順で確認する。

## Phaser 固有の実装ガイド

- Scene は「ゲーム進行のオーケストレーション」に限定し、ロジックを抱え込みすぎない。
- Entity はスプライト挙動と入力反映を担当し、UI 表示は扱わない。
- Component は再利用可能な UI/入力部品に限定する（Button / Joystick など）。
- Scene Key は `src/consts/sceneKeys.ts` で一元管理し、文字列直書きを禁止する。
- `update()` は軽量に保ち、重い計算は分離する。
- `shutdown` / `destroy` を使って input listener・GameObject の解放漏れを防ぐ。

## 参照スキルガイド (Skills)

以下の作業では、該当ドキュメントを必ず参照してから実装すること。

- 設計・責務分割・ディレクトリ構成変更
  - `.github/skills/architecture/SKILL.md`
- コード作成・修正・レビュー
  - `.github/skills/coding-standards/SKILL.md`
- テスト作成・修正
  - `.github/skills/test/SKILL.md`

必要時のみ:

- CI / CD を変更する場合
  - `.github/skills/cicd/SKILL.md`
