import { getCategoriesWithProducts } from '@/actions/categories'
import Categories from '@/components/Categories'

const CategoriesPage = async () => {
	const categories = await getCategoriesWithProducts()

	return <Categories categories={categories} />
}

export default CategoriesPage
