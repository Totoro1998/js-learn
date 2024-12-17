/**
 * 编码
 * @param {*} str
 * @returns
 */
function encodeBase64(str) {
  // Base64 字符集
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

  // 使用 TextEncoder 将字符串编码为 UTF-8 字节数组
  const encoder = new TextEncoder();
  const bytes = encoder.encode(str);

  let binaryString = "";
  for (let i = 0; i < bytes.length; i++) {
    binaryString += bytes[i].toString(2).padStart(8, "0");
  }
  // console.log(binaryString); // (32位) 11110000100111111001100010001010

  let result = "";
  for (let i = 0; i < binaryString.length; i += 6) {
    const chunk = binaryString.slice(i, i + 6);
    // 不足六位的，在后面补0
    result += chars[parseInt(chunk.padEnd(6, "0"), 2)];
  }

  // base64需要是4的倍数
  const padding = (4 - (result.length % 4)) % 4; // 字符串为空时，padding为0
  result = result.padEnd(result.length + padding, "=");
  return result;
}

/**
 * 解码
 * @param {*} encodedStr
 * @returns
 */
function decodeBase64(encodedStr) {
  // Base64 字符集
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

  // 去掉结尾的 "=" 填充字符
  encodedStr = encodedStr.replace(/=/g, ""); // 8J+Yig

  let binaryString = "";
  // 遍历每个 Base64 字符，转换成 6 位二进制
  for (let i = 0; i < encodedStr.length; i++) {
    const charIndex = chars.indexOf(encodedStr[i]);
    binaryString += charIndex.toString(2).padStart(6, "0");
  }

  console.log(binaryString); //(36) 111100001001111110011000100010100000

  let byteArray = [];
  // 每 8 位转换成一个字节，保存为 Uint8Array
  for (let i = 0; i < binaryString.length; i += 8) {
    const byte = binaryString.slice(i, i + 8);
    // 舍弃后面填充的0
    if (byte.length === 8) {
      byteArray.push(parseInt(byte, 2));
    }
  }
  // 直接使用 Uint8Array 进行解码
  const uint8Array = Uint8Array.from(byteArray);
  const decoder = new TextDecoder("utf-8");

  // 返回解码后的字符串
  return decoder.decode(uint8Array);
}

function test() {
  const base64 = encodeBase64("😊");
  console.log(base64);
  console.log(decodeBase64(base64));
}

test();
