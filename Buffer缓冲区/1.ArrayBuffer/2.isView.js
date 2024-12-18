const buffer = new ArrayBuffer(16);

console.log(ArrayBuffer.isView(new Int32Array(buffer)));
