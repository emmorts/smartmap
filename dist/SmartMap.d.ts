export declare type EventType = 'added' | 'deleted' | 'cleared';
export declare class SmartMap<T> implements Iterable<T> {
    #private;
    constructor(...indices: string[]);
    [Symbol.iterator](): Iterator<T>;
    get indices(): string[];
    get length(): number;
    iterateBy(index: string): Iterator<T, any, undefined>;
    add(object: any): void;
    get(key: string | number, index: string): T | undefined;
    delete(key: string | number, index: string): any;
    clear(): void;
    on(name: EventType, listener: (options?: any) => void): this;
    fire(name: EventType, options?: any): void;
}
