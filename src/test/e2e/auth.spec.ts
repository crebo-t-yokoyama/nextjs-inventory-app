import { test, expect } from '@playwright/test'
import { login, logout } from '../helpers/auth'

test.describe('認証機能', () => {
  test.beforeEach(async ({ page }) => {
    // 各テスト前にセッションをクリア
    await page.context().clearCookies()
  })

  test('ログインページが正しく表示される', async ({ page }) => {
    await page.goto('/login')
    
    // ページタイトルの確認
    await expect(page).toHaveTitle(/在庫管理システム/)
    
    // ログインフォームの要素確認
    await expect(page.getByRole('heading', { name: 'ログイン' })).toBeVisible()
    await expect(page.getByRole('heading', { name: '在庫管理システム' })).toBeVisible()
    await expect(page.getByText('小売業界向けの在庫管理システム')).toBeVisible()
    
    // フォーム要素の確認
    await expect(page.getByLabel('メールアドレス')).toBeVisible()
    await expect(page.getByLabel('パスワード')).toBeVisible()
    await expect(page.getByRole('button', { name: 'ログイン' })).toBeVisible()
  })

  test('正しい認証情報でログインできる', async ({ page }) => {
    await page.goto('/login')
    
    // ログイン情報を入力
    await page.getByLabel('メールアドレス').fill('admin@example.com')
    await page.getByLabel('パスワード').fill('password123')
    
    // ログインボタンをクリック
    await page.getByRole('button', { name: 'ログイン' }).click()
    
    // ダッシュボードにリダイレクトされることを確認
    await expect(page).toHaveURL('/dashboard')
    await expect(page.getByRole('heading', { name: 'ダッシュボード' })).toBeVisible()
  })

  test('間違った認証情報でログインできない', async ({ page }) => {
    await page.goto('/login')
    
    // 間違った認証情報を入力
    await page.getByLabel('メールアドレス').fill('wrong@example.com')
    await page.getByLabel('パスワード').fill('wrongpassword')
    
    // ログインボタンをクリック
    await page.getByRole('button', { name: 'ログイン' }).click()
    
    // ログインページに留まることを確認
    await expect(page).toHaveURL(/\/login/)
    
    // エラーメッセージまたはログインフォームが再表示されることを確認
    await expect(page.getByRole('heading', { name: 'ログイン' })).toBeVisible()
  })

  test('必須フィールドのバリデーションが動作する', async ({ page }) => {
    await page.goto('/login')
    
    // 空のフォームでログインを試行
    await page.getByRole('button', { name: 'ログイン' }).click()
    
    // ログインページに留まることを確認
    await expect(page).toHaveURL(/\/login/)
  })

  test('認証済みユーザーがダッシュボードにアクセスできる', async ({ page }) => {
    // ログインヘルパーを使用
    await login(page)
    
    // ダッシュボードにアクセスできることを確認
    await expect(page).toHaveURL('/dashboard')
    await expect(page.getByRole('heading', { name: 'ダッシュボード' })).toBeVisible()
  })

  test('認証済みユーザーが商品管理にアクセスできる', async ({ page }) => {
    await login(page)
    
    // 商品管理ページにアクセス
    await page.goto('/products')
    await expect(page).toHaveURL('/products')
    await expect(page.getByRole('heading', { name: '商品管理' })).toBeVisible()
  })

  test('認証済みユーザーが入出庫管理にアクセスできる', async ({ page }) => {
    await login(page)
    
    // 入出庫管理ページにアクセス
    await page.goto('/inventory')
    await expect(page).toHaveURL('/inventory')
    await expect(page.getByRole('heading', { name: '入出庫管理' })).toBeVisible()
  })

  test('未認証ユーザーは保護されたページにアクセスできない', async ({ page }) => {
    // セッションをクリア
    await page.context().clearCookies()
    
    // 保護されたページにアクセスを試行
    const protectedRoutes = ['/dashboard', '/products', '/inventory']
    
    for (const route of protectedRoutes) {
      await page.goto(route)
      // ログインページにリダイレクトされることを確認
      await expect(page).toHaveURL(/\/login/)
      await expect(page.getByRole('heading', { name: 'ログイン' })).toBeVisible()
    }
  })

  test('ナビゲーションが認証状態で正しく動作する', async ({ page }) => {
    await login(page)
    
    // ナビゲーションリンクの確認
    await expect(page.getByRole('link', { name: 'ダッシュボード' })).toBeVisible()
    await expect(page.getByRole('link', { name: '商品管理' })).toBeVisible()
    await expect(page.getByRole('link', { name: '入出庫管理' })).toBeVisible()
    
    // 商品管理へのナビゲーション
    await page.getByRole('link', { name: '商品管理' }).click()
    await expect(page).toHaveURL('/products')
    
    // 入出庫管理へのナビゲーション
    await page.getByRole('link', { name: '入出庫管理' }).click()
    await expect(page).toHaveURL('/inventory')
    
    // ダッシュボードへのナビゲーション
    await page.getByRole('link', { name: 'ダッシュボード' }).click()
    await expect(page).toHaveURL('/dashboard')
  })
})