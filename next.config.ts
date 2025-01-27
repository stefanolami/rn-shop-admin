import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'setvhsfozkamwnvtcrwr.supabase.co',
			},
		],
	},
}

export default nextConfig
