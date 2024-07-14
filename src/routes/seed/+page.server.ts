import { error } from '@sveltejs/kit';

const ssr = false;

export function load({ url }) {
    const addSeed = url.searchParams.get('seed');
    const addName = url.searchParams.get('name');
    if (!addSeed || addSeed.length !== 8 || Number.isNaN(parseInt(addSeed, 16)))
        throw error(403);

    return {
        seed: addSeed,
        name: addName
    };
}
