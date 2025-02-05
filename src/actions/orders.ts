'use server'

import { createClient } from '@/supabase/server'
import { create } from 'domain'
import { revalidatePath } from 'next/cache'

export const getOrdersWithProducts = async () => {
	const supabase = await createClient()

	const { data, error } = await supabase
		.from('orders')
		.select('*, order_items:order_items(*, products:products(*))')
		.order('created_at', { ascending: false })

	if (error) {
		throw new Error(`Error fetching orders with products: ${error.message}`)
	}

	return data
}

export const updateOrderStatus = async (orderId: number, status: string) => {
	const supabase = await createClient()

	const { error } = await supabase
		.from('orders')
		.update({ status })
		.eq('id', orderId)

	if (error) {
		throw new Error(`Error updating order status: ${error.message}`)
	}

	revalidatePath('/admin/orders')
}
