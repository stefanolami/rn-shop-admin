import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'setvhsfozkamwnvtcrwr.supabase.co',
			},
			{
				protocol: 'https',
				hostname: 'images.unsplash.com',
			},
		],
	},
}

export default nextConfig
