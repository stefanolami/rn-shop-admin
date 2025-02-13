'use server'

import { createClient } from '@/supabase/server'
import { create } from 'domain'
import { revalidatePath } from 'next/cache'
import { sendNotifications } from './notifications'

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

	const { data: order, error } = await supabase
		.from('orders')
		.update({ status })
		.eq('id', orderId)
		.select()
		.single()

	if (error) {
		throw new Error(`Error updating order status: ${error.message}`)
	}

	console.log(order)

	const {
		data: { user },
	} = await supabase.auth.getUser()

	const userId = user?.id

	if (!userId) {
		throw new Error('User not found')
	}

	await sendNotifications({
		userId,
		title: `Order ${order.status}`,
		body: `Your order ${order.slug} has been ${order.status}`,
	})

	revalidatePath('/admin/orders')
}

export const getMonthlyOrders = async () => {
	const supabase = await createClient()

	const { data, error } = await supabase.from('orders').select('created_at')

	if (error) {
		throw new Error(`Error fetching monthly orders: ${error.message}`)
	}

	const monthNames = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec',
	]

	const ordersByMonth = data.reduce(
		(acc: Record<string, number>, order: { created_at: string }) => {
			const date = new Date(order.created_at)
			const month = monthNames[date.getUTCMonth()]

			if (!acc[month]) acc[month] = 0
			acc[month]++

			return acc
		},
		{}
	)

	return Object.keys(ordersByMonth).map((month) => ({
		name: month,
		orders: ordersByMonth[month],
	}))
}
