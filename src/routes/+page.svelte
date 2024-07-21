<script lang="ts">
    import {
        type Memory,
        type ActiveMemory,
        getActive,
        ImportingSeedType,
    } from '$lib/memory';
    import { memoryStorage } from '$lib/storage';
    import { browser } from '$app/environment';
    import Seeds from './Seeds.svelte';
    import { Hasher } from '$lib/hash';
    import ImportSeed from '../components/seed/ImportSeed.svelte';
    import { beforeUpdate } from 'svelte';

    $: seeds = Array<Memory>();
    $: open = false;

    let activeSeed: ActiveMemory;
    let data: ImportingSeedType | undefined;

    beforeUpdate(() => {
        if (browser) {
            const url = new URL(window.location.href);
            const seed = url.searchParams.get('seed');
            const name = url.searchParams.get('name');
            if (seed) {
                data = { seed, name };
            }
        }
    });

    const loadDB = async () => {
        seeds = await memoryStorage.content.toArray();
        activeSeed = await getActive();
    };

    // load data when running on client
    if (browser) {
        loadDB();
    }

    let hasher: Hasher | null = null;
    let canvas: HTMLCanvasElement | null = null;

    $: {
        if (activeSeed) {
            if (browser && canvas) {
                if (hasher === null) {
                    hasher = new Hasher(canvas, activeSeed.seed);
                } else {
                    hasher.seed = activeSeed.seed;
                }
            }
        }
    }
</script>

<svelte:head>
    <title>Anglerfish</title>
    <meta name="description" content="Hello!" />
</svelte:head>

{#if data}
    <ImportSeed importing={data} />
{:else}
    <div class="Container">
        <canvas bind:this={canvas} />
        <div class="UpperSignal"></div>
        <div class="LowerSignal"></div>
    </div>
    <button on:click={() => (open = !open)}>
        {#if seeds.length > 0}
            {#if open}
                [<s>menu</s>]
            {:else}
                [menu]
            {/if}
        {:else if open}
            [<s>plant</s>]
        {:else}
            <span>[plant]</span>
        {/if}
    </button>
    {#if open}
        <Seeds refresh={loadDB} {seeds} {activeSeed} />
    {/if}
{/if}

<style>
    .Container {
        --glare-color: linear-gradient(
            180deg,
            hsla(132, 15%, 98%, 3%) 0%,
            hsla(192, 13%, 5%, 2%) 100%
        );
        position: fixed;
        width: 100vw;
        height: 100dvh;
        overflow: hidden;
        --upper-signal-color: azure;
        --lower-signal-color: pink;
    }
    .UpperSignal {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 50%;
        background: var(--glare-color);
    }
    .LowerSignal {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 50%;
        background: var(--glare-color);
    }
    button {
        all: unset;
        background: white;
        cursor: pointer;
        position: absolute;
        top: 50%;
        right: env(safe-area-inset-right, 0);
        transform: translateY(-50%);
        z-index: 1000;
    }
    canvas {
        position: absolute;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100dvh;
    }
</style>
