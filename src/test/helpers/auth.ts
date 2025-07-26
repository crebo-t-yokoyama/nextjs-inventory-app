import { type Page } from '@playwright/test'

/**
 * テスト用のログインヘルパー関数
 * @param page Playwrightのページオブジェクト
 * @param email ログイン用メールアドレス（デフォルト: admin@example.com）
 * @param password ログイン用パスワード（デフォルト: password123）
 */
export async function login(
  page: Page,
  email: string = 'admin@example.com',
  password: string = 'password123'
) {
  // ログインページにアクセス
  await page.goto('/login')
  
  // フォームに入力
  await page.getByLabel('メールアドレス').fill(email)
  await page.getByLabel('パスワード').fill(password)
  
  // ログインボタンをクリック
  await page.getByRole('button', { name: 'ログイン' }).click()
  
  // ダッシュボードへのリダイレクトを待つ
  await page.waitForURL('/dashboard')
}

/**
 * テスト用のログアウトヘルパー関数
 * @param page Playwrightのページオブジェクト
 */
export async function logout(page: Page) {
  // ログアウトボタンがある場合（実装されていれば）
  const logoutButton = page.getByRole('button', { name: 'ログアウト' })
  if (await logoutButton.isVisible()) {
    await logoutButton.click()
  } else {
    // セッションを直接クリアする場合
    await page.context().clearCookies()
    await page.goto('/login')
  }
}