const assert = require('assert');
const PolarityRate = require('../');

describe('negative-positive must be equal', function() {
    it('should equal', function() {
        let text = "aaaa bbbb cccc dddd eeee";
        let positiveWordList = [
            ["aaaa",10],
            ["aaaa bbbb",50],
            ["aaaa bbbb cccc xxxx",60]
        ];
        var positiveResult = PolarityRate(text,positiveWordList);

        let negativeWordList = [
            ["aaaa",-10],
            ["aaaa bbbb",-50],
            ["aaaa bbbb cccc xxxx",-60]
        ];
        var negativeResult = PolarityRate(text,negativeWordList);

        assert.equal(positiveResult.rate,-1*negativeResult.rate);
    });
});


describe('unicode negative-positive must be equal', function() {
    it('should equal', function() {
        let text = "şşğI кийй 日本語語 العربية eeee";
        let positiveWordList = [
            ["şşğI",10],
            ["şşğI кийй",50],
            ["şşğI кийй 日本語語 xxxx",60]
        ];
        var positiveResult = PolarityRate(text,positiveWordList);

        let negativeWordList = [
            ["şşğI",-10],
            ["şşğI кийй",-50],
            ["şşğI кийй 日本語語 xxxx",-60]
        ];
        var negativeResult = PolarityRate(text,negativeWordList);

        assert.equal(positiveResult.rate,-1*negativeResult.rate);
    });
});

