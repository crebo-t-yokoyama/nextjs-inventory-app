import { test, expect } from '@playwright/test'

test.describe('ダッシュボード', () => {
  test.beforeEach(async ({ page }) => {
    // 認証をスキップして直接ダッシュボードへ（実装予定）
    await page.goto('/dashboard')
  })

  test('ダッシュボードが正しく表示される', async ({ page }) => {
    // ページタイトルの確認
    await expect(page).toHaveTitle(/在庫管理システム/)
    
    // ヘッダーの確認
    await expect(page.getByText('ダッシュボード')).toBeVisible()
    
    // 統計カードの確認
    await expect(page.getByText('総商品数')).toBeVisible()
    await expect(page.getByText('総在庫数')).toBeVisible()
    await expect(page.getByText('在庫切れ商品')).toBeVisible()
    await expect(page.getByText('在庫少商品')).toBeVisible()
  })

  test('カテゴリ統計が表示される', async ({ page }) => {
    // カテゴリ統計セクションの確認
    await expect(page.getByText('カテゴリ別統計')).toBeVisible()
    
    // チャートまたは統計データの存在確認
    const categorySection = page.locator('[data-testid="category-stats"]')
    await expect(categorySection).toBeVisible()
  })

  test('ナビゲーションが機能する', async ({ page }) => {
    // 商品管理ページへの遷移
    await page.getByRole('link', { name: '商品管理' }).click()
    await expect(page).toHaveURL('/products')
    
    // ダッシュボードに戻る
    await page.getByRole('link', { name: 'ダッシュボード' }).click()
    await expect(page).toHaveURL('/dashboard')
    
    // 入出庫管理ページへの遷移
    await page.getByRole('link', { name: '入出庫管理' }).click()
    await expect(page).toHaveURL('/inventory')
  })

  test('レスポンシブデザインが機能する', async ({ page }) => {
    // モバイル表示に変更
    await page.setViewportSize({ width: 375, height: 667 })
    
    // モバイルメニューボタンが表示される
    const mobileMenuButton = page.getByRole('button', { name: /menu|メニュー/i })
    await expect(mobileMenuButton).toBeVisible()
    
    // メニューを開く
    await mobileMenuButton.click()
    
    // ナビゲーションリンクが表示される
    await expect(page.getByRole('link', { name: '商品管理' })).toBeVisible()
    await expect(page.getByRole('link', { name: '入出庫管理' })).toBeVisible()
  })

  test('統計データが更新される', async ({ page }) => {
    // 初期状態の統計データを取得
    const totalProductsText = await page.getByTestId('total-products').textContent()
    
    // 商品管理ページに移動して新しい商品を追加
    await page.getByRole('link', { name: '商品管理' }).click()
    await page.getByRole('button', { name: '新規追加' }).click()
    
    // 商品登録フォームに入力（実装予定）
    // await page.fill('[name="name"]', 'E2Eテスト商品')
    // await page.selectOption('[name="categoryId"]', { index: 0 })
    // await page.fill('[name="price"]', '1000')
    // await page.fill('[name="minStockThreshold"]', '10')
    // await page.click('button[type="submit"]')
    
    // ダッシュボードに戻る
    await page.getByRole('link', { name: 'ダッシュボード' }).click()
    
    // 統計データが更新されているか確認（実装予定）
    // const updatedTotalProductsText = await page.getByTestId('total-products').textContent()
    // expect(updatedTotalProductsText).not.toBe(totalProductsText)
  })
})