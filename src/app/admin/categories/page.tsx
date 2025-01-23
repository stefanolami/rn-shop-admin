import { getCategoriesWithProducts } from '@/actions/categories'

const CategoriesPage = async () => {
	const categories = await getCategoriesWithProducts()

	console.log(categories)

	return <div>CategoriesPage</div>
}

export default CategoriesPage
