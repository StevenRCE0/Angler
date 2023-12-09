<script lang="ts">

    export let plantSeed: (seed: string, name: string) => void;

    $: newSeed = '';
    $: newName = '';

    const handlePlant = () => {
        plantSeed(newSeed, newName);
        newSeed = '';
        newName = '';
    };

</script>

<div class="Menu">
    <h1>Plant a seed</h1>
    <input
        type="text"
        placeholder="Seed"
        contenteditable
        bind:value={newSeed}
    />
    <input
        type="text"
        placeholder="Name?"
        contenteditable
        bind:value={newName}
    />
    <button on:click={() => handlePlant()}>
        Plant
    </button>
</div>

<style>
    .Menu {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
</style>
