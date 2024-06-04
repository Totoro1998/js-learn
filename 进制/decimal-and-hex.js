// 十进制转换为十六进制
function decimalToHex(decimal) {
  if (decimal === 0) return "0";

  const hexDigits = "0123456789ABCDEF";
  let hex = "";
  while (decimal > 0) {
    hex = hexDigits[decimal % 16] + hex; // 取余数，找到对应的十六进制字符，并拼接到十六进制字符串的前面
    decimal = Math.floor(decimal / 16); // 除以16，并取整
  }
  return hex;
}

// 十六进制转换为十进制
function hexToDecimal(hex) {
  const hexDigits = "0123456789ABCDEF";
  let decimal = 0;
  let length = hex.length;
  for (let i = 0; i < length; i++) {
    const index = hexDigits.indexOf(hex[length - 1 - i].toUpperCase());
    decimal += index * Math.pow(16, i); // 从右到左遍历，累加每一位的十六进制值
  }
  return decimal;
}

// 测试
console.log(decimalToHex(1114111)); // 输出: FF
// console.log(hexToDecimal("10FFFF")); // 输出: 255

console.log(hexToDecimal("1F600"));

console.log((0x10ffff).toString(10));
