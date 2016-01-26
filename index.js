(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.Immutable = factory());
})(this, function () {
  var SmartMap = function () {
    if (arguments.length === 0) {
      _warn("Unable to initialize SmartMap, no indices provided.");
      return;
    }
    this.indices = Array.prototype.slice.call(arguments);
    this.length = 0;
    this._head = null;
    this._tail = null;
    this._position = null;
    this._keys = {};
    this._debug = true;
  }
  
  SmartMap.prototype.add = function (object) {
    if (this.indices.length > 0) {
      var node = { v: Object.seal(object) };
      
      this.indices.forEach(function (index) {
        if (!(index in this._keys)) {
          this._keys[index] = {};
        }
        
        if (index in object) {
          var key = object[index];
          
          if (this.length === 0) {
            this._head = this._tail = node;
            this.reset();
          } else {
            node.p = this._tail;
            this._tail.n = node;
            this._tail = node;
          }
          
          this._keys[index][key] = node;
          
        } else {
          _warn("Index `" + index + "` doesn't exist in given object.");
        }
      }.bind(this));
      
      this.length++;
    }
  }
  
  SmartMap.prototype.get = function (key, index) {
    if (index in this._keys) {
      if (key in this._keys[index]) {
        return this._keys[index][key].v;
      } else {
        _warn("Undefined key `" + key + "` in index `" + index + "`.");
      }
    } else {
      _warn("Undefined index `" + index + "`.");
    }
    
    return undefined;
  }
  
  SmartMap.prototype.delete = function (key, index) {
    if (index in this._keys && key in this._keys[index]) {
      var object;
      var node = this._keys[index][key];

      if (node) {
        object = node.v;

        if (node.p) node.p.n = node.n;
        if (node.n) node.n.p = node.p;

        this._keys[index][key] = null;
        this.length--;
      }

      return object;
    }
    
    return undefined;
  }
  
  SmartMap.prototype.reset = function () {
    this._position = { n: this._head };
  }
  
  SmartMap.prototype.empty = function () {
    this._keys = {};
    this._head = this._tail = this._position = null;
    this.length = 0;
  };
  
  SmartMap.prototype.forEach = function (fn, thisArg) {
    var tmp, index = 0;
    
    if (this.length) {
      while (tmp = _next.call(this)) {
        if (thisArg) {
          fn.call(thisArg, tmp.v, index);
        } else {
          fn(tmp.v, index);
        }
        index++;
      }
      
      this.reset();
    }
  }
  
  SmartMap.prototype.find = function (predicate, thisArg) {
    var tmp, result;
    
    if (this.length) {
      while (tmp = _next.call(this)) {
        var passes = thisArg ? predicate.call(this, tmp.v) : predicate(tmp.v);
        if (passes) {
          result = tmp.v;
          this.reset();
          break;
        }
      }
    }
    
    return result;
  }
  
  return SmartMap;
  
  function _validateObject(object) {
    var validatedProperties = 0;
    for (var property in object) {
      if (~this.indices.indexOf(property)) validatedProperties++;
    }
    return validatedProperties === this.indices.length;
  }
  
  function _next() {
    return this._position = this._position.n;
  }
  
  function _warn(message) {
    if (this._debug) {
      console.warn(message);
    }
  }
});