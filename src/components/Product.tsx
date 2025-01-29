'use client'

import { FC, useState } from 'react'
import { PlusIcon } from 'lucide-react'
import { v4 as uuid } from 'uuid'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { ProductsWithCategoriesResponse } from '@/app/admin/products/products.types'
import { Button } from '@/components/ui/button'
import {
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from '@/components/ui/dialog'
import { Category } from '@/app/admin/categories/categories.types'
import {
	createOrUpdateProductSchema,
	CreateOrUpdateProductSchema,
} from '@/app/admin/products/schema'
import { imageUploadHandler } from '@/actions/categories'
import { createProduct, deleteProduct, updateProduct } from '@/actions/products'
import { ProductForm } from '@/components/ProductForm'
import { ProductTableRow } from '@/components/ProductTableRow'

type Props = {
	categories: Category[]
	productsWithCategories: ProductsWithCategoriesResponse
}

const Product: FC<Props> = ({ categories, productsWithCategories }) => {
	const [currentProduct, setCurrentProduct] =
		useState<CreateOrUpdateProductSchema | null>(null)
	const [isProductModalOpen, setIsProductModalOpen] = useState(false)
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

	const form = useForm<CreateOrUpdateProductSchema>({
		resolver: zodResolver(createOrUpdateProductSchema),
		defaultValues: {
			category: undefined,
			heroImage: undefined,
			images: [],
			maxQuantity: undefined,
			price: undefined,
			title: '',
			intent: 'create',
		},
	})

	const router = useRouter()

	const createUpdateProductHandler = async (
		data: CreateOrUpdateProductSchema
	) => {
		const {
			category,
			images,
			heroImage,
			maxQuantity,
			price,
			title,
			slug,
			intent = 'create',
		} = data

		const uploadFile = async (file: File) => {
			const uniqueId = uuid()
			const fileName = `product/product-${uniqueId}-${file.name}`
			const formData = new FormData()
			formData.append('file', file, fileName)
			return imageUploadHandler(formData)
		}

		let heroImageUrl: string | undefined
		let imagesUrls: string[] = []

		if (heroImage) {
			const imagePromise = Array.from(heroImage).map((file) =>
				uploadFile(file as File)
			)
			try {
				;[heroImageUrl] = await Promise.all(imagePromise)
			} catch (error) {
				console.error('Error uploading hero image:', error)
				toast.error('Error uploading hero image')
				return
			}
		}

		if (images.length > 0) {
			const imagePromise = Array.from(images).map((file) =>
				uploadFile(file as File)
			)
			try {
				imagesUrls = (await Promise.all(imagePromise)) as string[]
			} catch (error) {
				console.error('Error uploading images:', error)
				toast.error('Error uploading images')
				return
			}
		}

		switch (intent) {
			case 'create': {
				if (heroImageUrl && imagesUrls.length > 0) {
					await createProduct({
						category: Number(category),
						heroImage: heroImageUrl,
						images: imagesUrls,
						maxQuantity: Number(maxQuantity),
						price: Number(price),
						title,
					})
					form.reset()
					router.refresh()
					setIsProductModalOpen(false)
					toast.success('Product created successfully')
				}
				break
			}
			case 'update': {
				if (heroImageUrl && imagesUrls.length > 0 && slug) {
					await updateProduct({
						category: Number(category),
						heroImage: heroImageUrl,
						imagesUrl: imagesUrls,
						maxQuantity: Number(maxQuantity),
						price: Number(price),
						slug,
						title,
					})
					setIsProductModalOpen(false)
					toast.success('Product updated successfully')
					form.reset()
					router.refresh()
				}
				break
			}
			default: {
				console.error('Invalid intent')
			}
		}
	}

	const deleteProductHandler = async () => {
		if (currentProduct?.slug) {
			await deleteProduct(currentProduct.slug)
			setIsDeleteModalOpen(false)
			router.refresh()
			toast.success('Product deleted successfully')
			setCurrentProduct(null)
		}
	}

	return (
		<div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
			<div className="container mx-auto p-4">
				<div className="flex justify-between items-center mb-4">
					<h1 className="text-2xl font-bold">Products Management</h1>
					<Button
						onClick={() => {
							setIsProductModalOpen(true)
							setCurrentProduct(null)
						}}
					>
						<PlusIcon className="mr-2 h-4 w-4" />
						<span>Add Product</span>
					</Button>
				</div>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Title</TableHead>
							<TableHead>Category</TableHead>
							<TableHead>Price</TableHead>
							<TableHead>Max Quantity</TableHead>
							<TableHead>Hero Image</TableHead>
							<TableHead>Product Images</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{productsWithCategories.map((product) => (
							<ProductTableRow
								key={product.id}
								product={product}
								setIsDeleteModalOpen={setIsDeleteModalOpen}
								setIsProductModalOpen={setIsProductModalOpen}
								setCurrentProduct={setCurrentProduct}
							/>
						))}
					</TableBody>
				</Table>
				{/* Product Modal */}
				<ProductForm
					form={form}
					categories={categories}
					onSubmit={createUpdateProductHandler}
					isProductModalOpen={isProductModalOpen}
					setIsProductModalOpen={setIsProductModalOpen}
					defaultValues={currentProduct}
				/>

				{/* Delete Product Modal */}
				<Dialog
					open={isDeleteModalOpen}
					onOpenChange={() => setIsDeleteModalOpen(false)}
				>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Delete Product</DialogTitle>
						</DialogHeader>
						<p>
							Are you sure you want to delete{' '}
							{currentProduct?.title}
						</p>
						<DialogFooter>
							<Button onClick={() => setIsDeleteModalOpen(false)}>
								Cancel
							</Button>
							<Button
								variant="destructive"
								onClick={deleteProductHandler}
							>
								Delete
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>
		</div>
	)
}

export default Product
