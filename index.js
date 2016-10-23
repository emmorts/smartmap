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
    this._data = {};
    this._keys = {};
    this._debug = true;
  }
  
  SmartMap.prototype.add = function (object) {
    if (this.indices.length > 0) {
      var sealedObject = Object.seal(object);
      
      this.indices.forEach(function (index) {
        if (!(index in this._keys)) {
          this._keys[index] = {};
        }
        
        if (index in object) {
          var key = object[index];

          if (!this._data[index]) {
            this._data[index] = [];
          }

          this._data[index].push(sealedObject);
          this._keys[index][key] = sealedObject;
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
        return this._keys[index][key];
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
      var node = this._keys[index][key];
      var indexOfNode = this._data[index].indexOf(node);

      if (indexOfNode !== -1) {
        this._data[index].splice(indexOfNode, 1);
        
        delete this._keys[index][key];

        this.length--;
      }

      return node;
    }
    
    return undefined;
  }
  
  SmartMap.prototype.empty = function () {
    this._keys = {};
    this._data = {};
    this.length = 0;
  };
  
  SmartMap.prototype.forEach = function (fn, thisArg) {
    if (this.length) {
      var iterateBy = this.indices[0];

      this._data[iterateBy].forEach(fn, thisArg || this);
    }
  }
  
  SmartMap.prototype.find = function (predicate, thisArg) {
    if (this.length) {
      var iterateBy = this.indices[0];

      return this._data[iterateBy].find(predicate, thisArg || this);
    }
  }
  
  return SmartMap;
  
  function _warn(message) {
    if (this._debug) {
      console.warn(message);
    }
  }
});