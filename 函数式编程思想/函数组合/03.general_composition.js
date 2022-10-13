export function compose(...fns) {
  return function composed(result) {
    // copy the array of functions
    let list = [...fns];

    while (list.length > 0) {
      // take the last function off the end of the list
      // and execute it
      result = list.pop()(result);
    }

    return result;
  };
}

function skipShortWords(words) {
  var filteredWords = [];

  for (let word of words) {
    if (word.length > 4) {
      filteredWords.push(word);
    }
  }

  return filteredWords;
}

var text =
  "To compose two functions together, pass the \
output of the first function call as the input of the \
second function call.";

var biggerWords = compose(skipShortWords, unique, words);

var wordsUsed = biggerWords(text);

wordsUsed;
// ["compose","functions","together","output","first",
// "function","input","second"]

// Note: uses a `<= 4` check instead of the `> 4` check
// that `skipShortWords(..)` uses
function skipLongWords(list) {
  /* .. */
}

var filterWords = partialRight(compose, unique, words);

var biggerWords = filterWords(skipShortWords);
var shorterWords = filterWords(skipLongWords);

biggerWords(text);
// ["compose","functions","together","output","first",
// "function","input","second"]

shorterWords(text);
// ["to","two","pass","the","of","call","as"]
