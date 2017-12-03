var XRegExp = require('xregexp');

var unicodeWord = XRegExp('^\\pL+$');



console.log(XRegExp.replace('şşğğğiiIIğğğРусский 111 日本語 222العربية ------ 💩💩💩',XRegExp('[^\\pL]+','g'), ' '));




var noneUnicodeBlock = XRegExp('[^\\pL]+','g');
console.log('şşğğğiiIIğğğРусский 111 日本語 222العربية ------ 💩💩💩'.replace(noneUnicodeBlock,' '));