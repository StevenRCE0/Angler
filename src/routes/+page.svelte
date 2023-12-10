<script lang="ts">
    import { type Memory, type ActiveMemory, getActive } from '$lib/memory';
    import { memoryStorage } from '$lib/storage';
    import { browser } from '$app/environment';
    import Seeds from './Seeds.svelte';
    import { MurmurHash3_x86_128 } from '$lib/murmurhash3_128';

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

    function leastPeriod(x: number): number {
        let res = x.toString();
        let a = 0;
        let b = 0;
        for (let i = 0; i < res.length; i++) {
            if (a === 0 && res[i] !== '0') {
                a = parseInt(res[i]);
            }
            if (b === 0 && res[res.length - 1 - i] !== '0') {
                b = parseInt(res[res.length - 1 - i]);
            }
        }

        return a === 0 ? 4200 : (a << 6) + (b << 7);
    }

    type PairsCache = {
        raw: string | null;
    };

    let pairsCache: PairsCache = {
        raw: null,
    };

    const automation = () => {
        const date = new Date();
        const dateString = Math.floor(
            date.getUTCMilliseconds() /
                leastPeriod(
                    parseInt(activeSeed.seed.slice(0, 2), 16) *
                        Math.floor(date.getUTCMilliseconds() / 200),
                ),
        ).toString();

        const priorSeed = dateString + activeSeed.seed + Math.floor(date.getUTCMilliseconds() / 10000);
        if (pairsCache.raw === priorSeed) {
            requestAnimationFrame(automation);

            return;
        }
        const seedUpper = MurmurHash3_x86_128(
            priorSeed,
            parseInt(activeSeed.seed, 16),
        );
        const seedLower = MurmurHash3_x86_128(
            Array.from(priorSeed).reverse().join(''),
            parseInt(activeSeed.seed.slice(4), 16),
        );

        const hueU = seedUpper[1] % 360;
        const saturationU = 100 - (seedUpper[2] % 20);
        const lightnessU = 50 - (seedUpper[3] % 20);
        const hueL = seedLower[1] % 360;
        const saturationL = 100 - (seedLower[2] % 20);
        const lightnessL = 50 - (seedLower[3] % 20);
        const colorStringUpper = `hsl(${hueU}, ${saturationU}%, ${lightnessU}%)`;
        // contrast colour
        const colorStringLower = `hsl(${
            hueL + 80
        }, ${saturationL}%, ${lightnessL}%)`;
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

        pairsCache.raw = priorSeed;

        requestAnimationFrame(automation);
    };

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
