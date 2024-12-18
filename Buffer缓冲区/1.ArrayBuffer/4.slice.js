const buf1 = new ArrayBuffer(8);

console.log(buf1.byteLength);
const buf2 = buf1.slice(0, 2);

console.log(buf2.byteLength);
