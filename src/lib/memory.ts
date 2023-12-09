import { memoryStorage } from './storage';

export type Memory = {
    seed: string;
    notation: string;
    creationDate: Date;
};

export async function setSeed(seed: string, notation: string) {
    await memoryStorage.content.add({
        seed,
        notation,
        creationDate: new Date(),
    });
}

export async function removeSeed(seed: string) {
    await memoryStorage.content.where('seed').equals(seed).delete();
}
