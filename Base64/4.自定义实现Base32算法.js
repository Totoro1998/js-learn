// Base32 字符集
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

/**
 * 编码
 * @param {*} input
 * @returns
 */
function base32Encode(input) {
  // 使用 TextEncoder 将字符串编码为 UTF-8 字节数组
  const encoder = new TextEncoder();
  const bytes = encoder.encode(input);

  let binaryString = "";
  for (let i = 0; i < bytes.length; i++) {
    binaryString += bytes[i].toString(2).padStart(8, "0"); // 将每个字节转换为 8 位二进制字符串
  }

  let result = "";

  for (let i = 0; i < binaryString.length; i += 5) {
    const chunk = binaryString.slice(i, i + 5);
    result += alphabet[parseInt(chunk.padEnd(5, "0"), 2)]; // 将 5 位二进制字符串转换为 Base32 字符
  }

  // base32需要是8的倍数;
  const padding = (8 - (result.length % 8)) % 8; // 字符串为空时，padding为0
  result = result.padEnd(result.length + padding, "="); // 在末尾添加等号

  return result;
}

/**
 * 解码
 * @param {*} input
 * @returns
 */
function base32Decode(input) {
  // 去掉结尾的 "=" 填充字符
  input = input.replace(/=/g, "");

  let binaryString = "";
  // 遍历每个 Base32 字符，转换成 5 位二进制
  for (let i = 0; i < input.length; i++) {
    const charIndex = alphabet.indexOf(input[i]);
    binaryString += charIndex.toString(2).padStart(5, "0");
  }

  let byteArray = [];
  // 每 8 位转换成一个字节，保存为 Uint8Array
  for (let i = 0; i < binaryString.length; i += 8) {
    let byte = binaryString.slice(i, i + 8);
    // 不足8位，补足8位
    byte = byte.padEnd(8, "0");
    byteArray.push(parseInt(byte, 2));
  }

  return new TextDecoder().decode(new Uint8Array(byteArray));
}

function test() {
  const encoded = base32Encode("Bifjeiafjefexi😊 你好++————");
  console.log(encoded); // 6JRUGS4=
  console.log(base32Decode(encoded)); // hello
}

test();
