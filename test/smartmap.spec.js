var SmartMap = require('../index');
var expect = require('chai').expect;

describe('#SmartMap', function () {

  it('should initialize a new map with multiple indices', function () {
    var map = new SmartMap('foo', 'bar', 'baz');
    
    expect(map).to.be.ok;
    expect(map.indices.length).to.be.equal(3);
  });
  
  it('should add a new object to the map with multiple indices', function () {
    var map = new SmartMap('foo', 'bar');
    
    var expectedObject = {
      foo: 'foo val',
      bar: 'bar val'
    };
    map.add(expectedObject);
    
    var objectByFoo = map.get('foo val', 'foo');
    var objectByBar = map.get('bar val', 'bar');
    
    expect(map).to.be.ok;
    expect(map.length).to.be.equal(1);
    expect(expectedObject).to.be.equal(objectByFoo);
    expect(expectedObject).to.be.equal(objectByBar);
    expect(objectByBar === objectByFoo).to.be.true;
  });
  
  it('should add multiple objects to the map', function () {
    var map = new SmartMap('id');
    
    var expectedObjects = [1, 2, 3].map(function (num) {
      var obj = {
        id: num,
        value: num * num
      };
      map.add(obj);
      return obj;
    });
    
    expectedObjects.forEach(function (expectedObject) {
      var object = map.get(expectedObject.id, 'id');
      
      expect(object).to.be.equal(expectedObject);
    });
    
  });
  
  it('should iterate through the map', function () {
    var map = new SmartMap('id');
    
    var expectedObjects = [1, 2, 3].map(function (num) {
      var obj = {
        id: num,
        value: num * num
      };
      map.add(obj);
      return obj;
    });
    
    map.forEach(function (mapObject) {
      var expectedObject = expectedObjects.find(function (object) {
        return object.id === mapObject.id
      })
      
      expect(mapObject).to.be.equal(expectedObject);
    });
  });
  
  it('should iterate through the map with multiple indices', function () {
    var map = new SmartMap('id', 'value');
    
    var expectedObjects = [1, 2, 3].map(function (num) {
      var obj = {
        id: num,
        value: num * num
      };
      map.add(obj);
      return obj;
    });
    
    map.forEach(function (mapObject) {
      var expectedObject = expectedObjects.find(function (object) {
        return object.id === mapObject.id
      })
      
      expect(mapObject).to.be.equal(expectedObject);
    });
  });
  
  it('should find an object in the map', function () {
    var map = new SmartMap('id');
    
    var expectedObjects = [1, 2, 3].map(function (num) {
      var obj = {
        id: num,
        value: num * num
      };
      map.add(obj);
      return obj;
    });
    
    var foundObject = map.find(function (mapObject) {
      return mapObject.id === expectedObjects[0].id;
    });
    
    expect(expectedObjects[0]).to.be.equal(foundObject);
  });

});