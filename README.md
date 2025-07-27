# Next.js Web Application Template

## 🚀 概要

このテンプレートは、認証機能とデータベース接続を備えた汎用的なNext.jsアプリケーションの開発を迅速に開始できるよう設計されています。

### 🎯 対象用途
- **サンプルアプリケーション**の開発
- **本番アプリケーション**のベース
- **プロトタイプ**の迅速な構築
- **技術力アピール**用ポートフォリオ

## 🛠 技術スタック

### フロントエンド・バックエンド
- **Next.js 15** - App Router、Server Components対応
- **TypeScript** - 型安全性とDX向上
- **Tailwind CSS** - ユーティリティファーストCSS

### UI・コンポーネント
- **shadcn/ui** - 高品質なコンポーネントライブラリ
- **Lucide React** - 豊富なアイコンセット
- **Radix UI** - アクセシブルなプリミティブ

### 認証・データベース
- **Auth.js (NextAuth.js)** - セキュアな認証
- **Supabase** - PostgreSQL、リアルタイム機能
- **Row Level Security (RLS)** - データベースレベルのセキュリティ

### 開発・品質管理
- **Biome** - 高速リンター・フォーマッター
- **Zod** - スキーマバリデーション
- **Vitest** - 高速ユニットテスト
- **Playwright** - E2Eテスト

### Claude Code対応
- **Claude Code Hooks** - 開発ワークフロー自動化
- **Supabase MCP Server** - Claude CodeからDB操作
- **包括的ドキュメント** - スムーズな開発継続

## 📁 プロジェクト構造

```
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API Routes
│   │   ├── dashboard/      # ダッシュボードページ
│   │   ├── items/          # アイテム管理（例）
│   │   └── login/          # ログインページ
│   ├── components/         # Reactコンポーネント
│   │   ├── auth/          # 認証関連
│   │   ├── layout/        # レイアウト
│   │   ├── navigation/    # ナビゲーション
│   │   └── ui/            # shadcn/ui components
│   ├── lib/               # ユーティリティ・設定
│   │   ├── auth.ts        # Auth.js設定
│   │   ├── supabase.ts    # Supabase設定
│   │   └── validations.ts # Zodスキーマ
│   └── types/             # TypeScript型定義
├── docs/                  # プロジェクトドキュメント
│   ├── 00_common/           # 共通情報（Claude Code常時読込）
│   ├── 10_architect/        # 設計関連
│   ├── 20_development/      # 開発関連
│   └── 30_test/            # テスト関連
├── .claude/              # Claude Code設定
└── CLAUDE.md            # Claude Code向けプロジェクト仕様
```

## 🚀 クイックスタート

### 1. リポジトリの作成

```bash
# このテンプレートをベースに新しいリポジトリを作成
# TODO: テンプレートリポジトリ化後の手順を記載
```

### 2. 依存関係のインストール

```bash
pnpm install
```

### 3. 環境変数の設定

`.env.local`ファイルを作成し、以下を設定：

```env
# Next.js
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

詳細は [`docs/20_development/environment.md`](docs/20_development/environment.md) を参照

### 4. データベースのセットアップ

1. [Supabase](https://supabase.com)でプロジェクト作成
2. データベーススキーマの適用
3. 認証プロバイダーの設定

詳細は [`docs/10_architect/database.md`](docs/10_architect/database.md) を参照

### 5. 開発サーバーの起動

```bash
pnpm dev
```

### 6. プロジェクトのカスタマイズ

1. **アプリ名の変更**: `src/components/navigation/main-nav.tsx`
2. **データベーススキーマ**: `src/types/database.ts`
3. **バリデーション**: `src/lib/validations.ts`
4. **ナビゲーション**: navigationItems配列を編集

## 📋 利用可能なコマンド

```bash
# 開発
pnpm dev          # 開発サーバー起動
pnpm build        # プロダクションビルド
pnpm start        # プロダクション起動

# コード品質
pnpm lint         # Biomeリンター実行
pnpm format       # Biomeフォーマッター実行

# テスト
pnpm test         # ユニットテスト（Vitest）
pnpm test:ui      # テストUI
pnpm test:e2e     # E2Eテスト（Playwright）
pnpm test:e2e:fast # E2Eテスト（高速モード）
```

## 🎨 カスタマイズガイド

### プロジェクト固有の機能追加

1. **新しいページ**: `src/app/`に追加
2. **API Routes**: `src/app/api/`に追加
3. **コンポーネント**: `src/components/`に追加
4. **データベーステーブル**: `src/types/database.ts`を更新

### デザインシステム

- **カラーパレット**: `tailwind.config.ts`で設定
- **コンポーネント**: shadcn/ui を拡張
- **タイポグラフィ**: Tailwind CSS ユーティリティ

## 🔧 Claude Code連携

### Claude Code Hooks

プロジェクトには以下のhooksが設定されています：

- **pre-commit**: コード品質チェック
- **post-commit**: ドキュメント更新
- **pre-push**: テスト実行

### MCP Servers

- **Supabase MCP**: データベース操作
- **GitHub MCP**: リポジトリ管理

詳細は [`docs/20_development/claude-code.md`](docs/20_development/claude-code.md) を参照

## 📚 ドキュメント

### 必読ドキュメント
- [`CLAUDE.md`](CLAUDE.md) - Claude Code向けプロジェクト仕様
- [`docs/00_common/`](docs/00_common/) - プロジェクト全体に関わる情報

### 開発者向け
- [`docs/20_development/`](docs/20_development/) - 開発手順・ルール
- [`docs/10_architect/`](docs/10_architect/) - 設計・アーキテクチャ
- [`docs/30_test/`](docs/30_test/) - テスト戦略・実装

## 🚀 デプロイ

### Vercel（推奨）

1. GitHubリポジトリと連携
2. 環境変数を設定
3. 自動デプロイが開始

### その他のプラットフォーム

- Netlify
- Railway
- AWS Amplify

詳細は [`docs/20_development/deployment.md`](docs/20_development/deployment.md) を参照

## 🤝 開発ワークフロー

### Gitフロー

1. **feature/***ブランチで機能開発
2. **Pull Request**でレビュー
3. **main**ブランチにマージ
4. 自動デプロイ実行

### コミット規約

```
<type>: <description>

feat: 新機能追加
fix: バグ修正
docs: ドキュメント更新
style: スタイル変更
refactor: リファクタリング
test: テスト追加・修正
chore: その他の変更
```

## ⚡ パフォーマンス

### 最適化設定

- **画像最適化**: next/image
- **フォント最適化**: next/font
- **バンドル最適化**: 自動コード分割
- **キャッシュ戦略**: Next.js標準機能

### 監視

- **Core Web Vitals**: Vercel Analytics
- **エラー監視**: Sentry（オプション）

## 🔒 セキュリティ

### 実装済み対策

- **認証**: Auth.js セキュアセッション
- **認可**: Row Level Security (RLS)
- **CSRF**: Auth.js標準保護
- **XSS**: React自動エスケープ
- **入力検証**: Zodバリデーション

## 📞 サポート

### 社内利用

社内メンバーは以下のリソースを活用してください：

1. **Claude Code**: プロジェクト設定済み
2. **ドキュメント**: `docs/`ディレクトリ
3. **テンプレート**: 標準化されたファイル構造

### 外部利用

- **Issue**: GitHubでイシュー報告
- **Discussion**: アイデア・質問
- **Wiki**: 追加ドキュメント

## 📄 ライセンス

**独自ライセンス** - 商用利用条件については別途お問い合わせください

## 🎯 今後の予定

- [ ] **GraphQL対応**: tRPC または Apollo
- [ ] **国際化**: next-intl
- [ ] **PWA対応**: service worker
- [ ] **マイクロフロントエンド**: Module Federation
- [ ] **マルチテナント**: 組織管理機能

---

**Created with ❤️ for rapid development**
