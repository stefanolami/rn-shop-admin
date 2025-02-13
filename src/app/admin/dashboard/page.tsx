import { getLatestUsers } from '@/actions/auth'
import { getCategoryData } from '@/actions/categories'
import { getMonthlyOrders } from '@/actions/orders'
import Dashboard from '@/components/Dashboard'

const DashbaordPage = async () => {
	const monthlyOrders = await getMonthlyOrders()
	const categoryData = await getCategoryData()
	const latestUsers = await getLatestUsers()

	return (
		<Dashboard
			monthlyOrders={monthlyOrders}
			categoryData={categoryData}
			latestUsers={latestUsers}
		/>
	)
}

export default DashbaordPage
