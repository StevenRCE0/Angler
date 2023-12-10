<script lang="ts">
    import { browser } from '$app/environment';
    import { goto } from '$app/navigation';
    import { setSeed } from '$lib/memory';
    import { memoryStorage } from '$lib/storage';
    import Field from '../../components/Field.svelte';

    export let data;
    let unique: boolean | null = null;

    if (browser) {
        memoryStorage.content.toArray().then((x) => {
            x.find((y) => y.seed === data.seed) === undefined
                ? (unique = true)
                : (unique = false);
        });
    }

    $: newName = '';
    function plantSeed() {
        setSeed(data.seed, newName);
        goto('/');
    }
</script>

{#if browser}
    <div class="Menu">
        <h3>{data.seed}</h3>
        {#if unique}
            <h2>Give this seed a name</h2>
            <div style="max-width: 288pt">
                <Field bind:value={newName} placeholder="name?" />
            </div>
            <button
                on:click={plantSeed}
                disabled={!unique}
                style={unique ? '' : 'cursor: not-allowed; opacity: 0.5;'}
            >
                [plant]
            </button>
        {:else}
            <h2>This seed is already planted</h2>
        {/if}
        <button on:click={() => goto('/')}>[cancel]</button>
    </div>
{/if}

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
    button {
        all: unset;
        cursor: pointer;
    }
</style>
