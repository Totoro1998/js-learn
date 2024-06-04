const buffer = new ArrayBuffer(8);

console.log("buffer.byteLength", buffer.byteLength);
console.log("buffer.maxByteLength", buffer.maxByteLength);
console.log("buffer.resizable", buffer.resizable);

const buffer1 = new ArrayBuffer(8, { maxByteLength: 16 });

console.log("buffer1.byteLength", buffer1.byteLength);
console.log("buffer1.maxByteLength", buffer1.maxByteLength);
console.log("buffer1.resizable", buffer1.resizable);
