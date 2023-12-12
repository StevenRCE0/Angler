import { vitePreprocess } from '@sveltejs/kit/vite';import process from 'node:process';
import AdapterNode from '@sveltejs/adapter-auto';
// import AdpaterStatic from '@sveltejs/adapter-static';
import AdapterVercel from '@sveltejs/adapter-vercel';

export const nodeAdapter = process.env.NODE_ADAPTER === 'true';

export const adapter = nodeAdapter ? AdapterNode() : AdapterVercel();

/** @type {import('@sveltejs/kit').Config} */
const config = {
    // Consult https://kit.svelte.dev/docs/integrations#preprocessors
    // for more information about preprocessors
    preprocess: vitePreprocess(),

    kit: {
        // adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
        // If your environment is not supported or you settled on a specific environment, switch out the adapter.
        // See https://kit.svelte.dev/docs/adapters for more information about adapters.
        adapter
    },
};

export default config;
