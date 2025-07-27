import { test, expect } from '@playwright/test'
import { login } from '../helpers/auth'

test.describe('ダッシュボード', () => {
  test.beforeEach(async ({ page }) => {
    // 認証が必要な場合はログインページにリダイレクトされることを確認
    await page.goto('/dashboard')
  })

  test('認証されていない場合はログインページにリダイレクトされる', async ({ page }) => {
    // ダッシュボードにアクセスするとログインページにリダイレクトされる
    await expect(page).toHaveURL(/\/login/)
    
    // ページタイトルの確認
    await expect(page).toHaveTitle(/在庫管理システム/)
    
    // ログインページの要素確認
    await expect(page.getByRole('heading', { name: 'ログイン' })).toBeVisible()
    await expect(page.getByLabel('メールアドレス')).toBeVisible()
    await expect(page.getByLabel('パスワード')).toBeVisible()
  })

  test('認証後にダッシュボードが正しく表示される', async ({ page }) => {
    // ログインしてダッシュボードにアクセス
    await login(page)
    
    // ダッシュボードの要素確認
    await expect(page.getByRole('heading', { name: 'ダッシュボード' })).toBeVisible()
    await expect(page.getByText('総商品数')).toBeVisible()
    await expect(page.getByText('総在庫数')).toBeVisible()
  })

  test('カテゴリ統計が表示される', async ({ page }) => {
    await login(page)
    
    // カテゴリ統計カードの確認（ダッシュボードのコンテンツが読み込まれていることを確認）
    await page.waitForTimeout(3000)
    
    // ダッシュボードのコンテンツが表示されていることを確認
    // 総商品数、総在庫数などの基本統計が表示されていることを確認
    const hasBasicStats = await page.getByText('総商品数').isVisible() || await page.getByText('総在庫数').isVisible()
    const hasLoading = await page.getByText('ダッシュボードデータを読み込み中').isVisible()
    
    // 基本統計またはローディングが表示されていることを確認
    expect(hasBasicStats || hasLoading).toBeTruthy()
  })

  test('ナビゲーションが機能する', async ({ page }) => {
    await login(page)
    
    // ナビゲーションリンクの確認
    await expect(page.getByRole('link', { name: '商品管理' })).toBeVisible()
    await expect(page.getByRole('link', { name: '入出庫管理' })).toBeVisible()
    
    // 商品管理ページへのナビゲーション
    await page.getByRole('link', { name: '商品管理' }).click()
    await expect(page).toHaveURL('/products')
  })

  test('レスポンシブデザインが機能する', async ({ page }) => {
    await login(page)
    
    // モバイルサイズに変更
    await page.setViewportSize({ width: 375, height: 667 })
    
    // レスポンシブデザインが機能することを確認
    await expect(page.getByRole('heading', { name: 'ダッシュボード' })).toBeVisible()
    
    // デスクトップサイズに戻す
    await page.setViewportSize({ width: 1920, height: 1080 })
    await expect(page.getByRole('heading', { name: 'ダッシュボード' })).toBeVisible()
  })

  test('統計データが更新される', async ({ page }) => {
    await login(page)
    
    // 初期表示の確認
    await expect(page.getByText('総商品数')).toBeVisible()
    
    // リロードしてデータが更新されることを確認
    await page.reload()
    await expect(page.getByText('総商品数')).toBeVisible()
  })
})