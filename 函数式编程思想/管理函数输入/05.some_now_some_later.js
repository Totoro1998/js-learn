export function partial(fn, ...presetArgs) {
  return function partiallyApplied(...laterArgs) {
    return fn(...presetArgs, ...laterArgs);
  };
}
function add(x, y) {
  return x + y;
}
[1, 2, 3, 4, 5].map(function adder(val) {
  return add(3, val);
});
// [4,5,6,7,8]

[1, 2, 3, 4, 5].map(partial(add, 3));
// [4,5,6,7,8]

export function partialProps(fn, presetArgsObj) {
  return function partiallyApplied(laterArgsObj) {
    return fn(Object.assign({}, presetArgsObj, laterArgsObj));
  };
}
function foo({ x, y, z } = {}) {
  console.log(`x:${x} y:${y} z:${z}`);
}
var f2 = partialProps(foo, { y: 2 });

f2({ z: 3, x: 1 });
// x:1 y:2 z:3
