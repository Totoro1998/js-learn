export function identity(v) {
  return v;
}

let words = "   Now is the time for all...  ".split(/\s|\b/);
words;
// ["","Now","is","the","time","for","all","...",""]

words.filter(identity);
// ["Now","is","the","time","for","all","..."]

function output(msg, formatFn = identity) {
  msg = formatFn(msg);
  console.log(msg);
}

function upper(txt) {
  return txt.toUpperCase();
}

output("Hello World", upper); // HELLO WORLD
output("Hello World"); // Hello World
