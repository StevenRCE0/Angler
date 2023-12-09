import Dexie, { type Table } from 'dexie';
import type { Memory } from './memory';

class MemoryDatabase extends Dexie {
    content!: Table<Memory>;

    constructor() {
        super('memory.db');
        this.version(1).stores({ content: '&seed, notation, creationDate' });
    }
}

export const memoryStorage = new MemoryDatabase();
