const base64Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

function encodeBase64(input) {
  let utf8Array = stringToUTF8Bytes(input);
  let binaryStr = "";

  // 将每个字节转换为8位二进制
  for (let i = 0; i < utf8Array.length; i++) {
    let binaryChar = utf8Array[i].toString(2);
    while (binaryChar.length < 8) {
      binaryChar = "0" + binaryChar;
    }
    binaryStr += binaryChar;
  }

  let base64Str = "";

  // 每6位一组，转换为Base64字符
  for (let i = 0; i < binaryStr.length; i += 6) {
    let segment = binaryStr.slice(i, i + 6);
    while (segment.length < 6) {
      segment += "0";
    }
    let index = parseInt(segment, 2);
    base64Str += base64Chars.charAt(index);
  }

  // 补齐等号
  while (base64Str.length % 4 !== 0) {
    base64Str += "=";
  }

  return base64Str;
}

function stringToUTF8Bytes(input) {
  let utf8Bytes = [];
  for (let i = 0; i < input.length; i++) {
    let codePoint = input.codePointAt(i);
    if (codePoint < 0x80) {
      utf8Bytes.push(codePoint);
    } else if (codePoint < 0x800) {
      utf8Bytes.push(0xc0 | (codePoint >> 6), 0x80 | (codePoint & 0x3f));
    } else if (codePoint < 0x10000) {
      utf8Bytes.push(0xe0 | (codePoint >> 12), 0x80 | ((codePoint >> 6) & 0x3f), 0x80 | (codePoint & 0x3f));
    } else {
      utf8Bytes.push(
        0xf0 | (codePoint >> 18),
        0x80 | ((codePoint >> 12) & 0x3f),
        0x80 | ((codePoint >> 6) & 0x3f),
        0x80 | (codePoint & 0x3f)
      );
      i++; // 处理四字节字符时，跳过一个额外的索引
    }
  }
  return utf8Bytes;
}

// // 示例：编码包含中文的字符串到Base64
// let stringToEncode = "你好，世界！";
// let encodedString = encodeBase64(stringToEncode);
// console.log(encodedString); // 输出: "5L2g5aW977yM5LiW55WM77yB"

function decodeBase64(input) {
  let binaryStr = "";

  // 移除等号
  input = input.replace(/=+$/, "");

  // 将每个Base64字符转换为6位二进制
  for (let i = 0; i < input.length; i++) {
    let binaryChar = base64Chars.indexOf(input.charAt(i)).toString(2);
    while (binaryChar.length < 6) {
      binaryChar = "0" + binaryChar;
    }
    binaryStr += binaryChar;
  }

  let byteArray = [];

  // 每8位一组，转换为字节
  for (let i = 0; i < binaryStr.length; i += 8) {
    let segment = binaryStr.slice(i, i + 8);
    if (segment.length < 8) {
      continue;
    }
    let byte = parseInt(segment, 2);
    byteArray.push(byte);
  }

  let decodedStr = utf8BytesToString(byteArray);
  return decodedStr;
}

function utf8BytesToString(bytes) {
  let decodedStr = "";
  for (let i = 0; i < bytes.length; i++) {
    let byte1 = bytes[i];
    if (byte1 < 0x80) {
      decodedStr += String.fromCodePoint(byte1);
    } else if (byte1 < 0xe0) {
      let byte2 = bytes[++i];
      decodedStr += String.fromCodePoint(((byte1 & 0x1f) << 6) | (byte2 & 0x3f));
    } else if (byte1 < 0xf0) {
      let byte2 = bytes[++i];
      let byte3 = bytes[++i];
      decodedStr += String.fromCodePoint(((byte1 & 0x0f) << 12) | ((byte2 & 0x3f) << 6) | (byte3 & 0x3f));
    } else {
      let byte2 = bytes[++i];
      let byte3 = bytes[++i];
      let byte4 = bytes[++i];
      decodedStr += String.fromCodePoint(((byte1 & 0x07) << 18) | ((byte2 & 0x3f) << 12) | ((byte3 & 0x3f) << 6) | (byte4 & 0x3f));
    }
  }
  return decodedStr;
}

// 示例：解码包含中文的Base64字符串
let encodedStr = "5L2g5aW977yM5LiW55WM77yB";
let decodedString = decodeBase64(encodedStr);
console.log(decodedString); // 输出: "你好，世界！"
