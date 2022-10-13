function compose2(fn2, fn1) {
  return function composed(origValue) {
    return fn2(fn1(origValue));
  };
}

function words(str) {
  return String(str)
    .toLowerCase()
    .split(/\s|\b/)
    .filter(function alpha(v) {
      return /^[\w]+$/.test(v);
    });
}

function unique(list) {
  var uniqList = [];

  for (let v of list) {
    // value not yet in the new list?
    if (uniqList.indexOf(v) === -1) {
      uniqList.push(v);
    }
  }

  return uniqList;
}

let text =
  "To compose two functions together, pass the \
output of the first function call as the input of the \
second function call.";

// ["to","compose","two","functions","together","pass",
// "the","output","of","first","function","call","as",
// "input","second"]
var uniqueWords = compose2(unique, words);
uniqueWords(text);
