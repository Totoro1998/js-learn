// 二进制转换为八进制
function binaryToOctal(binary) {
  let binaryStr = binary.toString();

  // 在高位补零，使长度为3的倍数
  while (binaryStr.length % 3 !== 0) {
    binaryStr = "0" + binaryStr;
  }

  let octal = "";
  for (let i = 0; i < binaryStr.length; i += 3) {
    let threeBits = binaryStr.substring(i, i + 3);
    octal += parseInt(threeBits, 2).toString(8);
  }
  return octal;
}

// 八进制转换为二进制
function octalToBinary(octal) {
  let octalStr = octal.toString();
  let binary = "";

  for (let i = 0; i < octalStr.length; i++) {
    let decimal = parseInt(octalStr[i], 8);
    let binarySegment = decimal.toString(2);

    // 补齐三位
    while (binarySegment.length < 3) {
      binarySegment = "0" + binarySegment;
    }

    binary += binarySegment;
  }

  // 去掉前导零
  return binary.replace(/^0+/, "") || "0";
}
