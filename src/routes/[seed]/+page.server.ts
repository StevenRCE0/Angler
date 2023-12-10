import { error } from '@sveltejs/kit';

const ssr = false;

export function load({ params }) {
    if (params.seed.length !== 8 || Number.isNaN(parseInt(params.seed, 16)))
        throw error(403);

    return {
        seed: params.seed,
    };
}
