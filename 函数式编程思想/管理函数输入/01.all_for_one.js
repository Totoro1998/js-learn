export function unary(fn) {
  return function onlyOneArg(arg) {
    return fn(arg);
  };
}

["1", "2", "3"].map(parseInt);
// [1,NaN,NaN]

["1", "2", "3"].map(unary(parseInt));
// [1,2,3]
