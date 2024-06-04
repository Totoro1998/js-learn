// 二进制转换为十六进制
function binaryToHex(binary) {
  let binaryStr = binary.toString();

  // 在高位补零，使长度为4的倍数
  while (binaryStr.length % 4 !== 0) {
    binaryStr = "0" + binaryStr;
  }

  let hex = "";
  for (let i = 0; i < binaryStr.length; i += 4) {
    let fourBits = binaryStr.substring(i, i + 4);
    hex += parseInt(fourBits, 2).toString(16).toUpperCase();
  }
  return hex;
}

// 十六进制转换为二进制
function hexToBinary(hex) {
  let hexStr = hex.toString().toUpperCase();
  let binary = "";

  for (let i = 0; i < hexStr.length; i++) {
    let decimal = parseInt(hexStr[i], 16);
    let binarySegment = decimal.toString(2);

    // 补齐四位
    while (binarySegment.length < 4) {
      binarySegment = "0" + binarySegment;
    }

    binary += binarySegment;
  }

  // 去掉前导零
  return binary.replace(/^0+/, "") || "0";
}

console.log(hexToBinary("1F600"));
