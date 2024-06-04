// 创建一个8字节的ArrayBuffer
const b = new ArrayBuffer(8);

// 创建一个指向b的Int32视图，开始于字节0，直到缓冲区的末尾
const v1 = new Int32Array(b);

// 创建一个指向b的Uint8视图，开始于字节2，直到缓冲区的末尾
const v2 = new Uint8Array(b, 2);

// 创建一个指向b的Int16视图，开始于字节2，长度为2
const v3 = new Int16Array(b, 2, 2);

console.log("v1.length", v1.length);
console.log("v2.length", v2.length);
console.log("v3.length", v3.length);
console.log("v1.byteLength", v1.byteLength);
console.log("v2.byteLength", v2.byteLength);
console.log("v3.byteLength", v3.byteLength);

// 修改 v1 的第一个元素
v1[0] = 0x12345678; // 32 位整数，写入字节 0-3

console.log(v2[0]); // 86 (0x56, 字节 2)
console.log(v3[0]); // 22136 (0x5678, 字节 2-3)

// 修改 v2 的第一个元素
v2[0] = 0x99; // 8 位整数，写入字节 2

console.log(v1[0]); // 305419896 (0x12349978, 字节 0-3)
console.log(v3[0]); // -26216 (0x9978, 字节 2-3)

// 修改 v3 的第一个元素
v3[0] = 0xabcd; // 16 位整数，写入字节 2-3

console.log(v1[0]); // 305441741 (0x1234ABCD, 字节 0-3)
console.log(v2[0]); // 205 (0xCD, 字节 2)
