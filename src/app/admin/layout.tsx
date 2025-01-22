import { ReactNode } from 'react'

export default function AdmninLayout({
	children,
}: Readonly<{ children: ReactNode }>) {
	return <>{children}</>
}
