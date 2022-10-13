export function spreadArgs(fn) {
  return function spreadFn(argsArr) {
    return fn(...argsArr);
  };
}

export function gatherArgs(fn) {
  return function gatherFn(...argsArr) {
    return fn(argsArr);
  };
}

function foo(x, y) {
  console.log(x + y);
}
function bar(fn) {
  fn([3, 9]);
}
bar(spreadArgs(foo));

function combineFirstTwo([v1, v2]) {
  return v1 + v2;
}
[1, 2, 3, 4, 5].reduce(gatherArgs(combineFirstTwo));
// 15
