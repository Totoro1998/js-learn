// 十进制转换为八进制
function decimalToOctal(decimal) {
  if (decimal === 0) return "0";

  let octal = "";
  while (decimal > 0) {
    octal = (decimal % 8) + octal; // 取余数，并拼接到八进制字符串的前面
    decimal = Math.floor(decimal / 8); // 除以8，并取整
  }
  return octal;
}

// 八进制转换为十进制
function octalToDecimal(octal) {
  let decimal = 0;
  let length = octal.length;
  for (let i = 0; i < length; i++) {
    decimal += parseInt(octal[length - 1 - i]) * Math.pow(8, i); // 从右到左遍历，累加每一位的八进制值
  }
  return decimal;
}
