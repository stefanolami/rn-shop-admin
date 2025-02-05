import { getOrdersWithProducts } from '@/actions/orders'
import Orders from '@/components/Orders'

const OrdersPage = async () => {
	const ordersWithProducts = await getOrdersWithProducts()

	if (!ordersWithProducts) {
		return (
			<div className="text-center font-bold text-2xl">
				No orders found
			</div>
		)
	}

	return <Orders ordersWithProducts={ordersWithProducts} />
}

export default OrdersPage
