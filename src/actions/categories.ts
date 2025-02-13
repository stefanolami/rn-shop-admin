'use server'

import slugify from 'slugify'
import { CategoriesWithProductResponse } from '@/app/admin/categories/categories.types'
import {
	CreateCategorySchema,
	CreateCategorySchemaServer,
	UpdateCategorySchema,
} from '@/app/admin/categories/create-category.schema'
import { createClient } from '@/supabase/server'
import { revalidatePath } from 'next/cache'

export const getCategoriesWithProducts =
	async (): Promise<CategoriesWithProductResponse> => {
		const supabase = await createClient()
		const { data, error } = await supabase
			.from('categories')
			.select('*, products:products(*)')
			.returns<CategoriesWithProductResponse>()

		if (error)
			throw new Error(`Error fetching categories: ${error.message}`)

		return data || []
	}

export const imageUploadHandler = async (formData: FormData) => {
	if (!formData) return

	const supabase = await createClient()

	const fileEntry = formData.get('file')

	if (!(fileEntry instanceof File)) throw new Error('Insert a file')

	const fileName = fileEntry.name

	try {
		const { data, error } = await supabase.storage
			.from('app-images')
			.upload(fileName, fileEntry, {
				cacheControl: '3600',
				upsert: false,
			})

		if (error) {
			console.error('Error uploading image', error)
			throw new Error('Error uploading image')
		}

		const {
			data: { publicUrl },
		} = await supabase.storage.from('app-images').getPublicUrl(data.path)

		return publicUrl
	} catch (error) {
		console.error('Error uploading image', error)
		throw new Error('Error uploading image')
	}
}

export const createCategory = async ({
	imageUrl,
	name,
}: CreateCategorySchemaServer) => {
	const slug = slugify(name, { lower: true })

	const supabase = await createClient()

	const { data, error } = await supabase.from('categories').insert({
		imageUrl,
		name,
		slug,
	})

	if (error) {
		console.error('Error creating category', error)
		throw new Error('Error creating category')
	}

	revalidatePath('/admin/categories')

	return data
}

export const updateCategory = async ({
	imageUrl,
	name,
	slug,
}: UpdateCategorySchema) => {
	const supabase = await createClient()

	const { data, error } = await supabase
		.from('categories')
		.update({ imageUrl, name })
		.match({ slug })

	if (error) {
		console.error('Error updating category', error)
		throw new Error('Error updating category')
	}

	revalidatePath('/admin/categories')

	return data
}

export const deleteCategory = async (id: number) => {
	const supabase = await createClient()

	const { error } = await supabase.from('categories').delete().match({ id })

	if (error) {
		console.error('Error deleting category', error)
		throw new Error('Error deleting category')
	}

	revalidatePath('/admin/categories')
}

export const getCategoryData = async () => {
	const supabase = await createClient()

	const { data, error } = await supabase
		.from('categories')
		.select('name, products:products(*)')

	if (error) {
		throw new Error(`Error fetching categories: ${error.message}`)
	}

	const categoryData = data.map(
		(category: { name: string; products: { id: number }[] }) => ({
			name: category.name,
			products: category.products.length,
		})
	)

	return categoryData
}
