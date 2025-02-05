import { Category } from '../categories/categories.types'

export type ProductWithCategory = {
	category: Category
	created_at: string
	heroImage: string
	id: number
	images: string[]
	maxQuantity: number
	price: number | null
	slug: string
	title: string
}

export type ProductsWithCategoriesResponse = ProductWithCategory[]

export type UpdateProductSchema = {
	category: number
	heroImage: string
	images: string[]
	maxQuantity: number
	price: number | undefined
	slug: string
	title: string
}
