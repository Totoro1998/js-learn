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

let wordsFound = words(text);
let wordsUsed = unique(wordsFound);

wordsUsed;
// ["to","compose","two","functions","together","pass",
// "the","output","of","first","function","call","as",
// "input","second"]
