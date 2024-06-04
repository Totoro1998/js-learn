// 十进制转二进制
function decimalToBinary(decimal) {
  if (decimal === 0) return "0";
  let binary = "";
  while (decimal > 0) {
    binary = (decimal % 2) + binary;
    decimal = Math.floor(decimal / 2);
  }
  return binary;
}

// 二进制转十进制
function binaryToDecimal(binary) {
  let decimal = 0;
  for (let i = 0; i < binary.length; i++) {
    decimal = decimal * 2 + parseInt(binary[i], 10);
  }
  return decimal;
}

console.log(decimalToBinary(1048575).length);
