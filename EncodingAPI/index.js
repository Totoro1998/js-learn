const str = "😊";
const encoder = new TextEncoder();
const decoder = new TextDecoder();
const view = encoder.encode(str);
const uint16Array = new Uint16Array(view.buffer);
console.log(view);
console.log(uint16Array);
