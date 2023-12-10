import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        sveltekit(),
        SvelteKitPWA({
            registerType: 'autoUpdate',
            injectRegister: 'inline',
            includeAssets: ['*.svg', '*.png', 'robots.txt'],
            manifest: {
                name: 'Anglerfish',
                start_url: '/',
                id: '/',
                short_name: 'Angler',
                description: '((hello))',
                theme_color: '#e3e3e3',
                icons: [
                    {
                        src: '/pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: '/pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                    },
                ],
            },
        }),
    ],
});
