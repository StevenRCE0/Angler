import { MurmurHash3_x86_128 } from './murmurhash3_128';

type PairsCache = {
    raw: string | null;
    upper: string | null;
    lower: string | null;
};

export class Hasher {
    ctx: CanvasRenderingContext2D | null = null;
    canvas: HTMLCanvasElement;
    seed: string;

    constructor(canvas: HTMLCanvasElement, seed: string) {
        this.canvas = canvas;
        this.seed = seed;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            this.ctx = ctx;
            this.automation();
        }
    }

    static leastPeriod(x: number): number {
        let res = x.toString();
        let a = 1;
        let b = 1;
        for (let i = 0; i < res.length; i++) {
            const l = parseInt(res[i]);
            const r = parseInt(res[res.length - 1 - i]);
            
            if (a === 1 && l > 1) {
                a = l;
            }
            if (b === 1 && r > 1) {
                b = r;
            }
        }

        return (a << 8) + (b << 8);
    }

    static pairsCache: PairsCache = {
        raw: null,
        upper: null,
        lower: null,
    };

    static seeding(seed: string, shortCurcuit: () => void): number[][] | null {
        const date = new Date();
        const dateString = Math.floor(
            date.getTime() /
                Hasher.leastPeriod(
                    parseInt(seed.slice(0, 2), 16)
                ),
        ).toString();

        const priorSeed =
            dateString + seed + Math.floor(date.getTime() / 10000);

        if (Hasher.pairsCache.raw === priorSeed) {    
            shortCurcuit();
            return null;
        }

        Hasher.pairsCache.raw = priorSeed;

        const seedUpper = MurmurHash3_x86_128(priorSeed, parseInt(seed.slice(undefined, 4), 16));
        const seedLower = MurmurHash3_x86_128(
            Array.from(priorSeed).reverse().join(''),
            parseInt(seed.slice(4), 16),
        );

        return [seedUpper, seedLower];
    }

    static colorMapper(finalSeeds: number[][]): string[] {
        const hueU = finalSeeds[0][1] % 360;
        const saturationU = 100 - (finalSeeds[0][2] % 20);
        const lightnessU = 50 - (finalSeeds[0][3] % 20);
        const hueL = finalSeeds[1][1] % 360;
        const saturationL = 100 - (finalSeeds[1][2] % 20);
        const lightnessL = 50 - (finalSeeds[1][3] % 20);
        const upperColorString = `hsl(${hueU}, ${saturationU}%, ${lightnessU}%)`;
        // contrast colour
        const lowerColorString = `hsl(${
            hueL + 80
        }, ${saturationL}%, ${lightnessL}%)`;

        return [upperColorString, lowerColorString];
    }

    draw = (upperColorString: string, lowerColorString: string) => {
        if (!this.ctx || !this.canvas) return;
        this.ctx.fillStyle = upperColorString;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height / 2);
        this.ctx.fillStyle = lowerColorString;
        this.ctx.fillRect(
            0,
            this.canvas.height / 2,
            this.canvas.width,
            this.canvas.height / 2,
        );
    };

    automation = () => {
        if (!this.ctx || !this.canvas) return;

        // ensure size to canvas element bounds
        this.canvas.width = this.canvas.clientWidth * devicePixelRatio;
        this.canvas.height = this.canvas.clientHeight * devicePixelRatio;

        const finalSeeds = Hasher.seeding(this.seed, () => {
            this.draw(Hasher.pairsCache.upper!, Hasher.pairsCache.lower!);
            requestAnimationFrame(this.automation);
            return;
        });

        if (!finalSeeds) return;

        const colors = Hasher.colorMapper(finalSeeds);

        Hasher.pairsCache.upper = colors[0];
        Hasher.pairsCache.lower = colors[1];

        this.draw(colors[0], colors[1]);

        requestAnimationFrame(this.automation);
    };

    hash() {
        let hash = 0;
        for (let i = 0; i < this.seed.length; i++) {
            hash = (hash << 5) - hash + this.seed.charCodeAt(i);
            hash |= 0;
        }
        return hash;
    }
}
