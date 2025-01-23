import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function HomePage() {
	return (
		<div className="w-full px-10 py-10 flex justify-between">
			<h1>HomePage</h1>
			<Link href="/auth">
				<Button>Auth</Button>
			</Link>
		</div>
	)
}
