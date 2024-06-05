const encoder = new TextEncoder();
const decoder = new TextDecoder();
const view = encoder.encode("€");
console.log(view); // Uint8Array(3) [226, 130, 172]

console.log(decoder.decode(view));
