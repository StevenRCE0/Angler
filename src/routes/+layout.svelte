<script>
    import { onMount } from 'svelte';
    import { pwaInfo } from 'virtual:pwa-info';
    import './reset.css';

    onMount(async () => {
        if (pwaInfo) {
            const { registerSW } = await import('virtual:pwa-register');
            registerSW({
                immediate: true,
                onRegisterError(error) {
                    console.log('SW registration error', error);
                },
            });
        }
    });

    $: webManifest = pwaInfo ? pwaInfo.webManifest.linkTag : '';
</script>

<svelte:head>
    {@html webManifest}
    <meta name="theme-color" content="#e3e3e3" />
    <link rel="icon" href="/favicon.ico" sizes="any" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="apple-touch-icon" href="/apple-touch-icon-180x180.png" />
</svelte:head>

<main>
    <slot />
</main>
