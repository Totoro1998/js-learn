const blobParts = ['<q id="a"><span id="b">hey!</span></q>']; // 一个包含单个字符串的数组
const blob = new Blob(blobParts, { type: "text/html" }); // 得到 blob

console.log(blob);

console.log(blob.size);
console.log(blob.type);
