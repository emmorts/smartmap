"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var _indices, _length, _data, _keys, _eventHandlers, _debug;
Object.defineProperty(exports, "__esModule", { value: true });
class SmartMap {
    constructor(...indices) {
        _indices.set(this, []);
        _length.set(this, 0);
        _data.set(this, {});
        _keys.set(this, {});
        _eventHandlers.set(this, {});
        _debug.set(this, false);
        if (!indices || !indices.length) {
            throw new Error('Unable to initialize SmartMap, no indices provided.');
        }
        __classPrivateFieldGet(this, _indices).push(...indices);
    }
    get indices() {
        return __classPrivateFieldGet(this, _indices);
    }
    get length() {
        return __classPrivateFieldGet(this, _length);
    }
    add(object) {
        const sealedObject = Object.seal(object);
        __classPrivateFieldGet(this, _indices).forEach(index => {
            if (!(index in __classPrivateFieldGet(this, _keys))) {
                __classPrivateFieldGet(this, _keys)[index] = {};
            }
            if (index in object) {
                const key = object[index];
                if (!__classPrivateFieldGet(this, _data)[index]) {
                    __classPrivateFieldGet(this, _data)[index] = [];
                }
                __classPrivateFieldGet(this, _data)[index].push(sealedObject);
                __classPrivateFieldGet(this, _keys)[index][key] = sealedObject;
                this.fire('added', object);
            }
            else {
                throw new Error(`Index ${index} doesn't exist in given object.`);
            }
        });
        __classPrivateFieldSet(this, _length, +__classPrivateFieldGet(this, _length) + 1);
    }
    get(key, index) {
        if (index in __classPrivateFieldGet(this, _keys)) {
            if (key in __classPrivateFieldGet(this, _keys)[index]) {
                return __classPrivateFieldGet(this, _keys)[index][key];
            }
            else {
                return undefined;
            }
        }
        else {
            throw new Error(`Undefined index ${index}.`);
        }
    }
    delete(key, index) {
        if (index in __classPrivateFieldGet(this, _keys) && key in __classPrivateFieldGet(this, _keys)[index]) {
            const node = __classPrivateFieldGet(this, _keys)[index][key];
            const indexOfNode = __classPrivateFieldGet(this, _data)[index].indexOf(node);
            if (indexOfNode !== -1) {
                __classPrivateFieldGet(this, _data)[index].splice(indexOfNode, 1);
                delete __classPrivateFieldGet(this, _keys)[index][key];
                __classPrivateFieldSet(this, _length, +__classPrivateFieldGet(this, _length) - 1);
                this.fire('deleted', node);
            }
            return node;
        }
        return undefined;
    }
    clear() {
        __classPrivateFieldSet(this, _keys, {});
        __classPrivateFieldSet(this, _data, {});
        __classPrivateFieldSet(this, _length, 0);
        this.fire('cleared');
    }
    forEach(callbackfn, thisArg) {
        if (__classPrivateFieldGet(this, _length)) {
            const iterateBy = __classPrivateFieldGet(this, _indices)[0];
            __classPrivateFieldGet(this, _data)[iterateBy].forEach(callbackfn, thisArg || this);
        }
    }
    find(predicate, thisArg) {
        if (__classPrivateFieldGet(this, _length)) {
            var iterateBy = __classPrivateFieldGet(this, _indices)[0];
            return __classPrivateFieldGet(this, _data)[iterateBy].find(predicate, thisArg || this);
        }
        return undefined;
    }
    on(name, listener) {
        if (!(name in __classPrivateFieldGet(this, _eventHandlers)) || !(__classPrivateFieldGet(this, _eventHandlers)[name] instanceof Array)) {
            __classPrivateFieldGet(this, _eventHandlers)[name] = [];
        }
        __classPrivateFieldGet(this, _eventHandlers)[name].push(listener);
        return this;
    }
    fire(name, options) {
        if (name in __classPrivateFieldGet(this, _eventHandlers) && __classPrivateFieldGet(this, _eventHandlers)[name].length > 0) {
            __classPrivateFieldGet(this, _eventHandlers)[name].forEach(handler => handler(options));
        }
    }
}
exports.SmartMap = SmartMap;
_indices = new WeakMap(), _length = new WeakMap(), _data = new WeakMap(), _keys = new WeakMap(), _eventHandlers = new WeakMap(), _debug = new WeakMap();
