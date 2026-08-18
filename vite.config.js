import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		VitePWA({
			registerType: 'autoUpdate',
			includeAssets: ['icon.svg'],
			manifest: {
				name: 'Slow Pour — Home Brew Calculator',
				short_name: 'Slow Pour',
				description: 'A calm, precise pour-over companion',
				start_url: '/',
				scope: '/',
				theme_color: '#F1F5F8',
				background_color: '#F1F5F8',
				display: 'standalone',
				orientation: 'portrait-primary',
				icons: [
					{
						src: '/icon-192.png',
						sizes: '192x192',
						type: 'image/png'
					},
					{
						src: '/icon-512.png',
						sizes: '512x512',
						type: 'image/png'
					},
					{
						src: '/icon-512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'maskable'
					}
				]
			},
			workbox: {
				globPatterns: ['**/*.{js,css,html,woff2}']
			}
		})
	]
});
