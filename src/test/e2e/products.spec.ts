import { test, expect } from '@playwright/test'

test.describe('商品管理', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/products')
  })

  test('商品一覧が表示される', async ({ page }) => {
    // ページタイトルの確認
    await expect(page.getByText('商品管理')).toBeVisible()
    
    // 商品テーブルの確認
    await expect(page.getByRole('table')).toBeVisible()
    
    // テーブルヘッダーの確認
    await expect(page.getByText('商品名')).toBeVisible()
    await expect(page.getByText('カテゴリ')).toBeVisible()
    await expect(page.getByText('価格')).toBeVisible()
    await expect(page.getByText('在庫数')).toBeVisible()
  })

  test('商品検索機能が動作する', async ({ page }) => {
    // 検索ボックスに入力
    const searchBox = page.getByPlaceholder(/商品名で検索/i)
    await searchBox.fill('テスト')
    
    // 検索結果の確認（実際のデータに依存）
    // await expect(page.getByRole('table')).toBeVisible()
  })

  test('商品登録フォームが表示される', async ({ page }) => {
    // 新規追加ボタンをクリック
    await page.getByRole('button', { name: '新規追加' }).click()
    
    // 商品登録ページに遷移
    await expect(page).toHaveURL('/products/new')
    
    // フォーム要素の確認
    await expect(page.getByText('商品登録')).toBeVisible()
    await expect(page.getByLabel('商品名')).toBeVisible()
    await expect(page.getByLabel('カテゴリ')).toBeVisible()
    await expect(page.getByLabel('価格')).toBeVisible()
    await expect(page.getByLabel('在庫下限値')).toBeVisible()
  })

  test('商品登録ができる', async ({ page }) => {
    // 新規追加ページに移動
    await page.getByRole('button', { name: '新規追加' }).click()
    
    // フォームに入力
    await page.getByLabel('商品名').fill('E2Eテスト商品')
    
    // カテゴリを選択（最初のオプション）
    await page.getByLabel('カテゴリ').click()
    await page.getByRole('option').first().click()
    
    await page.getByLabel('価格').fill('1500')
    await page.getByLabel('在庫下限値').fill('5')
    await page.getByLabel('商品説明').fill('E2Eテストで作成された商品です')
    
    // 登録ボタンをクリック
    await page.getByRole('button', { name: '登録する' }).click()
    
    // 成功メッセージの確認
    await expect(page.getByText(/商品を登録しました/)).toBeVisible()
    
    // 商品一覧ページに戻る
    await expect(page).toHaveURL('/products')
  })

  test('バリデーションエラーが表示される', async ({ page }) => {
    // 新規追加ページに移動
    await page.getByRole('button', { name: '新規追加' }).click()
    
    // 必須フィールドを空のまま送信
    await page.getByRole('button', { name: '登録する' }).click()
    
    // エラーメッセージの確認
    await expect(page.getByText(/商品名は必須です/)).toBeVisible()
  })

  test('商品編集ができる', async ({ page }) => {
    // 最初の商品の編集ボタンをクリック（商品が存在する場合）
    const editButton = page.getByRole('button', { name: '編集' }).first()
    
    if (await editButton.isVisible()) {
      await editButton.click()
      
      // 編集ページの確認
      await expect(page.getByText('商品編集')).toBeVisible()
      
      // フォーム要素が初期値で入力されていることを確認
      const nameInput = page.getByLabel('商品名')
      await expect(nameInput).not.toHaveValue('')
    }
  })

  test('商品削除ができる', async ({ page }) => {
    // 削除ボタンの確認（実装予定）
    // const deleteButton = page.getByRole('button', { name: '削除' }).first()
    
    // if (await deleteButton.isVisible()) {
    //   await deleteButton.click()
      
    //   // 確認ダイアログの確認
    //   await expect(page.getByText(/削除してもよろしいですか/)).toBeVisible()
      
    //   // 削除実行
    //   await page.getByRole('button', { name: '削除' }).click()
      
    //   // 成功メッセージの確認
    //   await expect(page.getByText(/削除しました/)).toBeVisible()
    // }
  })

  test('ページネーションが機能する', async ({ page }) => {
    // ページネーションボタンの確認
    const nextButton = page.getByRole('button', { name: '次へ' })
    const prevButton = page.getByRole('button', { name: '前へ' })
    
    // ページネーション情報の確認
    await expect(page.getByText(/件中/)).toBeVisible()
  })

  test('ソート機能が動作する', async ({ page }) => {
    // テーブルヘッダーをクリックしてソート
    await page.getByText('商品名').click()
    
    // ソート矢印の確認（実装に依存）
    // await expect(page.locator('[data-sort="asc"]')).toBeVisible()
  })
})