import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [
        sveltekit(),
        SvelteKitPWA({
            srcDir: './src',
            mode: 'development',
            scope: '/',
            base: '/',
            selfDestroying: process.env.SELF_DESTROYING_SW === 'true',
            manifest: {
                short_name: 'Angler',
                name: 'Anglerfish',
                start_url: '/',
                scope: '/',
                display: 'standalone',
                theme_color: '#e3e3e3',
                background_color: '#e3e3e3',
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
                    {
                        src: '/pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any maskable',
                    },
                ],
            },
            injectManifest: {
                globPatterns: [
                    'client/**/*.{js,css,ico,png,svg}',
                ],
            },
            workbox: {
                globPatterns: [
                    'client/**/*.{js,css,ico,png,svg}',
                ],
            },
            devOptions: {
                enabled: true,
                suppressWarnings: process.env.SUPPRESS_WARNING === 'true',
                type: 'module',
                navigateFallback: '/',
            },
            // if you have shared info in svelte config file put in a separate module and use it also here
            kit: {
                includeVersionFile: true,
            },
        }),
    ],
});
