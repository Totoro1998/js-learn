const buffer = new ArrayBuffer(8);

const v1 = new Uint32Array(buffer);

v1[0] = 0x12345678;

console.log("v1.buffer------", v1.buffer);
