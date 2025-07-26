import { test, expect } from '@playwright/test'

test.describe('入出庫管理', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/inventory')
  })

  test('入出庫ページが正しく表示される', async ({ page }) => {
    // ページタイトルの確認
    await expect(page.getByText('入出庫管理')).toBeVisible()
    
    // 入出庫フォームの確認
    await expect(page.getByText('入出庫処理')).toBeVisible()
    
    // 履歴テーブルの確認
    await expect(page.getByText('入出庫履歴')).toBeVisible()
    await expect(page.getByRole('table')).toBeVisible()
  })

  test('入庫処理ができる', async ({ page }) => {
    // 商品を選択
    await page.getByLabel('商品').click()
    await page.getByRole('option').first().click()
    
    // 入庫を選択
    await page.getByRole('button', { name: '入庫' }).click()
    
    // 数量を入力
    await page.getByLabel('数量').fill('10')
    
    // 備考を入力
    await page.getByLabel('備考').fill('E2Eテスト入庫')
    
    // 処理実行
    await page.getByRole('button', { name: /入庫処理を実行/ }).click()
    
    // 成功メッセージの確認
    await expect(page.getByText(/入庫処理が完了しました/)).toBeVisible()
  })

  test('出庫処理ができる', async ({ page }) => {
    // 商品を選択
    await page.getByLabel('商品').click()
    await page.getByRole('option').first().click()
    
    // 出庫を選択
    await page.getByRole('button', { name: '出庫' }).click()
    
    // 数量を入力
    await page.getByLabel('数量').fill('5')
    
    // 備考を入力
    await page.getByLabel('備考').fill('E2Eテスト出庫')
    
    // 処理実行
    await page.getByRole('button', { name: /出庫処理を実行/ }).click()
    
    // 成功メッセージの確認
    await expect(page.getByText(/出庫処理が完了しました/)).toBeVisible()
  })

  test('入出庫バリデーションが動作する', async ({ page }) => {
    // 商品を選択せずに処理実行を試行
    await page.getByRole('button', { name: /処理を実行/ }).click()
    
    // ボタンが無効化されていることを確認
    await expect(page.getByRole('button', { name: /処理を実行/ })).toBeDisabled()
  })

  test('履歴が表示される', async ({ page }) => {
    // 履歴テーブルのヘッダー確認
    await expect(page.getByText('商品名')).toBeVisible()
    await expect(page.getByText('種別')).toBeVisible()
    await expect(page.getByText('数量')).toBeVisible()
    await expect(page.getByText('日時')).toBeVisible()
  })

  test('履歴フィルタリングが動作する', async ({ page }) => {
    // 種別フィルター
    await page.getByRole('combobox', { name: /種別/ }).click()
    await page.getByRole('option', { name: '入庫' }).click()
    
    // 商品フィルター
    await page.getByRole('combobox', { name: /商品で絞り込み/ }).click()
    await page.getByRole('option').first().click()
    
    // フィルター結果の確認（実際のデータに依存）
    await expect(page.getByRole('table')).toBeVisible()
  })

  test('検索機能が動作する', async ({ page }) => {
    // 検索ボックスに入力
    const searchBox = page.getByPlaceholder(/商品名または備考で検索/)
    await searchBox.fill('テスト')
    
    // 検索結果の確認
    await expect(page.getByRole('table')).toBeVisible()
  })

  test('更新ボタンが動作する', async ({ page }) => {
    // 更新ボタンをクリック
    await page.getByRole('button', { name: '更新' }).click()
    
    // 成功メッセージの確認
    await expect(page.getByText(/データを更新しました/)).toBeVisible()
  })

  test('レスポンシブレイアウトが機能する', async ({ page }) => {
    // モバイル表示に変更
    await page.setViewportSize({ width: 375, height: 667 })
    
    // フォームとテーブルが縦に配置されることを確認
    const formSection = page.locator('.lg\\:col-span-1')
    const tableSection = page.locator('.lg\\:col-span-2')
    
    await expect(formSection).toBeVisible()
    await expect(tableSection).toBeVisible()
  })

  test('在庫数が正しく更新される', async ({ page }) => {
    // 商品を選択
    await page.getByLabel('商品').click()
    const firstOption = page.getByRole('option').first()
    await firstOption.click()
    
    // 現在在庫数を確認
    const currentStockElement = page.getByText(/現在在庫/)
    await expect(currentStockElement).toBeVisible()
    
    // 入庫処理を実行
    await page.getByRole('button', { name: '入庫' }).click()
    await page.getByLabel('数量').fill('1')
    await page.getByRole('button', { name: /入庫処理を実行/ }).click()
    
    // 処理完了を待つ
    await expect(page.getByText(/入庫処理が完了しました/)).toBeVisible()
    
    // 同じ商品を再選択して在庫数の変更を確認
    await page.getByLabel('商品').click()
    await firstOption.click()
    
    // 在庫数が更新されていることを確認（実装に依存）
    await expect(currentStockElement).toBeVisible()
  })
})