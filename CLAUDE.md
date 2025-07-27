# Next.js Web Application Template

## プロジェクト概要

このプロジェクトは、認証機能とデータベース接続を備えた汎用的なNext.jsアプリケーションテンプレートです。新規プロジェクトの迅速な立ち上げと、一貫した開発体験を提供することを目的としています。

### 想定用途
- **サンプルアプリケーション**の開発
- **本番アプリケーション**のベースとして
- **プロトタイプ**の迅速な構築
- **技術力アピール**用ポートフォリオ
- **社内標準**としてのテンプレート活用

## 重要: このテンプレートのカスタマイズ方法

### 🎯 新規プロジェクト開始時の手順
1. **プロジェクト名の変更**: このCLAUDE.mdの冒頭を更新
2. **機能要件の追加**: 後述の「## 機能要件」セクションを具体的な要件に更新
3. **データベース設計**: 「## データベース設計」をプロジェクト固有に拡張
4. **ナビゲーション**: `src/components/navigation/main-nav.tsx`のnavigationItems配列を更新
5. **アプリ名**: main-nav.tsxの「Your App Name」を実際のアプリ名に変更

## 技術スタック

- **Frontend/Backend**: Next.js App Router
- **データベース**: Supabase (PostgreSQL)
- **認証**: Auth.js
- **UIライブラリ**: shadcn/ui
- **スタイリング**: Tailwind CSS
- **状態管理**: 必要に応じてJotai（基本はNext.jsの標準機能を使用）
- **バリデーション**: Zod
- **パッケージマネージャ**: pnpm
- **リンター/フォーマッター**: Biome
- **テストフレームワーク**: Vitest（ユニットテスト）、Playwright（E2Eテスト）
- **エラー監視**: Sentry（オプション）
- **DB操作**: Supabase MCP Server（Claude開発時のDB操作用）

## 機能要件

**⚠️ TODO**: このセクションを具体的なプロジェクト要件に更新してください

### 基本画面構成（テンプレート）

#### 1. ログイン画面 ✅
- **機能**: ユーザー認証
- **実装状況**: 完了
- **詳細**: 
  - Auth.jsによるメールアドレス・パスワード認証
  - ログイン状態の保持
  - ログアウト機能
  - shadcn/uiのFormコンポーネントを使用

#### 2. ダッシュボード画面 ✅
- **機能**: アプリケーションの概要表示
- **実装状況**: テンプレート完了
- **詳細**:
  - Cardコンポーネントでメトリクス表示
  - サンプル統計情報（カスタマイズ要）
  - レスポンシブデザイン対応

#### 3. アイテム管理画面 ✅
- **機能**: 基本的なCRUD操作
- **実装状況**: テンプレート完了
- **詳細**:
  - アイテム一覧表示（Table）
  - 新規作成ボタン
  - API Routes完備（GET, POST, PUT, DELETE）

### 📋 プロジェクト固有機能の追加例

```markdown
#### 4. [機能名]画面
- **機能**: [機能の説明]
- **詳細**:
  - [具体的な機能1]
  - [具体的な機能2]
  - [使用するコンポーネント]

#### 5. [機能名]画面
- **機能**: [機能の説明]
- **詳細**:
  - [具体的な機能1]
  - [具体的な機能2]
```

## データベース設計

**⚠️ TODO**: このセクションをプロジェクト固有のテーブル設計に更新してください

### 基本テーブル構成（Auth.js必須）

#### 1. users - ユーザー情報（Auth.js用）✅
```sql
- id: UUID (Primary Key)
- email: VARCHAR (Unique)
- name: VARCHAR
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### 2. accounts - アカウント情報（Auth.js用）✅
```sql
- id: UUID (Primary Key)
- user_id: UUID (Foreign Key)
- type: VARCHAR
- provider: VARCHAR
- provider_account_id: VARCHAR
- refresh_token: TEXT
- access_token: TEXT
- expires_at: INTEGER
- token_type: VARCHAR
- scope: VARCHAR
- id_token: TEXT
- session_state: VARCHAR
```

#### 3. sessions - セッション情報（Auth.js用）✅
```sql
- id: UUID (Primary Key)
- session_token: VARCHAR (Unique)
- user_id: UUID (Foreign Key)
- expires: TIMESTAMP
```

### テンプレートテーブル

#### 4. items - 汎用アイテムテーブル（サンプル）✅
```sql
- id: UUID (Primary Key)
- name: VARCHAR (必須)
- description: TEXT
- created_by: UUID (Foreign Key to users)
- updated_by: UUID (Foreign Key to users)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### 📋 プロジェクト固有テーブルの追加例

```sql
-- 例1: カテゴリマスタが必要な場合
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- 例2: ユーザープロファイル拡張
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

### 基本インデックス設計

```sql
-- itemsテーブル
CREATE INDEX idx_items_created_by ON items(created_by);
CREATE INDEX idx_items_created_at ON items(created_at);
CREATE INDEX idx_items_name ON items(name);

-- TODO: プロジェクト固有のインデックスを追加
```

### Row Level Security (RLS) ポリシー

```sql
-- 基本ポリシー（認証済みユーザーのみアクセス）
ALTER TABLE items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "認証ユーザーはアイテムを閲覧可能" ON items
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "認証ユーザーはアイテムを作成・更新可能" ON items
  FOR ALL USING (auth.uid() IS NOT NULL);

-- TODO: プロジェクト固有のRLSポリシーを追加
-- 例: ユーザー自身のデータのみアクセス可能
-- CREATE POLICY "ユーザーは自分のデータのみアクセス可能" ON user_profiles
--   FOR ALL USING (auth.uid() = user_id);
```

## 使用予定のshadcn/uiコンポーネント

- Form, Input, Button, Select
- Table, Data Table
- Card, Alert, Badge
- Dialog, Sheet
- Toast, Combobox
- Date Picker, Radio Group

## 開発方針

### コード品質
- Biomeによる統一されたコードスタイル
- TypeScript strict mode
- ESLintルールの遵守

### UI/UX
- レスポンシブデザイン（モバイル対応）
- shadcn/uiによる統一されたデザインシステム
- アクセシビリティ対応

### セキュリティ
- Auth.jsによる安全な認証
- SQLインジェクション対策
- XSS対策

### パフォーマンス
- Next.js App Routerの最適化機能活用
- 適切なキャッシング戦略
- 必要に応じたコード分割

## 想定ユーザー

- 小売店の店長・スタッフ
- 倉庫管理者
- 在庫管理担当者

## 環境変数

```env
# Next.js
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Sentry (オプション)
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
SENTRY_AUTH_TOKEN=your-sentry-auth-token
```

## プロジェクト構成

```
src/
├── app/
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx
│   ├── dashboard/
│   │   └── page.tsx
│   ├── products/
│   │   ├── page.tsx
│   │   ├── new/
│   │   │   └── page.tsx
│   │   └── [id]/
│   │       └── edit/
│   │           └── page.tsx
│   ├── inventory/
│   │   └── page.tsx
│   ├── api/
│   │   ├── auth/
│   │   ├── products/
│   │   └── inventory/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/ (shadcn components)
│   └── custom/
│       ├── navbar.tsx
│       ├── sidebar.tsx
│       └── data-tables/
├── lib/
│   ├── auth.ts
│   ├── supabase.ts
│   ├── utils.ts
│   └── validations.ts
├── types/
│   └── database.ts
├── hooks/
│   └── use-toast.tsx
├── __tests__/
│   ├── unit/
│   └── e2e/
└── stores/ (Jotai atoms - 必要に応じて)
```

## バリデーションルール（Zod）

```typescript
// 商品登録・編集
const ProductSchema = z.object({
  name: z.string().min(1, "商品名は必須です"),
  categoryId: z.string().uuid("カテゴリを選択してください"),
  price: z.number().min(0, "価格は0以上で入力してください"),
  minStockThreshold: z.number().min(0, "在庫下限値は0以上で入力してください"),
  description: z.string().optional()
});

// 入出庫記録
const InventoryTransactionSchema = z.object({
  productId: z.string().uuid("商品を選択してください"),
  transactionType: z.enum(["IN", "OUT"]),
  quantity: z.number().min(1, "数量は1以上で入力してください"),
  notes: z.string().optional()
});
```

## 想定API エンドポイント

```
GET    /api/products           - 商品一覧取得
POST   /api/products           - 商品登録
GET    /api/products/[id]      - 商品詳細取得
PUT    /api/products/[id]      - 商品更新
DELETE /api/products/[id]      - 商品削除

GET    /api/categories         - カテゴリ一覧取得
POST   /api/categories         - カテゴリ登録

GET    /api/inventory          - 入出庫履歴取得
POST   /api/inventory          - 入出庫記録

GET    /api/dashboard/stats    - ダッシュボード統計データ
```

## 初期データ（カテゴリ）

```sql
INSERT INTO categories (id, name, description) VALUES
  (gen_random_uuid(), '食品', '食品・飲料関連'),
  (gen_random_uuid(), '日用品', '日用品・生活雑貨'),
  (gen_random_uuid(), '文具', '文房具・オフィス用品'),
  (gen_random_uuid(), '衣類', '衣類・アパレル'),
  (gen_random_uuid(), 'その他', 'その他の商品');
```

## 非機能要件

- **認証**: Auth.jsでのセッション管理
- **レスポンシブ**: Tailwind CSSでモバイル対応
- **アクセシビリティ**: shadcn/uiの標準対応
- **データベース**: Supabase PostgreSQLを使用
- **デプロイ**: GitHub連携でVercel（無料プラン）
- **パフォーマンス目標**:
  - LCP (Largest Contentful Paint): < 2.5秒
  - FID (First Input Delay): < 100ms
  - CLS (Cumulative Layout Shift): < 0.1
  - TTI (Time to Interactive): < 3.8秒
- **テスト**:
  - ユニットテストカバレッジ: 80%以上
  - E2Eテスト: 主要なユーザーフロー全て

## エラーハンドリング戦略

### APIエラー処理
```typescript
// エラーレスポンスの統一フォーマット
interface ApiError {
  code: string;
  message: string;
  details?: any;
}

// Supabaseエラーのラッピング
try {
  const { data, error } = await supabase.from('products').select();
  if (error) throw new ApiError('DB_ERROR', error.message);
} catch (error) {
  // エラーログ記録（Sentryへ送信）
  // ユーザーフレンドリーなメッセージ表示
}
```

### ユーザー向けエラー表示
- Toastコンポーネントでの通知
- 重要なエラーはAlertコンポーネントで表示
- フォームエラーは各フィールドに表示

## 状態管理方針

### Server Component優先
- 可能な限りServer Componentを使用
- データフェッチはServer Componentで実行
- キャッシュ戦略の活用

### Client Component使用ケース
- インタラクティブなUI（フォーム、モーダル等）
- リアルタイム更新が必要な部分
- ブラウザAPIを使用する部分

### グローバル状態管理（Jotai）
必要に応じて以下の状態を管理：
- ユーザー情報
- 通知・アラート
- UIの開閉状態（サイドバー等）

## 開発手順

1. プロジェクト初期化（Next.js + TypeScript）✅
2. 必要なパッケージのインストール（pnpm）
3. Biome設定 ✅
4. Supabaseプロジェクト作成・設定
   - プロジェクト作成
   - 環境変数設定
   - ブランチ機能の活用（開発環境）
5. データベーススキーマ作成
   - テーブル作成
   - インデックス設定
   - RLSポリシー設定
6. Auth.js設定
7. shadcn/ui初期設定 ✅
8. 各画面の実装
   - ログイン画面
   - ダッシュボード
   - 商品一覧・検索
   - 商品登録・編集
   - 入出庫履歴
9. テスト実装
   - Vitest設定・ユニットテスト作成
   - Playwright設定・E2Eテスト作成
10. エラー監視設定（Sentry - オプション）
11. CI/CD設定（GitHub Actions）
12. GitHub連携・Vercelデプロイ

## デプロイ設定

- **リポジトリ**: GitHub
- **ホスティング**: Vercel（無料プラン）
- **ドメイン**: Vercelの自動生成ドメイン使用
- **環境変数**: Vercelダッシュボードで設定
- **ビルドコマンド**: `pnpm build`
- **出力ディレクトリ**: `.next`

### デプロイフロー
1. GitHubにプッシュ
2. Vercelが自動ビルド・デプロイ
3. プレビューURL生成
4. mainブランチは本番環境に自動デプロイ

## CI/CD設定（GitHub Actions）

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm test:unit
      - run: pnpm build
```

## 型定義（Database Types）

```typescript
// src/types/database.ts
export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          product_code: string;
          name: string;
          category_id: string;
          price: number;
          current_stock: number;
          min_stock_threshold: number;
          description: string | null;
          created_by: string;
          updated_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Row, 'id' | 'product_code' | 'created_at' | 'updated_at'>;
        Update: Partial<Insert>;
      };
      // 他のテーブルも同様に定義
    };
  };
};
```

## 備考

このアプリケーションは技術力アピールのためのポートフォリオとして設計されており、実際のビジネスシーンでの使用を想定した実用的な機能を含んでいます。将来的には10個程度のアプリケーションを作成し、自社の技術力を幅広くアピールする予定です。

## Claude Code 開発指示

**重要**: 開発中に追加された設計情報、設定内容、実装のポイントなどは以下のルールに従って必ず文書化してください。

### データベース操作

このプロジェクトではSupabase MCP Serverが利用可能です。Claude Code開発時には以下が可能です：

- **直接SQL実行**: テーブル作成、データ挿入、クエリ実行
- **スキーマ確認**: 既存テーブル構造の確認
- **データ確認**: 開発中のデータ状況確認
- **初期データ投入**: カテゴリやサンプルデータの投入
- **ブランチ管理**: 開発用ブランチの作成・切り替え

**活用例**:
- データベーススキーマの作成・確認
- 初期データの投入・確認
- 開発中のデータ状況確認
- SQLクエリのテスト・デバッグ
- 開発ブランチでの安全な実験

### Supabaseブランチ戦略

- **本番環境（main）**: プロダクションデータ
- **開発環境（develop）**: 開発・テスト用ブランチ
- ブランチ間でスキーマは共有、データは分離
- マイグレーションはブランチでテスト後、本番へマージ

### ドキュメント管理ルール

1. **CLAUDE.md の更新**
   - プロジェクト全体に関わる重要な変更
   - 技術スタックの追加・変更
   - 全体的な設計方針の変更
   - 環境変数の追加・変更

2. **/docs ディレクトリでの管理**
   - 具体的な実装詳細: `/docs/implementation.md`
   - API仕様書: `/docs/api-reference.md`
   - データベース詳細設計: `/docs/database-design.md`
   - 認証設定詳細: `/docs/auth-setup.md`
   - デプロイ手順: `/docs/deployment.md`
   - トラブルシューティング: `/docs/troubleshooting.md`

### 必須文書化項目

- 新しく追加したパッケージとその理由
- 設定ファイルの詳細な説明
- データベーススキーマの変更履歴
- 実装中に判明した技術的な制約・注意点
- エラー解決方法
- パフォーマンス最適化の実装内容
- Supabase MCP Serverで実行したSQL文や設定内容

**目的**: 後続の開発者（または将来の自分）が迷わずに開発を継続できるようにするため

### セキュリティ考慮事項

- **認証・認可**: Auth.jsによる安全な認証実装
- **データ検証**: Zodによる入力値検証
- **SQLインジェクション対策**: Supabaseのパラメータ化クエリ使用
- **XSS対策**: React/Next.jsの自動エスケープ機能
- **CSRF対策**: Auth.jsの組み込み保護機能
- **環境変数**: 機密情報は環境変数で管理
- **RLS**: Row Level Securityで行レベルのアクセス制御

### パフォーマンス最適化

- **画像最適化**: next/imageの使用
- **コード分割**: dynamic importの活用
- **キャッシング**: 
  - Next.jsのキャッシュ機能活用
  - Supabaseクエリのキャッシュ
- **遅延読み込み**: 
  - Intersection Observerの活用
  - React.lazyでのコンポーネント遅延読み込み

### 開発ベストプラクティス

- **コミット**: 機能単位での小さなコミット
- **ブランチ戦略**: feature/fix/choreプレフィックス使用
- **PR**: テンプレート使用、レビュー必須
- **命名規則**: 
  - コンポーネント: PascalCase
  - 関数・変数: camelCase
  - 定数: UPPER_SNAKE_CASE
  - ファイル: kebab-case

## Git運用ルール

### ブランチ戦略

```
main ← 本番環境（常に安定した状態）
├── feature/auth-setup     # 新機能開発
├── feature/dashboard      # 新機能開発
├── fix/login-bug         # バグ修正
└── chore/update-deps     # 保守作業
```

### ブランチ命名規則

- **feature/[機能名]**: 新機能追加
- **fix/[修正内容]**: バグ修正
- **chore/[作業内容]**: 保守・リファクタリング
- **docs/[内容]**: ドキュメント更新

### コミットメッセージ（Conventional Commits）

```
<type>: <description>

<body>

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

**Type一覧**:
- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメント
- `style`: スタイル変更
- `refactor`: リファクタリング
- `test`: テスト追加
- `chore`: 保守作業

### プルリクエスト運用

#### PRの作成タイミング
- 機能の実装完了時
- バグ修正完了時
- 大きな変更の区切り時

#### PRテンプレート構成
```markdown
## Summary
- 変更内容の1-3行要約

## Test plan
- [ ] テスト項目1
- [ ] テスト項目2

## Related
- Issue #XX
```

### 自動化されるGit操作（Claude Code）

Claude Codeが以下を自動実行：

1. **適切なタイミングでのコミット**
   - 機能完成時
   - 設定変更完了時
   - マイルストーン達成時

2. **ブランチ管理**
   - 新機能開発時の feature ブランチ作成
   - 作業完了後の main ブランチへの統合

3. **プルリクエスト作成**
   - 機能完成時の自動PR作成
   - 適切なタイトル・説明文の生成
   - レビュー観点の整理

4. **コミット品質管理**
   - 論理的な変更単位でのコミット分割
   - 一貫したコミットメッセージ
   - 関連ファイルの適切なグルーピング

### 開発フロー例

```bash
# 1. 新機能開発開始
git checkout -b feature/auth-setup

# 2. 開発・コミット（Claude Codeが自動実行）
# 複数の小さなコミットを重ねる

# 3. 機能完成時にPR作成（Claude Codeが自動実行）
gh pr create --title "feat: implement authentication system"

# 4. レビュー・マージ後にブランチ削除
git branch -d feature/auth-setup
```

### 禁止事項

- `main`ブランチへの直接プッシュ
- 意味のないコミットメッセージ
- 大きすぎるPR（500行超の変更）
- テストなしでの機能追加