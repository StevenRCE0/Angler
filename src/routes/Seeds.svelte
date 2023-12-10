<script lang="ts">
    import {
        removeSeed,
        setSeed,
        activate,
        type Memory,
        type ActiveMemory,
    } from '$lib/memory';
    import Field from '../components/Field.svelte';

    export let refresh: () => void;
    export let seeds: Array<Memory>;
    export let activeSeed: ActiveMemory;

    $: newSeed = '';
    $: newName = '';

    async function plantSeed() {
        await setSeed(newSeed, newName);
        newSeed = '';
        newName = '';
        refresh();
    }

    function randomSeed(): string {
        const chars = '0123456789abcdef';
        let result = '';
        for (let i = 0; i < 8; i++) {
            result += chars[Math.floor(Math.random() * chars.length)];
        }
        return result;
    }

    $: {
        if (newSeed.length > 8) {
            newSeed = newSeed.slice(0, 8);
        }
    }

    $: okToAdd =
        newSeed.length === 8 &&
        seeds.map((x) => x.seed).indexOf(newSeed) === -1;
</script>

<div class="Menu">
    {#if seeds.length > 0}
        <h3>Select your seed</h3>
        {#each seeds as seed}
            <div>
                {#if activeSeed && activeSeed.seed === seed.seed}
                    {seed.notation.length > 0 ? seed.notation : seed.seed}
                {:else}
                    <button
                        class="Activate"
                        on:click={() => {
                            activate(seed.seed).then(() => refresh());
                        }}
                    >
                        {seed.notation.length > 0 ? seed.notation : seed.seed}
                    </button>
                {/if}
                <button
                    class="Rm"
                    on:click={() => {
                        removeSeed(seed.seed).then(() => refresh());
                    }}
                >
                    [rm]
                </button>
            </div>
        {/each}
        <br />
    {/if}
    <h2>Plant a seed</h2>
    <div style="max-width: 144pt;">
        <Field placeholder="seed?" bind:value={newSeed} />
    </div>
    <div style="max-width: 288pt">
        <Field placeholder="name?" bind:value={newName} />
    </div>
    <button on:click={() => (newSeed = randomSeed())}>[rand]</button>
    &nbsp;
    <button
        type="submit"
        disabled={!okToAdd}
        on:click={plantSeed}
        style={okToAdd ? '' : 'cursor: not-allowed; opacity: 0.5;'}
    >
        [plant]
    </button>
</div>

<style>
    .Menu {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 6pt;
        max-height: 70dvh;
        border: 3pt double rgba(0, 0, 0, 0.35);
        background: white;
    }
    .Rm {
        color: red;
        text-decoration: underline;
        cursor: pointer;
    }
    .Activate {
        color: #00f;
        text-decoration: underline;
    }
    button {
        all: unset;
        cursor: pointer;
    }
</style>
