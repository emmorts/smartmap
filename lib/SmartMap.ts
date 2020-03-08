export type EventType = 'added' | 'deleted' | 'cleared';

export class SmartMap<T> {
  #indices: string[] = [];
  #length: number = 0;
  #data: { [key: string]: T[] } = {};
  #keys: any = {};
  #eventHandlers: { [key: string]: ((options?: any) => void)[] } = {};

  constructor(...indices: string[]) {
    if (!indices || !indices.length) {
      throw new Error('Unable to initialize SmartMap, no indices provided.');
    }

    this.#indices.push(...indices);
  }

  get indices() {
    return this.#indices;
  }

  get length() {
    return this.#length;
  }

  add(object: any) {
    const sealedObject = Object.seal(object);

    this.#indices.forEach(index => {
      if (!(index in this.#keys)) {
        this.#keys[index] = {};
      }

      if (index in object) {
        const key = object[index];

        if (!this.#data[index]) {
          this.#data[index] = [];
        }

        this.#data[index].push(sealedObject);
        this.#keys[index][key] = sealedObject;

        this.fire('added', object);
      } else {
        throw new Error(`Index ${index} doesn't exist in given object.`);
      }
    });

    this.#length++;
  }

  get(key: string | number, index: string): T | undefined {
    if (index in this.#keys) {
      if (key in this.#keys[index]) {
        return this.#keys[index][key];
      } else {
        return undefined;
      }
    } else {
      throw new Error(`Undefined index ${index}.`);
    }
  }

  delete(key: string | number, index: string) {
    if (index in this.#keys && key in this.#keys[index]) {
      const node = this.#keys[index][key];
      const indexOfNode = this.#data[index].indexOf(node);

      if (indexOfNode !== -1) {
        this.#data[index].splice(indexOfNode, 1);
        
        delete this.#keys[index][key];

        this.#length--;

        this.fire('deleted', node);
      }

      return node;
    }
    
    return undefined;
  }

  clear() {
    this.#keys = {};
    this.#data = {};
    this.#length = 0;

    this.fire('cleared');
  }

  forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any) {
    if (this.#length) {
      const iterateBy = this.#indices[0];

      this.#data[iterateBy].forEach(callbackfn, thisArg || this);
    }
  }

  find(predicate: (value: T, index: number, obj: T[]) => boolean, thisArg?: any): T | undefined {
    if (this.#length) {
      const iterateBy = this.#indices[0];

      return this.#data[iterateBy].find(predicate, thisArg || this);
    }

    return undefined;
  }

  map(callbackfn: (value: T, index: number, array: T[]) => any, thisArg?: any): any[] {
    if (this.#length) {
      const iterateBy = this.#indices[0];

      return this.#data[iterateBy].map(callbackfn, thisArg || this);
    }

    return [];
  }

  on(name: EventType, listener: (options?: any) => void) {
    if (!(name in this.#eventHandlers) || !(this.#eventHandlers[name] instanceof Array)) {
      this.#eventHandlers[name] = [];
    }
    this.#eventHandlers[name].push(listener);

    return this;
  }

  fire(name: EventType, options?: any) {
    if (name in this.#eventHandlers && this.#eventHandlers[name].length > 0) {
      this.#eventHandlers[name].forEach(handler => handler(options));
    }
  }
}