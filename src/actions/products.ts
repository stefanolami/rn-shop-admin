'use server'

import slugify from 'slugify'
import {
	ProductsWithCategoriesResponse,
	UpdateProductSchema,
} from '../app/admin/products/products.types'
import { createClient } from '@/supabase/server'
import { CreateProductSchemaServer } from '../app/admin/products/schema'

export const getProductsWithCategories =
	async (): Promise<ProductsWithCategoriesResponse> => {
		const supabase = await createClient()
		const { data, error } = await supabase
			.from('products')
			.select('*, category(*)')
			.returns<ProductsWithCategoriesResponse>()

		if (error) {
			throw new Error(
				`Error fetching products with categories: ${error.message}`
			)
		}

		return data || []
	}

export const createProduct = async ({
	category,
	heroImage,
	images,
	maxQuantity,
	price,
	title,
}: CreateProductSchemaServer) => {
	const supabase = await createClient()
	const slug = slugify(title, { lower: true })

	const { data, error } = await supabase.from('products').insert({
		category,
		heroImage,
		images,
		maxQuantity,
		price,
		slug,
		title,
	})

	if (error) {
		throw new Error(`Error creating product: ${error.message}`)
	}

	return data
}

export const updateProduct = async ({
	category,
	heroImage,
	imagesUrl,
	maxQuantity,
	price,
	slug,
	title,
}: UpdateProductSchema) => {
	const supabase = await createClient()
	const { data, error } = await supabase
		.from('products')
		.update({
			category,
			heroImage,
			images: imagesUrl,
			maxQuantity,
			price,
			title,
		})
		.match({ slug })

	if (error) {
		throw new Error(`Error updating product: ${error.message}`)
	}

	return data
}

export const deleteProduct = async (slug: string) => {
	const supabase = await createClient()
	const { error } = await supabase.from('products').delete().match({ slug })

	if (error) {
		throw new Error(`Error deleting product: ${error.message}`)
	}
}
