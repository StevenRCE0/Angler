import { vitePreprocess } from '@sveltejs/kit/vite';
import { adapter } from './adapter.mjs';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    // Consult https://github.com/sveltejs/svelte-preprocess
    // for more information about preprocessors
    preprocess: vitePreprocess(),

    kit: {
        adapter,
        serviceWorker: {
            register: false,
        },
    },
};

export default config;
