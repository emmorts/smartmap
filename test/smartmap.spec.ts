import { SmartMap } from "../lib/SmartMap";
import { expect } from "chai";

describe('#SmartMap', () => {

  interface TestInterface {
    id: number,
    value: number
  };

  it('should initialize a new map with multiple indices', () => {
    const map = new SmartMap('foo', 'bar', 'baz');
    
    expect(map).to.be.ok;
    expect(map.indices.length).to.be.equal(3);
  });
  
  it('should add a new object to the map with multiple indices', () => {
    const map = new SmartMap('foo', 'bar');
    
    const expectedObject = {
      foo: 'foo val',
      bar: 'bar val'
    };
    map.add(expectedObject);
    
    const objectByFoo = map.get('foo val', 'foo');
    const objectByBar = map.get('bar val', 'bar');
    
    expect(map).to.be.ok;
    expect(map.length).to.be.equal(1);
    expect(expectedObject).to.be.equal(objectByFoo);
    expect(expectedObject).to.be.equal(objectByBar);
    expect(objectByBar === objectByFoo).to.be.true;
  });
  
  it('should add multiple objects to the map', () => {
    const map = new SmartMap('id');
    
    const expectedObjects = [1, 2, 3].map(function (num) {
      const obj = {
        id: num,
        value: num * num
      };
      map.add(obj);
      return obj;
    });
    
    expectedObjects.forEach(function (expectedObject) {
      const object = map.get(expectedObject.id, 'id');
      
      expect(object).to.be.equal(expectedObject);
    });
    
  });

  it('should clear map', () => {
    const map = new SmartMap('id');

    [1, 2, 3].forEach(num => map.add({
      id: num
    }));

    expect(map.length).to.be.eq(3);

    map.clear();

    expect(map.length).to.be.eq(0);
  });
  
  it('should remove an object from the map', () => {
    const map = new SmartMap('id');
    
    let object = null;
    const expectedObject = { id: 4, value: 6 };

    map.add(expectedObject);
    object = map.get(expectedObject.id, 'id');

    expect(object).to.be.equal(expectedObject);
    expect(map.length).to.be.equal(1);

    map.delete(expectedObject.id, 'id');
    object = map.get(expectedObject.id, 'id');

    expect(object).to.be.equal(undefined);
    expect(map.length).to.be.equal(0);
  });
  
  it('should remove an object from a map with multiple indices', () => {
    const map = new SmartMap('foo', 'bar');
    
    let object = null;
    const expectedObject = { foo: 'a', bar: 'b' };

    map.add(expectedObject);
    object = map.get(expectedObject.foo, 'foo');

    expect(object).to.be.equal(expectedObject);
    expect(map.length).to.be.equal(1);

    map.delete(expectedObject.foo, 'foo');
    object = map.get(expectedObject.foo, 'foo');

    expect(object).to.be.equal(undefined);
    expect(map.length).to.be.equal(0);
  });
  
  it('should iterate through the map', () => {
    const smartMap = new SmartMap<TestInterface>('id');
    const expectedObjects: TestInterface[] = [];

    [1, 2, 3].forEach(num => {
      const obj = {
        id: num,
        value: num * num
      };
      smartMap.add(obj);
      expectedObjects.push(obj);
    });
    
    smartMap.forEach(mapObject => {
      const expectedObject = expectedObjects.find(object => object.id === mapObject.id);
      
      expect(mapObject).to.be.equal(expectedObject);
    });
  });
  
  it('should map through the map', () => {
    const smartMap = new SmartMap<TestInterface>('id');
    const expectedObjects: TestInterface[] = [];

    [1, 2, 3].forEach(num => {
      const obj = {
        id: num,
        value: num * num
      };
      smartMap.add(obj);
      expectedObjects.push(obj);
    });
    
    const values = smartMap.map(object => object.value);

    expect(values).to.deep.eq([1, 4, 9]);
  });
  
  it('should iterate through the map with multiple indices', () => {
    const map = new SmartMap<TestInterface>('id', 'value');
    const expectedObjects: TestInterface[] = [];

    [1, 2, 3].forEach(num => {
      const obj = {
        id: num,
        value: num * num
      };
      map.add(obj);
      expectedObjects.push(obj);
    });
    
    map.forEach(mapObject => {
      const expectedObject = expectedObjects.find(object => object.id === mapObject.id);
      
      expect(mapObject).to.be.equal(expectedObject);
    });
  });
  
  it('should iterate through the map after removing an element', () => {
    const map = new SmartMap<TestInterface>('id');
    const expectedObjects: TestInterface[] = [];

    [1, 2, 3].forEach(num => {
      const obj = {
        id: num,
        value: num * num
      };
      map.add(obj);
      expectedObjects.push(obj);
    });

    map.delete(3, 'id');

    let iterationsCompleted = 0;

    map.forEach(mapObject => {
      const expectedObject = expectedObjects.find((object) => object.id === mapObject.id);

      expect(mapObject).to.be.equal(expectedObject);

      iterationsCompleted++;
    });

    expect(iterationsCompleted).to.be.equal(expectedObjects.length - 1);
  });
  
  it('should find an object in the map', () => {
    const map = new SmartMap<TestInterface>('id');
    const expectedObjects: TestInterface[] = [];

    [1, 2, 3].forEach(num => {
      const obj = {
        id: num,
        value: num * num
      };
      map.add(obj);
      expectedObjects.push(obj);
    });
    
    const foundObject = map.find(mapObject => mapObject.id === expectedObjects[0].id);
    
    expect(expectedObjects[0]).to.be.equal(foundObject);
  });

});