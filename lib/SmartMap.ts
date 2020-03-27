export type EventType = 'added' | 'deleted' | 'cleared';

export class SmartMap<T> implements Iterable<T> {
  #length: number = 0;
  #indices: (keyof T)[] = [];
  #data: { [key in keyof T]?: T[] } = {};
  #keys: {
    [key in (keyof T)]?: {
      [value: string]: T
    }
  } = {};

  #_eventHandlers: { [key: string]: ((options?: any) => void)[] } = {};
  #_iterateBy: keyof T;

  constructor(...indices: (keyof T)[]) {
    if (!indices || !indices.length) {
      throw new Error('Unable to initialize SmartMap, no indices provided.');
    }

    this.#indices.push(...indices);

    this.#_iterateBy = this.#indices[0];
  }

  [Symbol.iterator](): Iterator<T> {
    const indexedArray = this.#data[this.#_iterateBy] as T[];
    
    let iteratorCurrentIndex = 0;
    
    return {
      next() {
        iteratorCurrentIndex++;

        if (iteratorCurrentIndex - 1 < indexedArray.length) {
          return { value: indexedArray[iteratorCurrentIndex - 1], done: false };
        } else {
          return { value: null, done: true };
        }
      }
    };
  }

  get indices() {
    return this.#indices;
  }

  get length() {
    return this.#length;
  }

  iterateBy(index: keyof T) {
    if (this.#indices.indexOf(index) !== -1) {
      this.#_iterateBy = index;

      return this;
    }

    throw new Error(`Map is not indexed by '${index}'`);
  }

  add(...objects: T[]) {
    if (objects && objects.length) {
      objects.forEach(object => {
        const sealedObject = Object.seal(object);

        this.#indices.forEach(index => {
          if (!(index in this.#keys)) {
            this.#keys[index] = {};
          }

          if (index in object) {
            const key = object[index] as unknown as string;

            if (!this.#data[index]) {
              this.#data[index] = [];
            }

            this.getIndexedDataArray(index).push(sealedObject);
            this.getIndexedKeyDataArray(index)[key] = sealedObject;

            this.fire('added', object);
          } else {
            throw new Error(`Index ${index} doesn't exist in a given object.`);
          }
        });
      })
    } else {
      throw new Error(`Failed to add object`);
    }

    this.#length += objects.length;
  }

  contains(key: T[keyof T], index: keyof T = this.#indices[0]): boolean {
    return index in this.#keys && (key as unknown as string) in this.getIndexedKeyDataArray(index);
  }

  get(key: string | number, index: keyof T = this.#indices[0]): T | undefined {
    if (index in this.#keys) {
      const indexedKeyDataArray = this.getIndexedKeyDataArray(index);

      if (key in indexedKeyDataArray) {
        return indexedKeyDataArray[key];
      } else {
        return undefined;
      }
    } else {
      throw new Error(`Undefined index ${index}.`);
    }
  }

  delete(key: string | number, index: keyof T = this.#indices[0]) {
    const keys = this.#keys;
    
    if (index in this.#keys && key in this.#keys[index]) {
      const indexedDataArray = this.getIndexedDataArray(index);
      const indexedKeyDataArray = this.getIndexedKeyDataArray(index);

      const object = indexedKeyDataArray[key];
      const indexOfNode = indexedDataArray.indexOf(object);

      if (indexOfNode !== -1) {
        indexedDataArray.splice(indexOfNode, 1);
        
        delete indexedKeyDataArray[key];

        this.#length--;

        this.fire('deleted', object);
      }

      return object;
    }
    
    return undefined;
  }

  clear() {
    this.#keys = {};
    this.#data = {};
    this.#length = 0;

    this.fire('cleared');
  }

  on(name: EventType, listener: (options?: any) => void) {
    if (!(name in this.#_eventHandlers) || !(this.#_eventHandlers[name] instanceof Array)) {
      this.#_eventHandlers[name] = [];
    }
    this.#_eventHandlers[name].push(listener);

    return this;
  }

  fire(name: EventType, options?: any) {
    if (name in this.#_eventHandlers && this.#_eventHandlers[name].length > 0) {
      this.#_eventHandlers[name].forEach(handler => handler(options));
    }
  }

  private getIndexedDataArray(index: keyof T) {
    return this.#data[index] as T[];
  }

  private getIndexedKeyDataArray(index: keyof T) {
    return this.#keys[index] as { [value: string]: T };
  }
}