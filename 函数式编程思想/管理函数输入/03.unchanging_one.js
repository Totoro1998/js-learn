export function constant(v) {
  return function value() {
    return v;
  };
}

let p = new Promise.resolve();
let p1 = new Promise.resolve();

p.then(foo).then(constant(p1)).then(bar);

function foo() {
  return "foo";
}
function bar() {
  return "bar";
}
