<script lang="ts">
    import { browser } from '$app/environment';

    export let value: string;
    export let placeholder: string | undefined;

    let canvas: HTMLCanvasElement | undefined;
    let resizeObserver: ResizeObserver | undefined;

    const devicePixelRatio = browser ? window.devicePixelRatio : 1;
    const boxPxPointRatio = 0.01;
    const padding = 6;
    const getRandomHeights = (length: number) =>
        Array.from({ length }, () => Math.random());

    let heights = Array<number>();
    let ctx: CanvasRenderingContext2D | null = null;

    const draw = (ctx: CanvasRenderingContext2D) => {
        if (!canvas) {
            return;
        }
        canvas.width = canvas.clientWidth * devicePixelRatio;
        canvas.height = canvas.clientHeight * devicePixelRatio;

        const targetHeightLength = Math.floor(canvas.width * boxPxPointRatio);
        if (targetHeightLength > heights.length) {
            heights = getRandomHeights(targetHeightLength);
        } else if (targetHeightLength < heights.length) {
            heights = heights.slice(0, targetHeightLength);
        }

        const bounds = {
            left: padding,
            right: canvas.width - padding,
            top: padding,
            bottom: canvas.height - padding,
            width: canvas.width - 2 * padding,
            height: canvas.height - 2 * padding,
        };
        const sectionWidth = bounds.width / (targetHeightLength - 1);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#000000';
        ctx.lineCap = 'round';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(bounds.left, bounds.top + heights[0] * bounds.height);
        for (let i = 1; i < targetHeightLength; i++) {
            const options = {
                cp1x: (i - 0.6) * sectionWidth + bounds.left,
                cp1y: heights[i - 1] * bounds.height + bounds.top,
                cp2x: (i - 0.4) * sectionWidth + bounds.left,
                cp2y: heights[i] * bounds.height + bounds.top,
                x: i * sectionWidth + bounds.left,
                y: heights[i] * bounds.height + bounds.top,
            };
            ctx.bezierCurveTo(
                options.cp1x,
                options.cp1y,
                options.cp2x,
                options.cp2y,
                options.x,
                options.y,
            );
        }
        ctx.stroke();
    };

    function registerResizeObserver() {
        if (browser && canvas && ctx && resizeObserver === undefined) {
            resizeObserver = new ResizeObserver(() => {
                draw(ctx!);
            });
            resizeObserver.observe(canvas);
        }
    }
    function freeResizeObserver() {
        if (resizeObserver) {
            console.log('freeing resize observer');

            resizeObserver.disconnect();
            resizeObserver = undefined;
        }
    }
    $: {
        ctx = canvas === undefined ? null : ctx ?? canvas.getContext('2d');
        registerResizeObserver();
        if (ctx) {
            draw(ctx);
        }
    }
    $: {
        if (!open && resizeObserver) {
            console.log('freeing resize observer');
            freeResizeObserver();
        }
    }
</script>

<div class="InputBlock">
    <input type="text" {placeholder} contenteditable bind:value />
    <canvas bind:this={canvas} on:stalled={freeResizeObserver} />
</div>

<style>
    input {
        all: unset;
        width: calc(100% - 1em);
        height: 1em;
        padding: 0 0.5em;
    }
    canvas {
        width: 100%;
        height: 10px;
        margin-top: -5px;
    }
    .InputBlock {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        font-size: 18pt;
        width: 100%;
        margin: 0.5em 0;
    }
</style>
