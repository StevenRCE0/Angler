import { memoryStorage } from './storage';

export type Memory = {
    seed: string;
    notation: string;
    creationDate: Date;
};

export type ActiveMemory = {
    seed: string;
    notation: string;
};

export async function activate(seed: string) {
    await memoryStorage.active.clear();
    const seedEntry = await memoryStorage.content.get(seed);
    await memoryStorage.active.add(seedEntry!);
}

export async function setSeed(seed: string, notation: string) {
    await memoryStorage.content.add({
        seed,
        notation,
        creationDate: new Date(),
    });
    await activate(seed);
}

export async function removeSeed(seed: string) {
    await memoryStorage.active.where('seed').equals(seed).delete();
    await memoryStorage.content.where('seed').equals(seed).delete();
}

export async function getActive(): Promise<ActiveMemory> {
    const active = await memoryStorage.active.toArray();
    if (active.length > 1) {
        console.error(
            'More than one active seed found. This should not happen.',
        );
    }
    
    return active[0];
}

export interface ImportingSeedType {
    seed: string;
    name: string | null;
}