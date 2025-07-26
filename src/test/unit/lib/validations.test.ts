import { describe, expect, it } from 'vitest'
import { 
  inventoryTransactionSchema,
  productSchema, 
  type InventoryTransactionSchema,
  type ProductSchema
} from '@/lib/validations'

describe('Validation Schemas', () => {
  describe('productSchema', () => {
    it('正常な商品データをバリデーションできる', () => {
      const validProduct: ProductSchema = {
        name: 'テスト商品',
        categoryId: '123e4567-e89b-12d3-a456-426614174000',
        price: 1000,
        minStockThreshold: 10,
        description: 'テスト用商品説明'
      }

      const result = productSchema.safeParse(validProduct)
      expect(result.success).toBe(true)
    })

    it('必須フィールドが欠けている場合エラーを返す', () => {
      const invalidProduct = {
        // nameが欠けている
        categoryId: '123e4567-e89b-12d3-a456-426614174000',
        price: 1000,
        minStockThreshold: 10
      }

      const result = productSchema.safeParse(invalidProduct)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues.some(issue => issue.path.includes('name'))).toBe(true)
      }
    })

    it('価格が負の値の場合エラーを返す', () => {
      const invalidProduct: ProductSchema = {
        name: 'テスト商品',
        categoryId: '123e4567-e89b-12d3-a456-426614174000',
        price: -100,
        minStockThreshold: 10,
        description: 'テスト用商品説明'
      }

      const result = productSchema.safeParse(invalidProduct)
      expect(result.success).toBe(false)
    })

    it('無効なUUIDが渡された場合エラーを返す', () => {
      const invalidProduct: Partial<ProductSchema> = {
        name: 'テスト商品',
        categoryId: 'invalid-uuid',
        price: 1000,
        minStockThreshold: 10
      }

      const result = productSchema.safeParse(invalidProduct)
      expect(result.success).toBe(false)
    })
  })

  describe('inventoryTransactionSchema', () => {
    it('正常な入庫データをバリデーションできる', () => {
      const validTransaction: InventoryTransactionSchema = {
        productId: '123e4567-e89b-12d3-a456-426614174000',
        transactionType: 'IN',
        quantity: 50,
        notes: '入庫処理'
      }

      const result = inventoryTransactionSchema.safeParse(validTransaction)
      expect(result.success).toBe(true)
    })

    it('正常な出庫データをバリデーションできる', () => {
      const validTransaction: InventoryTransactionSchema = {
        productId: '123e4567-e89b-12d3-a456-426614174000',
        transactionType: 'OUT',
        quantity: 20,
        notes: '出庫処理'
      }

      const result = inventoryTransactionSchema.safeParse(validTransaction)
      expect(result.success).toBe(true)
    })

    it('数量が0以下の場合エラーを返す', () => {
      const invalidTransaction: InventoryTransactionSchema = {
        productId: '123e4567-e89b-12d3-a456-426614174000',
        transactionType: 'IN',
        quantity: 0,
        notes: '無効な数量'
      }

      const result = inventoryTransactionSchema.safeParse(invalidTransaction)
      expect(result.success).toBe(false)
    })

    it('無効な取引種別の場合エラーを返す', () => {
      const invalidTransaction = {
        productId: '123e4567-e89b-12d3-a456-426614174000',
        transactionType: 'INVALID',
        quantity: 10,
        notes: '無効な種別'
      }

      const result = inventoryTransactionSchema.safeParse(invalidTransaction)
      expect(result.success).toBe(false)
    })

    it('備考はオプションなので省略可能', () => {
      const validTransaction: Omit<InventoryTransactionSchema, 'notes'> = {
        productId: '123e4567-e89b-12d3-a456-426614174000',
        transactionType: 'IN',
        quantity: 10
      }

      const result = inventoryTransactionSchema.safeParse(validTransaction)
      expect(result.success).toBe(true)
    })
  })
})