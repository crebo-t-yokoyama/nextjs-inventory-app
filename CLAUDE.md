# Next.js Application Template

## 🎯 プロジェクト概要

認証・データベース・UI基盤を含む汎用Next.jsテンプレート。新規プロジェクトの迅速な立ち上げを目的とします。

## ⚙️ 技術スタック

**Core**
- Next.js 15 (App Router)
- TypeScript (strict mode)
- Supabase (PostgreSQL + Auth)
- Auth.js (NextAuth)

**UI/Styling**
- shadcn/ui + Radix UI
- Tailwind CSS
- Lucide Icons

**Development**
- pnpm (package manager)
- Biome (linting/formatting)
- Zod (validation)
- Vitest (unit tests)
- Playwright (E2E tests)

**Optional**
- Jotai (global state)
- Sentry (error monitoring)

## 🔧 プロジェクトカスタマイズ

**必須変更項目:**
1. プロジェクト名・説明 (このファイル冒頭)
2. アプリ名: `src/components/navigation/main-nav.tsx`
3. 機能要件: 下記「機能要件」セクション
4. データベース設計: 下記「データベース設計」セクション

**テンプレート→実装への変換:**
- `items` テーブル → プロジェクト固有のエンティティ
- `/items` ルート → 実際の機能ルート
- サンプルCRUD → ビジネスロジック

## 📋 機能要件 (要カスタマイズ)

**現在の実装状況:**
- ✅ **認証**: Auth.js email認証
- ✅ **ダッシュボード**: サンプルメトリクス表示
- ✅ **基本CRUD**: `items` テーブルでのCRUD操作
- ✅ **API Routes**: RESTful API実装済み

**カスタマイズ要項目:**
```markdown
### [プロジェクト名] 機能一覧
1. [機能1]: [説明]
2. [機能2]: [説明]
3. [機能3]: [説明]

### 画面構成
- [画面1]: [URL] - [機能説明]
- [画面2]: [URL] - [機能説明]
```

## 🗄 データベース設計 (要カスタマイズ)

**認証テーブル (Auth.js必須):**
- `users`, `accounts`, `sessions` ✅ 設定済み

**テンプレートテーブル:**
- `items` (サンプルCRUD用) ✅ 実装済み

**基本RLS設定:** ✅ 認証ユーザーのみアクセス可能

**カスタマイズ要項目:**
```sql
-- プロジェクト固有テーブル例
CREATE TABLE [entity_name] (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  -- プロジェクト固有カラム
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT now()
);

-- 適切なRLSポリシー設定
ALTER TABLE [entity_name] ENABLE ROW LEVEL SECURITY;
CREATE POLICY "[policy_name]" ON [entity_name] FOR ALL USING (auth.uid() IS NOT NULL);
```

## 🏗 アーキテクチャ・設計方針

**Frontend:**
- Server Components優先、Client Componentは必要時のみ
- shadcn/ui統一デザインシステム
- レスポンシブ・アクセシビリティ対応

**Backend:**
- API Routes (RESTful設計)
- Supabase RLS活用
- Zodバリデーション必須

**Security:**
- 全APIで認証チェック必須
- Row Level Security活用
- 入力値検証・サニタイゼーション

**Performance:**
- Next.js最適化機能活用
- 適切なキャッシング戦略
- 画像最適化 (next/image)

## 📁 プロジェクト構成

```
src/
├── app/                 # App Router
│   ├── (auth)/login/   # 認証画面
│   ├── dashboard/      # ダッシュボード
│   ├── items/          # サンプルCRUD (要カスタマイズ)
│   └── api/            # API Routes
├── components/
│   ├── ui/             # shadcn/ui
│   └── [custom]/       # プロジェクト固有
├── lib/
│   ├── auth.ts         # Auth.js設定
│   ├── supabase.ts     # Supabase クライアント
│   ├── validations.ts  # Zodスキーマ
│   └── utils.ts        # ユーティリティ
├── types/database.ts   # Supabase型定義
└── __tests__/          # テスト
```

## 🔧 必須環境変数

```env
# Auth
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## ⚡ よくあるタスクパターン

**新機能追加:**
```
1. データベーステーブル設計・作成
2. Zodバリデーションスキーマ定義
3. API Routes実装 (CRUD)
4. UI コンポーネント実装
5. ユニット・E2Eテスト作成
```

**API Routes テンプレート:**
```typescript
// 認証チェック必須
const session = await getServerSession(authOptions)
if (!session) return NextResponse.json({error: 'Unauthorized'}, {status: 401})

// バリデーション必須
const validatedData = schema.parse(body)

// Supabase操作
const { data, error } = await supabase.from('table').insert(validatedData)
```

## 🤖 Claude Code 開発ガイド

### 🔧 利用可能ツール
- **Supabase MCP Server**: データベース操作・ブランチ管理
- **GitHub CLI**: PR作成・Issue管理

### 📝 重要な開発原則
- **セキュリティファースト**: 全APIで認証・バリデーション必須
- **型安全性**: TypeScript strict mode、Zodバリデーション
- **テスト必須**: 新機能にはユニット・E2Eテスト作成
- **ドキュメント更新**: 重要な変更は `/docs` に記録

### 🔄 Git 運用ルール
- **ブランチ命名**: `feature/`, `fix/`, `chore/`, `docs/`
- **コミット**: Conventional Commits形式
- **PR**: 機能完了時に自動作成、テンプレート使用

### 📚 詳細ドキュメント参照先
- 設計詳細: `docs/10_architect/`
- 開発手順: `docs/20_development/`
- テスト戦略: `docs/30_test/`
- 環境設定: `docs/00_common/environment.md`
- Claude Code連携: `docs/20_development/claude-code-integration.md`