# Claude Code Hooks

このディレクトリには Claude Code 用のフック定義が含まれています。

## 📋 利用可能なフック

### 1. `pre-commit`
**実行タイミング**: コミット前
**目的**: コード品質の基本チェック

- TypeScript型チェック
- Biome linting
- ユニットテスト実行
- ビルドテスト

### 2. `post-merge`
**実行タイミング**: マージ後
**目的**: マージ後の環境整合性確保

- 依存関係の自動更新
- データベースマイグレーション確認
- ビルドテスト
- テスト実行

### 3. `pre-push`
**実行タイミング**: プッシュ前
**目的**: リモートプッシュ前の完全性チェック

- E2Eテスト実行
- セキュリティチェック
- 本番ビルドテスト
- バンドルサイズチェック

### 4. `post-checkout`
**実行タイミング**: ブランチ切り替え後
**目的**: ブランチ切り替え後の環境同期

- 依存関係変更の検出・更新
- 環境設定ファイル確認
- TypeScript設定確認
- キャッシュクリア

### 5. `pre-create-pr`
**実行タイミング**: PR作成前
**目的**: PR作成前の総合チェック

- 完全なテストスイート実行
- コードカバレッジチェック
- セキュリティ監査
- ビルド最適化チェック
- ドキュメント更新推奨

### 6. `pre-deploy`
**実行タイミング**: 本番デプロイ前
**目的**: 本番環境への安全なデプロイ確保

- 本番環境変数確認
- データベースマイグレーション確認
- 本番ビルドテスト
- セキュリティ最終チェック
- パフォーマンステスト

### 7. `post-deploy`
**実行タイミング**: 本番デプロイ後
**目的**: デプロイ後の動作確認

- ヘルスチェック
- データベース接続確認
- 監視・アラート確認
- セキュリティヘッダー確認
- パフォーマンス確認

### 8. `pre-feature-start`
**実行タイミング**: 新機能開発開始時
**目的**: 開発環境の準備と確認

- ブランチ命名規則チェック
- 最新main同期確認
- 関連イシュー確認
- 開発環境セットアップ
- 必要サービス起動確認

### 9. `task-narrator` 🎙️
**実行タイミング**: 他のフックから呼び出し
**目的**: タスク実行の音声通知

- タスク開始・完了の音声通知
- プラットフォーム対応（macOS/Linux/Windows）
- 優先度別音量調整
- 日本語対応

## ⚙️ カスタマイズ方法

### プロジェクト固有の設定
各フックは以下の点でカスタマイズ可能です：

```bash
# 例: pre-commit にカスタムチェック追加
echo "🎨 Running custom style checks..."
if [ -f "custom-lint.sh" ]; then
    ./custom-lint.sh || {
        echo "❌ Custom style check failed"
        exit 1
    }
fi
```

### 条件分岐の追加
```bash
# 特定のファイルが変更された場合のみ実行
if git diff --cached --name-only | grep -q "^src/components/"; then
    echo "🎨 Component changes detected - running additional checks..."
    # 追加のチェック処理
fi
```

### 環境固有の設定
```bash
# 開発環境でのみ実行
if [ "$NODE_ENV" = "development" ]; then
    echo "🔧 Development mode - running additional dev checks..."
fi
```

## 🎙️ 音声通知機能

### セットアップ
音声通知を有効にするには環境変数を設定：

```bash
# .env.local または ~/.bashrc に追加
export CLAUDE_VOICE_ENABLED=true
export CLAUDE_VOICE_LANG=ja-JP
export CLAUDE_VOICE_RATE=1.0
export CLAUDE_VOICE_VOLUME=0.7
```

### サポートプラットフォーム
- **macOS**: `say` コマンド（標準搭載）
- **Linux**: `espeak` または `spd-say`
- **Windows**: PowerShell（標準搭載）

### 音声通知の例
```bash
# フック内での使用例
source .claude/hooks/task-narrator
task_start "ビルド処理" "build"
task_progress "1" "3" "TypeScript確認中"
task_complete "build" "success"
```

### カスタム通知
```bash
# 独自のフックで音声通知を追加
if [ -f ".claude/hooks/task-narrator" ]; then
    source .claude/hooks/task-narrator
    task_start "カスタム処理" "custom"
    # ... 処理 ...
    task_complete "custom" "success"
fi
```

## 📝 ベストプラクティス

### 1. フック実行時間の最適化
- 重いテストは `pre-push` で実行
- 軽量なチェックは `pre-commit` で実行
- 並列実行可能な処理は並列化

### 2. エラーハンドリング
- 致命的でないエラーは警告として表示
- 必須チェックの失敗時は `exit 1`
- 詳細なエラーメッセージを提供

### 3. 設定の外部化
```bash
# .claude/config.json での設定例
{
  "hooks": {
    "pre-commit": {
      "skip_tests": false,
      "skip_lint": false,
      "custom_commands": []
    }
  }
}
```

### 4. CI/CD との連携
- フックとCI/CDで同じチェック項目を使用
- 環境変数での動作制御
- キャッシュの有効活用

## 🔧 トラブルシューティング

### フックが実行されない場合
```bash
# 実行権限確認
ls -la .claude/hooks/

# 実行権限付与
chmod +x .claude/hooks/*
```

### 特定のフックを一時的に無効化
```bash
# 環境変数での制御
SKIP_PRE_COMMIT=1 claude commit "message"
```

### デバッグモード
```bash
# フック内でデバッグ情報出力
if [ "$CLAUDE_HOOKS_DEBUG" = "1" ]; then
    set -x  # コマンドの詳細表示
fi
```

## 📚 参考情報

- [Claude Code Documentation](https://docs.anthropic.com/claude-code)
- [Git Hooks Documentation](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)
- プロジェクト固有の設定: `CLAUDE.md`
- 開発ガイド: `docs/development/`