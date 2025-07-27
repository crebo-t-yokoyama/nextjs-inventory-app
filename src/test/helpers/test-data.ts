import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

type Category = Database['public']['Tables']['categories']['Row']
type Product = Database['public']['Tables']['products']['Row']
type InventoryTransaction = Database['public']['Tables']['inventory_transactions']['Row']

/**
 * E2Eテスト用のテストデータ管理ヘルパー
 */
export class TestDataManager {
  private supabase: ReturnType<typeof createClient<Database>>

  constructor() {
    // Playwright実行環境をチェック（NODE_ENVはPlaywrightでは設定されない場合がある）
    const isPlaywrightTest = process.env.TEST_MODE === 'e2e' || 
                            process.env.PLAYWRIGHT_TEST_BASE_URL || 
                            process.env.PW_TEST || 
                            typeof globalThis.expect?.extend === 'function'
    
    if (!isPlaywrightTest && process.env.NODE_ENV === 'production') {
      throw new Error('TestDataManager cannot be used in production environment')
    }
  }

  private getSupabaseClient() {
    if (!this.supabase) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

      if (!supabaseUrl || !supabaseServiceKey) {
        throw new Error('Missing Supabase environment variables for testing')
      }

      this.supabase = createClient<Database>(supabaseUrl, supabaseServiceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      })
    }
    return this.supabase
  }

  /**
   * テストデータのセットアップ
   */
  async setupTestData() {
    const supabase = this.getSupabaseClient()

    // 1. テストカテゴリの作成
    const testCategories = [
      { id: 'test-cat-1', name: 'テスト食品', description: 'テスト用の食品カテゴリ' },
      { id: 'test-cat-2', name: 'テスト日用品', description: 'テスト用の日用品カテゴリ' },
      { id: 'test-cat-3', name: 'テスト文具', description: 'テスト用の文具カテゴリ' },
    ]

    const { error: categoriesError } = await supabase
      .from('categories')
      .upsert(testCategories, { onConflict: 'id' })

    if (categoriesError) {
      console.error('Failed to setup test categories:', categoriesError)
      throw categoriesError
    }

    // 2. テスト商品の作成
    const testProducts = [
      {
        id: 'test-prod-1',
        product_code: 'TEST001',
        name: 'テスト商品A',
        category_id: 'test-cat-1',
        price: 500,
        current_stock: 10,
        min_stock_threshold: 5,
        description: 'E2Eテスト用の商品A',
        created_by: 'test-user',
        updated_by: 'test-user',
      },
      {
        id: 'test-prod-2',
        product_code: 'TEST002',
        name: 'テスト商品B',
        category_id: 'test-cat-2',
        price: 1000,
        current_stock: 3,
        min_stock_threshold: 5,
        description: 'E2Eテスト用の商品B（在庫少）',
        created_by: 'test-user',
        updated_by: 'test-user',
      },
      {
        id: 'test-prod-3',
        product_code: 'TEST003',
        name: 'テスト商品C',
        category_id: 'test-cat-3',
        price: 750,
        current_stock: 0,
        min_stock_threshold: 3,
        description: 'E2Eテスト用の商品C（在庫切れ）',
        created_by: 'test-user',
        updated_by: 'test-user',
      },
    ]

    const { error: productsError } = await supabase
      .from('products')
      .upsert(testProducts, { onConflict: 'id' })

    if (productsError) {
      console.error('Failed to setup test products:', productsError)
      throw productsError
    }

    // 3. テスト入出庫履歴の作成
    const testTransactions = [
      {
        id: 'test-trans-1',
        product_id: 'test-prod-1',
        user_id: 'test-user',
        transaction_type: 'IN' as const,
        quantity: 15,
        notes: 'テスト入庫',
        transaction_date: new Date('2024-01-01T10:00:00Z').toISOString(),
      },
      {
        id: 'test-trans-2',
        product_id: 'test-prod-1',
        user_id: 'test-user',
        transaction_type: 'OUT' as const,
        quantity: 5,
        notes: 'テスト出庫',
        transaction_date: new Date('2024-01-02T14:00:00Z').toISOString(),
      },
      {
        id: 'test-trans-3',
        product_id: 'test-prod-2',
        user_id: 'test-user',
        transaction_type: 'IN' as const,
        quantity: 8,
        notes: 'テスト入庫B',
        transaction_date: new Date('2024-01-03T09:00:00Z').toISOString(),
      },
    ]

    const { error: transactionsError } = await supabase
      .from('inventory_transactions')
      .upsert(testTransactions, { onConflict: 'id' })

    if (transactionsError) {
      console.error('Failed to setup test transactions:', transactionsError)
      throw transactionsError
    }

    console.log('✅ Test data setup completed')
    return {
      categories: testCategories,
      products: testProducts,
      transactions: testTransactions,
    }
  }

  /**
   * テストデータのクリーンアップ
   */
  async cleanupTestData() {
    const supabase = this.getSupabaseClient()

    try {
      // 外部キー制約を考慮して順番に削除
      // 1. 入出庫履歴を削除
      await supabase
        .from('inventory_transactions')
        .delete()
        .like('id', 'test-%')

      // 2. 商品を削除
      await supabase
        .from('products')
        .delete()
        .like('id', 'test-%')

      // 3. カテゴリを削除
      await supabase
        .from('categories')
        .delete()
        .like('id', 'test-%')

      console.log('✅ Test data cleanup completed')
    } catch (error) {
      console.error('Failed to cleanup test data:', error)
      throw error
    }
  }

  /**
   * 特定の商品の在庫を更新
   */
  async updateProductStock(productId: string, newStock: number) {
    const supabase = this.getSupabaseClient()

    const { error } = await supabase
      .from('products')
      .update({ current_stock: newStock })
      .eq('id', productId)

    if (error) {
      console.error('Failed to update product stock:', error)
      throw error
    }
  }

  /**
   * 新しい入出庫記録を作成
   */
  async createTransaction(
    productId: string,
    type: 'IN' | 'OUT',
    quantity: number,
    notes?: string
  ) {
    const supabase = this.getSupabaseClient()

    const transaction = {
      id: `test-trans-${Date.now()}`,
      product_id: productId,
      user_id: 'test-user',
      transaction_type: type,
      quantity,
      notes: notes || `テスト${type === 'IN' ? '入庫' : '出庫'}`,
      transaction_date: new Date().toISOString(),
    }

    const { error } = await supabase
      .from('inventory_transactions')
      .insert(transaction)

    if (error) {
      console.error('Failed to create transaction:', error)
      throw error
    }

    // 商品の在庫数も更新
    if (type === 'IN') {
      await supabase.rpc('increment_stock', {
        product_id: productId,
        amount: quantity,
      })
    } else {
      await supabase.rpc('decrement_stock', {
        product_id: productId,
        amount: quantity,
      })
    }

    return transaction
  }

  /**
   * テスト用ユーザーを作成/確認
   */
  async ensureTestUser() {
    // Note: 実際の認証ユーザー作成は複雑なので、
    // 今回はダミーのuser_idを使用
    return 'test-user'
  }
}

// シングルトンインスタンス
export const testDataManager = new TestDataManager()