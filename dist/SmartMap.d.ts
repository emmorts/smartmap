export declare class SmartMap<T> {
    #private;
    constructor(...indices: string[]);
    get indices(): string[];
    get length(): number;
    add(object: any): void;
    get(key: string | number, index: string): T | undefined;
    delete(key: string | number, index: string): any;
    clear(): void;
    forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any): void;
    find(predicate: (value: T, index: number, obj: T[]) => boolean, thisArg?: any): T | undefined;
    on(name: string, listener: (options?: any) => void): this;
    fire(name: string, options?: any): void;
}
