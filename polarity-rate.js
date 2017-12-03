var XLSX = require('xlsx');
var XRegExp = require('xregexp');
const RATE_LIMIT = 5;
var franc = require('franc-min');

function _cleanText(text) {


    //https://www.npmjs.com/package/stopwords-iso
    //mail find?

    //initial clean
    let cleanedText = XRegExp.replace(text,XRegExp('[^\\pL]+','g'), ' ').toLowerCase();

    //cross check lang dedection libraries.
    //language dedection, top 2 lang
    console.log(franc.all(cleanedText, {blacklist: []}));

    let termArr = cleanedText.split(' ');
    let cleanedTermArr = new Array(termArr.length);

    for(let i=0,j=0;i<termArr.length;i++){
        if(termArr[0] !== undefined && termArr[0].length>3)
        {

        }
    }

    //clear word less then 4 length.

    //clear stopword by default and current language

    //build ngaram array

    debugger;
    //return text.replace(/[^a-zA-Z0-9ğĞçÇöÖüÜıIİişŞ]/g,'  ').replace(/[\s]+/gm,'  ').replace(/\s[a-zA-Z0-9ğĞçÇöÖüÜıIİişŞ]{1,3}\s/g,'  ').replace(/[\s]+/g,' ').toLowerCase().trim();
}

function _getWordList(fileName)
{
    let workbook = XLSX.readFile(fileName);
    let first_sheet_name = workbook.SheetNames[0];
    let worksheet  = workbook.Sheets[first_sheet_name];
    
    let json = XLSX.utils.sheet_to_json(worksheet, {header:1});
    
    let jsonArray = [];
    let keySet = new Set();

    for(let row of json)
    {
        if(typeof row[0] == 'undefined' || typeof row[1] == 'undefined') continue;
        
        let word = row[0].trim().toLowerCase();
        let point = parseInt(row[1]);
    
        if(keySet.has(word))
        {
            console.log(`duplicated word: ${word}`);
            continue;
        }
        else
        {
            keySet.add(word);
    
            if(word.length<4)
            {
                console.log(`min word length must be 4, word: ${word}`);
            }
    
            if(point< -80 || point > 80)
            {
                console.log(`any word point must be in range of -80 to 80, word: ${word}`);
            }
    
            if(word.length == 4 && (point>10 || point<-10))
            {
                console.log(`4 length words point must be in range of -10 to 10, word: ${word}`);
            }
    
            if(word.length == 5 && (point>20 || point<-20))
            {
                console.log(`5 length words point must be in range of -20 to 20, word: ${word}`);
            }
    
            if(word.length == 6 && (point>40 || point<-40))
            {
                console.log(`6 length words point must be in range of -10 to 10, word: ${word}`);
            }
    
            let wordCount = word.split(' ').length;
    
            if(wordCount == 1 && (point>50 || point <-50))
            {
                console.log(`single word point must be in range of -30 to 30, word: ${word} wordCount: ${wordCount}`);
            }
    
            if(wordCount == 2 && (point>60 || point <-60))
            {
                console.log(`2 word point must be in range of -60 to 60, word: ${word} wordCount: ${wordCount}`);
            }
    
        }
    
        jsonArray.push([word,point]);
    }
    
    keySet.clear();

    
    jsonArray.sort((a,b)=>{
        return a[0].length < b[0].length;
    });
    
    return jsonArray;
}

/**
 * Calculating rate on the provided input 'findedWordMap'.
 * @param {Map} Input findedWordsMap
 * @return {Object}
 */
function _calculate(findedWordsMap)
{
    let rate = 0;
    let score = 0;

    score = [...findedWordsMap.values()].reduce(function(prevVal, elem) {
        return prevVal + elem;
    }, 0);

    if(score === undefined)
    {
        score = 0;
    }

    var sortedWordsArr = [];
    if(score > 0)
    {
        sortedWordsArr = [...findedWordsMap].sort((a,b) => b[1] - a[1]);
    }
    else if(score < 0)
    {
        sortedWordsArr = [...findedWordsMap].sort((a,b) => a[1] - b[1]);
    }

    for(let i = 0; i < sortedWordsArr.length ; i++)
    {
        let word = sortedWordsArr[i][0];
        let point = sortedWordsArr[i][1];

        if(i==0)
        {
            rate = point;
        }
        else
        {
            if(score > 0)
            {
                let tempRate = rate + (100 - rate)*point/(100.0*RATE_LIMIT);
                rate = tempRate >= 100 ? rate : tempRate;
            }
            else
            {
                let tempRate = rate + (100 + rate)*point/(100.0*RATE_LIMIT);
                rate = tempRate <= -100 ? rate : tempRate;
            }
        }
    }

    let result = {
        rate : rate,
        score : score,
        findedWordCount:sortedWordsArr.length,
        findedWords : sortedWordsArr,
    }

    return result;
}


/**
 * Performs sentiment analysis on the provided input 'text'.
 * @param {String} Input text
 * @return {Object}
 */
function Miner(text,wordList) {
    
    if (typeof wordList == 'undefined')
    {
        wordList = _getWordList('WordList.xlsx');
    }

    // Storage objects
    text = _cleanText(text);
    let wordCount = text.split(' ').length;
    let findedWordsMap = new Map();

    // Iterate over wordList
    for(let row of wordList)
    {
        if(row.length != 2 && typeof row[0] == 'undefined' || row[0] == null || typeof row[1] == 'undefined' || row[1]  == null || typeof row[1] != 'number' || row[0].length<4 || row[1]<-100 || row[1]>100){
            debugger;
            continue;
        }
        let word = row[0].trim().toLowerCase().replace(/[\s]+/ig," ");
        let point = row[1];

        let regexWord = word.replace(/[\s]/ig,"\\s");
        let isFinded = text.search(new RegExp(regexWord)) == -1 ? false : true;

        if(isFinded)
        {
            let isFindedInMap = [...findedWordsMap.keys()].reduce(function(prevVal, elem) {
                return prevVal || elem.includes(word);
            }, false);

            if(isFindedInMap)
            {
                findedWordPoint = findedWordsMap.get(word);

                if(point>0 && point>findedWordPoint)
                {
                    findedWordsMap.set(word,point);
                }
                else if(point<0 && point<findedWordPoint)
                {
                    findedWordsMap.set(word,point);
                }
            }
            else
            {
                for(let innerTerm of word.split(' '))
                {
                    let isFindedInMap = [...findedWordsMap.keys()].reduce(function(prevVal, elem) {
                        return prevVal || elem.includes(innerTerm);
                    }, false);

                    if(isFindedInMap)
                    {
                        findedWordsMap.delete(innerTerm);
                    }
                }

                findedWordsMap.set(word,point);
            }
        }
        else
        {
            for(let innerWord of word.split(" "))
            {
                if(innerWord.length<4) continue;
                let isFindedInText = text.search(new RegExp(innerWord)) == -1 ? false : true;

                //https://danmartensen.svbtle.com/javascripts-map-reduce-and-filter
                let isFindedInMap = [...findedWordsMap.keys()].reduce(function(prevVal, elem) {
                    return prevVal || elem.includes(innerWord);
                }, false);

                if(isFindedInText && !isFindedInMap)
                {
                    findedWordsMap.set(innerWord, point>0 ? 1 : -1);
                }
            }
        }
    }

    let _result = _calculate(findedWordsMap);

    let result = {
        cleanText:          text,
        wordCount:          wordCount,
        findedWords:        _result.findedWords,
        findedWordCount:    _result.findedWordCount,
        score:              _result.score,
        comparative:        wordCount > 0 ? _result.score / wordCount : 0,
        rate:               _result.rate,
    };

    return result;
}

if (!module.parent) 
{
    var testWordList = _getWordList('WordListTest.xlsx');
    var result = Miner("aaaa bbbb cccc dddd eeee",testWordList);
    console.log(result);
}

module.exports = Miner;