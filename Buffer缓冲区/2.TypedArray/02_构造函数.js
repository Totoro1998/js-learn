// 生成一个8个成员的Float64Array数组（共 64 字节）
const f64a = new Float64Array(8);
f64a[0] = 10;
f64a[1] = 20;
f64a[2] = f64a[0] + f64a[1];

console.log(f64a);
console.log(f64a.length);
console.log(f64a.byteLength);
