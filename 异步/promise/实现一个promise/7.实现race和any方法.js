const PENDING = "pending";
const FULFILLED = "fulfiled";
const REJECTED = "rejected";

class Promise {
  constructor(executor) {
    this.status = PENDING; // promise状态
    this.value = undefined; // resolve成功时传递的值
    this.reason = undefined; // reject失败时传递的原因
    this.onFulfilledCallbacks = []; // 处理异步 成功回调：因为then方法、catch方法、finally方法可以添加多个处理程序
    this.onRejectedCallbacks = []; // 处理异步 失败回调
    // ! resolve和reject函数，是指异步操作已经完成了，根据异步操作的结果来判断调用resolve或reject
    const resolve = (value) => {
      this.status === PENDING && (this.status = FULFILLED); // 只能从pending转到fulfiled或pending转到rejected
      this.value = value;

      this.onFulfilledCallbacks.forEach((fn) => fn());
    };
    const reject = (reason) => {
      this.status === PENDING && (this.status = REJECTED); // 只能从pending转到fulfiled或pending转到rejected
      this.reason = reason;
      this.onRejectedCallbacks.forEach((fn) => fn());
    };
    // 如果executor执行过程中抛出异常，使用trycatch捕获异常并使用reject传原因
    try {
      // 在executor中执行异步代码，成功使用resolve传值，失败使用reject传原因
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }
  then(onFulfilled, onRejected) {
    // onFulfilled 添加默认值
    onFulfilled = typeof onFulfilled === "function" ? onFulfilled : (value) => value;
    // onRejected 添加默认值
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (reason) => {
            throw reason;
          };
    // then方法的返回值是一个新的 Promise 对象，这个新的 Promise 的状态和结果取决于 then 方法的回调函数（即 onFulfilled 和 onRejected）的执行情况
    // onFulfilled 和 onRejected有可能会返回一个普通值，一个Promise 对象，抛出一个异常，这时候需要调用新的 Promise 对象即returnedPromise的resolve或者reject方法。
    // returnedPromise中的 executor 需要执行resolve和reject将值或原因传出去，才能在returnedPromise中的then方法中的onFulfilled和onRejected函数中获取该值或者原因。
    const returnedPromise = new Promise((resolve, reject) => {
      // 成功的回调
      const fulfilledTask = () => {
        try {
          const x = onFulfilled(this.value); // x 有可能是一个一个Promise 对象
          Promise.resolvePromise(returnedPromise, x, resolve, reject);
        } catch (error) {
          reject(error);
        }
      };
      // 失败的回调
      const rejectedTask = () => {
        try {
          const x = onRejected(this.reason); // x 有可能是一个一个Promise 对象
          Promise.resolvePromise(returnedPromise, x, resolve, reject);
        } catch (error) {
          reject(error);
        }
      };
      if (this.status === FULFILLED) {
        queueMicrotask(fulfilledTask); // 使用微任务队列，即使executor没有异步函数，then的处理程序也是走微任务队列的
      }
      if (this.status === REJECTED) {
        queueMicrotask(rejectedTask);
      }
      // 处理异步，异步处理时，onFulfilled或者onRejected处理程序会在用户调用executor的resolve或者reject函数时执行
      if (this.status === PENDING) {
        this.onFulfilledCallbacks.push(() => queueMicrotask(fulfilledTask));
        this.onRejectedCallbacks.push(() => queueMicrotask(rejectedTask));
      }
    });

    return returnedPromise;
  }
  /**
   * 判断onFulfilled或者onRejected返回的 x 的值是普通值还是promise对象
   * 如果 x 是普通值：直接调用resolve，对你没有看错，即使onRejected处理程序，也是调用then方法新生成Promise对象的resolve
   * 如果 x 是 promise 对象：查看该promsie对象返回的结果，根据promise对象返回的结果决定调用resolve还是调用reject
   * @param {*} newPromise：当前Promise对象中then方法返回的newPromise
   * @param {*} x：当前Promise对象中then方法的onFuliled和onRejected执行后的返回值
   * @param {*} resolve：newPromise的resolve
   * @param {*} reject：newPromise的reject
   * @returns
   */
  static resolvePromise(newPromise, x, resolve, reject) {
    // 避免循环引用：确保 newPromise 不能直接或间接引用自身，否则会造成循环引用，这会导致无限递归。
    if (newPromise === x) {
      return reject(new TypeError("Chaining cycle detected for promise"));
    }

    let called = false; // 确保 resolve 或 reject 只能被调用一次

    if (x != null && (typeof x === "object" || typeof x === "function")) {
      try {
        const then = x.then;
        // 处理thenable对象
        if (typeof then === "function") {
          then.call(
            x,
            // 代表成功的回调，将 y 递归传入 resolvePromise 以确保返回的 y 也符合 Promise 的要求
            (y) => {
              if (called) return;
              called = true;
              // 再次调用 Promise.resolvePromise，以确保递归解析 y 的最终值，这种递归的设计使得我们可以处理链式的 Promise 或 thenable 返回值即onFulfiled处理器得到的最终值一定不是Promise对象，而是最终值
              Promise.resolvePromise(newPromise, y, resolve, reject);
            },
            // 代表失败时的回调，将错误传入 reject
            (r) => {
              if (called) return;
              called = true;
              reject(r);
            }
          );
        } else {
          resolve(x);
        }
      } catch (error) {
        if (called) return;
        called = true;
        reject(error);
      }
    } else {
      resolve(x);
    }
  }
  static resolve(value) {
    if (value instanceof Promise) {
      return value; // 如果是 Promise 实例，直接返回
    }
    return new Promise((resolve) => resolve(value)); // 返回已解决的 Promise
  }
  static reject(reason) {
    return new Promise((_, reject) => reject(reason)); // 返回已拒绝的 Promise，如果reason是一个Promise对象，整个对象会被当成reason
  }
  catch(onRejected) {
    return this.then(null, onRejected);
  }
  /**
   * 1.finally 方法的设计目标是让我们在 Promise 完成后，无论是 fulfilled（成功）还是 rejected（失败），都能执行某个回调操作，而不影响 Promise 的结果
   * 2.返回一个新的 Promise：为了保证链式调用一致性，finally 方法返回一个新的 Promise 实例。
   * 3.无论原 Promise 的状态如何，新 Promise 会确保 onFinally 回调在被调用后才返回原来的状态和结果。
   * 4.假如 onFinally 返回的是一个异步操作，使用 Promise.resolve(onFinally()).then(...) 的写法会等待异步操作完成后再继续执行 .then(...) 中的回调函数。
   * 这保证了 finally 的回调无论是否返回 Promise，都会正确等待执行完成   *
   * 5.如果 onFinally 函数在执行中抛出错误，Promise.resolve(onFinally()).then(...) 写法可以捕获这个错误，并将它传递到后续的 .then 或 .catch 链中。
   */
  finally(onFinally) {
    return this.then(
      // 如果是promise是fulfiled状态，可以调用这个函数
      (value) => Promise.resolve(onFinally()).then(() => value),
      // 如果是promise是rejected状态，可以调用这个函数
      (reason) =>
        Promise.resolve(onFinally()).then(() => {
          throw reason;
        })
    );
  }
  /**
   * Promise.all方法
   * 接收一个 Promise 数组，所有 Promise 成功才返回结果数组，有一个失败则立即失败。
   * @param {Iterable<Promise>} promises - 一个 Promise 的可迭代对象
   * @returns {Promise} 返回一个新的 Promise
   */
  static all(promises) {
    return new Promise((resolve, reject) => {
      const results = [];
      let completedPromises = 0;

      // 使用 for 循环遍历 promises
      for (let i = 0; i < promises.length; i++) {
        Promise.resolve(promises[i])
          .then((value) => {
            results[i] = value; // 按顺序保存每个 Promise 的结果
            completedPromises += 1;
            // 当所有 Promise 完成后，调用 resolve 返回结果数组
            if (completedPromises === promises.length) {
              resolve(results);
            }
          })
          .catch(reject); // 一旦有任何 Promise 失败，立即调用 reject
      }
    });
  }

  /**
   * Promise.allSettled方法
   * 接收一个 Promise 数组，返回每个 Promise 的结果状态，无论成功或失败。
   * @param {Iterable<Promise>} promises - 一个 Promise 的可迭代对象
   * @returns {Promise} 返回一个新的 Promise，结果为所有 Promise 的状态数组
   */
  static allSettled(promises) {
    return new Promise((resolve) => {
      const results = [];
      let completedPromises = 0;

      // 使用 for 循环遍历 promises
      for (let i = 0; i < promises.length; i++) {
        Promise.resolve(promises[i])
          .then((value) => {
            results[i] = { status: "fulfilled", value };
          })
          .catch((reason) => {
            results[i] = { status: "rejected", reason };
          })
          .finally(() => {
            completedPromises += 1;
            // 当所有 Promise 都有结果时，调用 resolve 返回状态数组
            if (completedPromises === promises.length) {
              resolve(results);
            }
          });
      }
    });
  }

  /**
   * Promise.race方法
   * 返回第一个完成的 Promise 的结果，不论是成功还是失败。
   * @param {Iterable<Promise>} promises - 一个 Promise 的可迭代对象
   * @returns {Promise} 返回第一个完成的 Promise 的结果
   */
  static race(promises) {
    return new Promise((resolve, reject) => {
      for (let i = 0; i < promises.length; i++) {
        Promise.resolve(promises[i])
          .then(resolve) // 只要有一个成功，立即 resolve
          .catch(reject); // 只要有一个失败，立即 reject
      }
    });
  }

  /**
   * Promise.any方法
   * 返回第一个成功的 Promise 的结果，如果所有 Promise 都失败则返回 AggregateError。
   * @param {Iterable<Promise>} promises - 一个 Promise 的可迭代对象
   * @returns {Promise} 返回第一个成功的 Promise 的结果，或 AggregateError
   */
  static any(promises) {
    return new Promise((resolve, reject) => {
      const errors = [];
      let rejectedCount = 0;

      for (let i = 0; i < promises.length; i++) {
        Promise.resolve(promises[i])
          .then(resolve) // 只要有一个成功，立即 resolve
          .catch((error) => {
            errors[i] = error; // 保存每个拒绝的原因
            rejectedCount += 1;
            // 如果所有 Promise 都失败，返回 AggregateError
            if (rejectedCount === promises.length) {
              reject(new AggregateError(errors, "All promises were rejected"));
            }
          });
      }
    });
  }
}
