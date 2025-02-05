import { createClient } from '@/supabase/server'
import { QueryData } from '@supabase/supabase-js'

const supabase = await createClient()

export const ordersWithProductsQuery = supabase
	.from('orders')
	.select('*, order_items:order_items(*, products:products(*))')
	.order('created_at', { ascending: false })

export type OrdersWithProducts = QueryData<typeof ordersWithProductsQuery>
