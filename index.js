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
    this._head = {};
    this._tail = {};
    this._position = {};
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
            this._head[index] = this._tail[index] = node;
            node.p = node.n = undefined;
            this.reset();
          } else {
            node.p = this._tail[index];
            node.n = undefined;
            this._tail[index].n = node;
            this._tail[index] = node;
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

        this._keys[index][key] = undefined;
        this.length--;
        
        delete this._keys[index][key];
      }

      return object;
    }
    
    return undefined;
  }
  
  SmartMap.prototype.reset = function () {
    this._position = this.indices.reduce(function (pos, index) {
      if (index in this._head) {
        pos[index] = { n: this._head[index] };
      } else {
        pos[index] = { n : undefined };
      }
      return pos;
    }.bind(this), {});
  }
  
  SmartMap.prototype.empty = function () {
    this._keys = {};
    this._head = this._tail = {};
    this.length = 0;
    this.reset();
  };
  
  SmartMap.prototype.forEach = function (fn, thisArg) {
    var tmp, index = 0;
    
    if (this.length) {
      var iterateBy = this.indices[0];
      while (tmp = _next.call(this, iterateBy)) {
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
      var iterateBy = this.indices[0];
      while (tmp = _next.call(this, iterateBy)) {
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
  
  function _next(index) {
    return this._position[index] = this._position[index].n;
  }
  
  function _warn(message) {
    if (this._debug) {
      console.warn(message);
    }
  }
});