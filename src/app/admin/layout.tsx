import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { ADMIN } from '@/constants/constants'
import { createClient } from '@/supabase/server'
import { redirect } from 'next/navigation'
import { ReactNode } from 'react'

export default async function AdmninLayout({
	children,
}: Readonly<{ children: ReactNode }>) {
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
			return redirect('/')
		}
	}
	console.log('AUTHDATA:', authData.user)
	return (
		<>
			<Header />
			<main className="min-h-[calc(100svh-128px)] py-3">{children}</main>
			<Footer />
		</>
	)
}
