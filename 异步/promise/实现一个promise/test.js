// Promise.resolve(1)
//   .then((res) => {
//     throw new Error("test");
//   })
//   .catch((err) => 3)
//   .then((res) => console.log(res));

// // Promise.resolve(1)
// //   .then((res) => {
// //     throw new Error("test");
// //   })
// //   .then(undefined, () => 3)
// //   .then((res) => console.log(res));

Promise.resolve(1)
  .then((x) => x + 1)
  .then((x) => {
    throw new Error("My Error");
  })
  .catch(() => 1)
  .then((x) => x + 1)
  .then((x) => console.log(x))
  .catch(console.error);
