'use server'

import { createClient } from '@/supabase/server'

async function sendPushNotification({
	expoPushToken,
	title,
	body,
}: {
	expoPushToken: string
	title: string
	body: string
}) {
	const message = {
		to: expoPushToken,
		sound: 'default',
		title: title,
		body: body,
		data: { someData: 'goes here' },
	}

	await fetch('https://exp.host/--/api/v2/push/send', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Accept-encoding': 'gzip, deflate',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(message),
	})
}

const getUserNotificationToken = async (userId: string) => {
	const supabase = await createClient()

	const { data, error } = await supabase
		.from('users')
		.select('expo_notification_token')
		.eq('id', userId)
		.single()

	if (error) {
		throw new Error(error.message)
	}

	return data
}

export const sendNotifications = async ({
	userId,
	title,
	body,
}: {
	userId: string
	title: string
	body: string
}) => {
	const tokenData = await getUserNotificationToken(userId)

	if (!tokenData.expo_notification_token) return

	await sendPushNotification({
		expoPushToken: tokenData.expo_notification_token,
		title,
		body,
	})
}
