var XRegExp = require('xregexp');

var unicodeWord = XRegExp('^\\pL+$');



console.log(XRegExp.replace('şşğğğiiIIğğğРусский 111 日本語  ------ 💩💩💩',XRegExp('[^\\pL]+','g'), ' '));




var noneUnicodeBlock = XRegExp('[^\\pL]+','g');
console.log('şşğğğiiIIğğğРусский 111 日本語 العربية ------ 💩💩💩'.replace(noneUnicodeBlock,' '));