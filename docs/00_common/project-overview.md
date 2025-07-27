# プロジェクト概要

## 📋 基本情報

**プロジェクト名:** Next.js Application Template  
**種別:** 汎用Webアプリケーションテンプレート  
**目的:** 新規プロジェクト迅速立ち上げ・開発標準化

## 🎯 対象用途

1. 新規プロジェクトベース
2. プロトタイプ迅速構築  
3. 社内開発標準テンプレート
4. 学習・研修用途

## 🏗 技術構成

**フロントエンド:** Next.js 15 + TypeScript + shadcn/ui + Tailwind  
**バックエンド:** Next.js API Routes + Auth.js + Supabase  
**開発品質:** Biome + Zod + Vitest + Playwright  

> 詳細技術情報は [`tech-stack.md`](tech-stack.md) 参照

## 🔐 セキュリティ方針

**必須:** 認証必須・RLS活用・Zodバリデーション・CSRF保護  
**推奨:** 環境変数管理・HTTPS・セキュリティヘッダー

> 詳細は [`security.md`](security.md) 参照

## 📊 パフォーマンス目標

**Core Web Vitals:** LCP<2.5s, FID<100ms, CLS<0.1, TTI<3.8s

## 🚀 デプロイ戦略

**推奨:** Vercel (GitHub連携・自動デプロイ)  
**その他:** Netlify, Railway  
**環境:** 開発→ステージング→本番

## 📚 関連ドキュメント

**必読:** [`CLAUDE.md`](../../CLAUDE.md), [`README.md`](../../README.md)  
**詳細:** [`../20_development/`](../20_development/), [`../10_architect/`](../10_architect/), [`../30_test/`](../30_test/)