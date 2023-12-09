<script lang="ts">
    import { setSeed, type Memory } from '$lib/memory';
    import { memoryStorage } from '$lib/storage';
    import { browser } from '$app/environment';
    import Seeds from './Seeds.svelte';

    $: seeds = Array<Memory>();

    const loadDB = async () => {
        const data = await memoryStorage.content.toArray();
        seeds = data;
    };

    // load data when running on client
    if (browser) {
        loadDB();
    }

    function plantSeed(seed: string, notation: string) {
        setSeed(seed, notation);
        loadDB();
    }
</script>

<svelte:head>
    <title>Anglerfish</title>
    <meta name="description" content="Hello!" />
</svelte:head>

<div class="Container">
    <div class="UpperSignal">
        {seeds.map((seed) => seed.seed).join(', ')}
    </div>
    <div class="LowerSignal"></div>
</div>
<Seeds {plantSeed} />

<style>
    .Container {
        --glare-color: linear-gradient(
            180deg,
            hsla(132, 15%, 98%, 3%) 0%,
            hsla(192, 13%, 5%, 2%) 100%
        );
        position: relative;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        --upper-signal-color: azure;
        --lower-signal-color: pink;
    }
    .UpperSignal {
        position: absolute;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100pt;
        background: var(--upper-signal-color) var(--glare-color);
        z-index: 100;
    }
    .LowerSignal {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100vw;
        height: 100pt;
        background: var(--lower-signal-color) var(--glare-color);
        z-index: 100;
    }
</style>
