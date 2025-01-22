'use server'

import { createClient } from '@/supabase/server'

export const authenticate = async (email: string, password: string) => {
	try {
		const supabase = await createClient()

		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		})
		console.log(email, password)
		console.log('DATA:', data)
		if (error) throw error
	} catch (error) {
		console.log('AUTH ERROR', error)
		throw error
	}
}
