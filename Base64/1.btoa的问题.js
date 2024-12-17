// const str = "hello";
// const botaStr = btoa(str);
// console.log(botaStr); // aGVsbG8=

// const atobStr = atob(botaStr);
// console.log(atobStr); // hello

// 根据设计，Base64 仅将二进制数据作为其输入。而在 JavaScript 字符串中，这意味着每个字符只能使用一个字节表示。
// 所以，如果你将一个字符串传递给 btoa()，而其中包含了需要使用超过一个字节才能表示的字符，你就会得到一个错误，因为这个字符串不能被看作是二进制数据
const str2 = "😊";
const botaStr2 = btoa(str2);
console.log(botaStr2); // 8J+YgA==

// const atobStr2 = atob(botaStr2);
// console.log(atobStr2); // 😊
