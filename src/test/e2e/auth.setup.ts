import { test as setup, expect } from '@playwright/test'

const authFile = 'playwright/.auth/user.json'

setup('authenticate', async ({ page }) => {
  // ログインページに移動
  await page.goto('/login')
  
  // TODO: 実際の認証フローを実装
  // 現在はデモ用のスキップ設定
  console.log('Authentication setup - スキップ（実装予定）')
  
  // 認証状態を保存（実装予定）
  // await page.context().storageState({ path: authFile })
})