import Dexie, { type Table } from 'dexie';
import type { Memory, ActiveMemory } from './memory';

class MemoryDatabase extends Dexie {
    content!: Table<Memory>;
    active!: Table<ActiveMemory>;

    constructor() {
        super('memory.db');
        this.version(1).stores({
            content: '&seed, notation, creationDate',
            active: '&seed, notation',
        });
    }
}

export const memoryStorage = new MemoryDatabase();
