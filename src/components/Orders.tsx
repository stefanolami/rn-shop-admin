'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'

import { OrdersWithProducts } from '@/app/admin/orders/orders.types'
import { updateOrderStatus } from '@/actions/orders'
import { useRouter } from 'next/navigation'

const statusOptions = ['Pending', 'Shipped', 'Delivered']

type Props = {
	ordersWithProducts: OrdersWithProducts
}

type OrderedProducts = {
	order_id: number
	product: {
		category: number
		created_at: string
		heroImage: string
		id: number
		images: string[]
		maxQuantity: number
		price: number
		slug: string
		title: string
	}
}[]

const Orders = ({ ordersWithProducts }: Props) => {
	const [selectedProducts, setSelectedProducts] = useState<OrderedProducts>(
		[]
	)

	const router = useRouter()

	const openProductsModal = (products: OrderedProducts) => () => {
		setSelectedProducts(products)
	}

	const orderedProducts = ordersWithProducts.flatMap((order) =>
		order.order_items.map((item) => ({
			order_id: order.id,
			product: item.products,
		}))
	)

	const handleStatusChange = async (orderId: number, status: string) => {
		await updateOrderStatus(orderId, status)
		//router.refresh()
	}

	return (
		<div className="container mx-auto p-6">
			<h1 className="text-2xl font-bold mb-6">Orders</h1>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>ID</TableHead>
						<TableHead>Created At</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Description</TableHead>
						<TableHead>User</TableHead>
						<TableHead>Slug</TableHead>
						<TableHead>Total Price</TableHead>
						<TableHead>Products</TableHead>
						<TableHead>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{ordersWithProducts.map((order) => (
						<TableRow key={order.id}>
							<TableCell>{order.id}</TableCell>
							<TableCell>
								{format(
									new Date(order.created_at),
									'MM/dd/yyyy'
								)}
							</TableCell>
							<TableCell>
								<Select
									onValueChange={(value) =>
										handleStatusChange(order.id, value)
									}
									defaultValue={order.status}
								>
									<SelectTrigger className="w-[120px]">
										<SelectValue>
											{order.status}
										</SelectValue>
									</SelectTrigger>
									<SelectContent>
										{statusOptions.map((status, index) => (
											<SelectItem
												value={status}
												key={index}
											>
												{status}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</TableCell>
							<TableCell>{order.description || '-'}</TableCell>
							{/* @ts-expect-error  supabase doesn't recognize nested object types */}
							<TableCell>{order.user.email}</TableCell>
							<TableCell>{order.slug}</TableCell>
							<TableCell>
								$ {order.totalPrice.toFixed(2)}
							</TableCell>
							<TableCell>
								{order.order_items.length} item
								{order.order_items.length > 1 && 's'}
							</TableCell>
							<TableCell>
								<Dialog>
									<DialogTrigger asChild>
										<Button
											variant="outline"
											size="sm"
											onClick={openProductsModal(
												orderedProducts.filter(
													(item) =>
														item.order_id ===
														order.id
												)
											)}
										>
											View Products
										</Button>
									</DialogTrigger>
									<DialogContent aria-describedby={undefined}>
										<DialogHeader>
											<DialogTitle>
												Order Products
											</DialogTitle>
										</DialogHeader>
										<div className="mt-4">
											{selectedProducts.map(
												({ product }, index) => (
													<div
														key={index}
														className="mr-2 mb-2 flex items-center space-x-2"
													>
														<Image
															className="w-16 h-16 object-cover rounded"
															src={
																product.heroImage
															}
															alt={product.title}
															width={64}
															height={64}
														/>
														<div className="flex flex-col">
															<span className="font-semibold">
																{product.title}
															</span>
															<span className="text-gray-600">
																${' '}
																{product.price.toFixed(
																	2
																)}
															</span>
															<span className="text-sm text-gray-600">
																Available
																quantity:{' '}
																{
																	product.maxQuantity
																}
															</span>
														</div>
													</div>
												)
											)}
										</div>
									</DialogContent>
								</Dialog>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	)
}

export default Orders
