// 八进制转换为十六进制
function octalToHex(octal) {
  let decimal = parseInt(octal, 8);
  return decimal.toString(16).toUpperCase();
}

// 十六进制转换为八进制
function hexToOctal(hex) {
  let decimal = parseInt(hex, 16);
  return decimal.toString(8);
}
