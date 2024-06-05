var blob = new Blob(["Hello, world!"], { type: "text/plain" });
var url = URL.createObjectURL(blob);
console.log(url); // 将输出一个类似 "blob:http://example.com/abc123" 的 URL

// blob:nodedata:e25191c5-2a04-4826-93a3-0f1f6b4bc51a
