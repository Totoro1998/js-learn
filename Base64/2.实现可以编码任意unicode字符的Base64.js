function unicodeToBase64(str) {
  // 使用 TextEncoder 将字符串转换为 Uint8Array
  const encoder = new TextEncoder();
  const byteArray = encoder.encode(str);
  //   console.log(byteArray); // Uint8Array(4) [ 240, 159, 152, 138 ]

  // 将 Uint8Array 转换为 Base64
  const binaryString = [...byteArray].map((byte) => String.fromCharCode(byte)).join("");
  return btoa(binaryString); // 使用 btoa 生成 Base64
}

function base64ToUnicode(base64) {
  // 解码 Base64 为二进制字符串
  const binaryString = atob(base64);

  // 将二进制字符串转换为 Uint8Array
  const byteArray = Uint8Array.from(binaryString, (char) => char.charCodeAt(0));

  // 使用 TextDecoder 将 Uint8Array 转换为 Unicode 字符串
  const decoder = new TextDecoder();
  return decoder.decode(byteArray);
}

function test() {
  const str = "😊，你好世界";
  const base64 = unicodeToBase64(str);
  console.log(base64);
  console.log(base64ToUnicode(""));
}

test();
