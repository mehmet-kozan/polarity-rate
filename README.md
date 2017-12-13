# polarity-rate
> **Text miner, polarity rater with results between -100% and +100%**
> **Unicode Supported**

![logo](https://assets.gitlab-static.net/uploads/-/system/project/avatar/4802337/polarity-rate.png)

[![version](https://img.shields.io/npm/v/polarity-rate.svg)](https://www.npmjs.org/package/polarity-rate)
[![downloads](https://img.shields.io/npm/dt/polarity-rate.svg)](https://www.npmjs.org/package/polarity-rate)
[![node](https://img.shields.io/node/v/polarity-rate.svg)](https://nodejs.org/)
[![status](https://gitlab.com/autokent/polarity-rate/badges/master/pipeline.svg)](https://gitlab.com/autokent/polarity-rate/pipelines)

## Installation
`npm install polarity-rate`

## Usage

### Contains
```js
const PolarityRate = require('polarity-rate');

let text = "aaaa bbbb cccc dddd eeee";
let wordList = [
    ["aaaa",10],
    ["aaaa bbbb",50],
    ["aaaa bbbb cccc xxxx",60]
];
var result = PolarityRate(text,wordList);
console.log(result.rate);//50.1
```


## Test
`mocha` or `npm test`

> check test folder and QUICKSTART.js for extra usage.