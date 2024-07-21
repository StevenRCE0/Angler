import { error } from '@sveltejs/kit';

const ssr = false;
const prerender = true;

export function load({ url }) {
    const addSeed = url.searchParams.get('seed');
    const addName = url.searchParams.get('name');

    return {
        seed: addSeed,
        name: addName
    };
}
