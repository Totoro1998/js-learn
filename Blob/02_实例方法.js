const blobParts = ['<q id="a"><span id="b">hey!</span></q>']; // 一个包含单个字符串的数组
const blob = new Blob(blobParts, { type: "text/html" }); // 得到 blob

const decoder = new TextDecoder();

// console.log(blob.stream());

// console.log(blob.slice(0, 10));

// blob.text().then((res) => {
//   console.log(res); // <q id="a"><span id="b">hey!</span></q>
// });

blob.arrayBuffer().then((res) => {
  console.log(res);
  console.log(decoder.decode(res));
});
