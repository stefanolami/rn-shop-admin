import { getCategoriesWithProducts } from '@/actions/categories'
import Product from '@/components/Product'
import { getProductsWithCategories } from '@/actions/products'

const ProductsPage = async () => {
	const categories = await getCategoriesWithProducts()
	const productsWithCategories = await getProductsWithCategories()
	/* console.log('CATEGORIES', categories)
	console.log('PRODUCTS', productsWithCategories) */

	return (
		<Product
			categories={categories}
			productsWithCategories={productsWithCategories}
		/>
	)
}

export default ProductsPage
