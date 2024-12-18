const x = new Int8Array([1, 1]);
const y = new Int8Array(x);

x[0] = 2;

console.log(x, y);
