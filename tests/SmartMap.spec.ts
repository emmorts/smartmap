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

  it('should test whether map conntains an element', () => {
    const smartMap = new SmartMap<TestInterface>('id');

    [1, 2, 3].forEach(num => smartMap.add({
      id: num,
      value: num ** 2
    }));

    expect(smartMap.contains(0)).to.be.false;
    expect(smartMap.contains(1)).to.be.true;
  });

  it('should fire \'added\' event on element add', () => {
    const smartMap = new SmartMap<TestInterface>('id');
    
    const array = [1, 2, 3];
    let eventsFired = 0;

    smartMap.on("added", (element: TestInterface) => {
      expect(element.id).eq(array[eventsFired]);
      expect(element.value).eq(array[eventsFired] ** 2);
      
      eventsFired++;
    });

    array.forEach(num => smartMap.add({
      id: num,
      value: num ** 2
    }));

    expect(eventsFired).to.be.eq(3);
  });

  it('should fire \'deleted\' event on element removal', () => {
    const smartMap = new SmartMap<TestInterface>('id');
    
    const array = [1, 2, 3];
    let eventsFired = 0;

    smartMap.on("deleted", (element: TestInterface) => {
      expect(element.id).eq(array[eventsFired]);
      expect(element.value).eq(array[eventsFired] ** 2);
      
      eventsFired++;
    });

    array.forEach(num => smartMap.add({
      id: num,
      value: num ** 2
    }));
    
    smartMap.delete(1);
    smartMap.delete(2);

    expect(eventsFired).to.be.eq(2);
  });

  it('should fire \'deleted\' event on element removal', () => {
    const smartMap = new SmartMap<TestInterface>('id');
    
    let eventFired = false;

    smartMap.on("cleared", () => {
      eventFired = true;
    });

    [1, 2, 3].forEach(num => smartMap.add({
      id: num,
      value: num ** 2
    }));
    
    smartMap.clear();

    expect(eventFired).to.be.true;
  });
  
  it('should iterate through the map', () => {
    const smartMap = new SmartMap<TestInterface>('id');

    const array = [1, 2, 3];

    array.forEach(num => smartMap.add({
      id: num,
      value: num ** 2
    }));
    
    let iterator = 0;
    for (const mapObject of smartMap) {
      const { id, value } = mapObject

      expect(id).to.eq(array[iterator]);
      expect(value).to.be.equal(array[iterator] ** 2);

      iterator++;
    };
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

    for (const mapObject of map.iterateBy('id')) {
      const expectedObject = expectedObjects.find(object => object.id === mapObject.id);
      
      expect(mapObject).to.be.equal(expectedObject);
    }

    for (const mapObject of map.iterateBy('value')) {
      const expectedObject = expectedObjects.find(object => object.id === mapObject.id);
      
      expect(mapObject).to.be.equal(expectedObject);
    }
  });
  
  it('should iterate through the map after removing an element', () => {
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

    smartMap.delete(3, 'id');

    let iterationsCompleted = 0;

    for (const mapObject of smartMap) {
      const expectedObject = expectedObjects.find((object) => object.id === mapObject.id);

      expect(mapObject).to.be.equal(expectedObject);

      iterationsCompleted++;
    }

    expect(iterationsCompleted).to.be.equal(expectedObjects.length - 1);
  });

});