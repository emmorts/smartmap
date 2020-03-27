# SmartMap

SmartMap is a simple and efficient indexed map for Node and browser environments.

[![Build Status](https://travis-ci.org/emmorts/smartmap.svg?branch=master)](https://travis-ci.org/emmorts/smartmap)

## Installation

You may install the package via:

-   npm `npm install smartmap`
-   git `git clone https://github.com/emmorts/smartmap`

Documentation is available [here](http://emmorts.github.io/smartmap/)

# Quick start

```typescript
interface MyInterface {
  id: number;
  value: number;
}

const map = new SmartMap<MyInterface>("id");

map.add(...[
  { id: 1, value: 1 },
  { id: 2, value: 4 },
  { id: 3, value: 9 }
]);

for (const item in map) {
  console.log(item);
}

/*
{
  id: 1,
  value: 1
},
{
  id: 2,
  value: 4
},
{
  id: 3,
  value: 9
}
*/
```

Objects can also be mapped with multiple indexes.


```typescript
const map = new SmartMap<MyInterface>("id", "value");

map.add(...[
  { id: 1, value: 1 },
  { id: 2, value: 4 },
  { id: 3, value: 9 }
]);

for (const item in map.iterateBy("value")) {
  console.log(item);
}

/*
{
  id: 1,
  value: 1
},
{
  id: 2,
  value: 4
},
{
  id: 3,
  value: 9
}
*/
```