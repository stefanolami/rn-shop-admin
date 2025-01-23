'use server'

import { CategoriesWithProductResponse } from '@/app/admin/categories/categories.types'
import { createClient } from '@/supabase/server'

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
