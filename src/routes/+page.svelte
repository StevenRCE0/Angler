<script lang="ts">
    import {
        type Memory,
        type ActiveMemory,
        getActive,
    } from '$lib/memory';
    import { memoryStorage } from '$lib/storage';
    import { browser } from '$app/environment';
    import Seeds from './Seeds.svelte';

    $: seeds = Array<Memory>();
    $: open = false;

    let activeSeed: ActiveMemory;

    const loadDB = async () => {
        seeds = await memoryStorage.content.toArray();
        activeSeed = await getActive();
    };

    // load data when running on client
    if (browser) {
        loadDB();
    }

    let upperSignal: HTMLElement | null = null;
    let lowerSignal: HTMLElement | null = null;

    const automation = () => {
        const date = new Date();
        const seedUpper =
            activeSeed.seed +
            date.getDate() +
            Math.floor(date.getUTCMilliseconds() / 5000 / parseInt(activeSeed.seed.slice(0,2)));
        const seedNumber = parseInt(seedUpper, 16);
        const hue = seedNumber % 360;
        const saturation = 100 - (seedNumber % 20);
        const lightness = 50 - (seedNumber % 20);
        const colorStringUpper = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        // contrast colour
        const colorStringLower = `hsl(${
            hue + 80
        }, ${saturation}%, ${lightness}%)`;
        if (upperSignal && lowerSignal) {
            (upperSignal as HTMLElement).style.setProperty(
                '--upper-signal-color',
                colorStringUpper,
            );
            (lowerSignal as HTMLElement).style.setProperty(
                '--lower-signal-color',
                colorStringLower,
            );
        }
        
        requestAnimationFrame(automation);
    }

    $: {
        if (activeSeed) {
            if (browser) requestAnimationFrame(automation);
        } else {
            
        }
    }

</script>

<svelte:head>
    <title>Anglerfish</title>
    <meta name="description" content="Hello!" />
</svelte:head>

<div class="Container">
    <div class="UpperSignal" bind:this={upperSignal}></div>
    <div class="LowerSignal" bind:this={lowerSignal}></div>
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

<style>
    .Container {
        --glare-color: linear-gradient(
            180deg,
            hsla(132, 15%, 98%, 3%) 0%,
            hsla(192, 13%, 5%, 2%) 100%
        );
        position: relative;
        width: 100vw;
        height: 100dvh;
        overflow: hidden;
        --upper-signal-color: azure;
        --lower-signal-color: pink;
    }
    .UpperSignal {
        /* transition: background linear 0.2s; */
        position: absolute;
        top: 0;
        left: 0;
        width: 100vw;
        height: 50lvh;
        background: var(--upper-signal-color) var(--glare-color);
    }
    .LowerSignal {
        /* transition: background linear 0.2s; */
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100vw;
        height: 50lvh;
        background: var(--lower-signal-color) var(--glare-color);
    }
    button {
        all: unset;
        background: white;
        cursor: pointer;
        position: absolute;
        top: 50%;
        right: 6pt;
        transform: translateY(-50%);
        z-index: 1000;
    }
</style>
