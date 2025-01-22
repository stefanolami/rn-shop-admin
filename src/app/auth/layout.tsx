import { ADMIN } from '@/constants/constants'
import { createClient } from '@/supabase/server'
import { redirect } from 'next/navigation'
import { ReactNode } from 'react'

const AuthLayout = async ({ children }: Readonly<{ children: ReactNode }>) => {
	const supabase = await createClient()

	const { data: authData } = await supabase.auth.getUser()

	if (authData?.user) {
		const { data, error } = await supabase
			.from('users')
			.select('*')
			.eq('id', authData.user.id)
			.single()

		console.log('DATA', data)
		if (error || !data) {
			console.log('Error fetching data', error)
			return
		}

		if (data.type === ADMIN) {
			console.log(data.type)
			return redirect('/admin')
		}
	}
	console.log('AUTHDATA:', authData.user)

	return <>{children}</>
}

export default AuthLayout
