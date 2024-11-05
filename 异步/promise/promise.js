const PENDING = "pending"; // 等待
const FULFILLED = "fulfilled"; // 成功
const REJECTED = "rejected"; // 失败

class Promise {
  constructor(executor) {
    this.state = PENDING; // promise状态
    this.value = undefined; // 成功的值
    this.reason = undefined; // 失败的原因
    this.onFulfilledCallbacks = []; // 成功回调：因为then方法、catch方法、finally方法可以添加多个处理程序
    this.onRejectedCallbacks = []; // 失败回调

    const resolve = (value) => {
      if (this.state === PENDING) {
        this.state = FULFILLED;
        this.value = value;
        this.onFulfilledCallbacks.forEach((callback) => callback(value));
      }
    };

    const reject = (reason) => {
      if (this.state === PENDING) {
        this.state = REJECTED;
        this.reason = reason;
        this.onRejectedCallbacks.forEach((callback) => callback(reason));
      }
    };

    try {
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

    // then方法返回一个新的promise
    const returnedPromise = new Promise((resolve, reject) => {
      // 成功的回调
      const fulfilledTask = () => {
        try {
          const x = onFulfilled(this.value);
          Promise.resolvePromise(returnedPromise, x, resolve, reject);
        } catch (error) {
          reject(error);
        }
      };
      // 失败的回调
      const rejectedTask = () => {
        try {
          const x = onRejected(this.reason);
          Promise.resolvePromise(returnedPromise, x, resolve, reject);
        } catch (error) {
          reject(error);
        }
      };

      if (this.state === FULFILLED) {
        queueMicrotask(fulfilledTask);
      } else if (this.state === REJECTED) {
        queueMicrotask(rejectedTask);
      } else {
        // 处理异步的部分，如果executor中使用了异步，需要把then方法的两个参数onFulfilled和onRejected存起来，在executor中的调用resolve或者reject后使用
        this.onFulfilledCallbacks.push(() => queueMicrotask(fulfilledTask));
        this.onRejectedCallbacks.push(() => queueMicrotask(rejectedTask));
      }
    });

    return returnedPromise;
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }

  /**
   * finally 方法的设计目标是让我们在 Promise 完成后，无论是 fulfilled（成功）还是 rejected（失败），都能执行某个回调操作，而不影响 Promise 的结果
   * 返回一个新的 Promise：为了保证链式调用一致性，finally 方法返回一个新的 Promise 实例。
   * 无论原 Promise 的状态如何，新 Promise 会确保 onFinally 回调在被调用后才返回原来的状态和结果。
   * @param {*} onFinally
   * @returns
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

  static resolve(value) {
    if (value instanceof Promise) {
      return value;
    }
    return new Promise((resolve) => resolve(value));
  }

  static reject(reason) {
    return new Promise((_, reject) => reject(reason));
  }

  static all(promises) {
    return new Promise((resolve, reject) => {
      const results = [];
      let completed = 0;

      promises.forEach((promise, index) => {
        Promise.resolve(promise).then((value) => {
          results[index] = value;
          completed += 1;
          if (completed === promises.length) {
            resolve(results);
          }
        }, reject);
      });
    });
  }

  static race(promises) {
    return new Promise((resolve, reject) => {
      promises.forEach((promise) => {
        Promise.resolve(promise).then(resolve, reject);
      });
    });
  }

  static allSettled(promises) {
    return new Promise((resolve) => {
      const results = [];
      let completed = 0;

      promises.forEach((promise, index) => {
        Promise.resolve(promise).then(
          (value) => {
            results[index] = { status: "fulfilled", value };
            completed += 1;
            if (completed === promises.length) {
              resolve(results);
            }
          },
          (reason) => {
            results[index] = { status: "rejected", reason };
            completed += 1;
            if (completed === promises.length) {
              resolve(results);
            }
          }
        );
      });
    });
  }

  static any(promises) {
    return new Promise((resolve, reject) => {
      const errors = [];
      let rejectedCount = 0;

      promises.forEach((promise, index) => {
        Promise.resolve(promise).then(resolve, (error) => {
          errors[index] = error;
          rejectedCount += 1;
          if (rejectedCount === promises.length) {
            reject(new AggregateError(errors, "All promises were rejected"));
          }
        });
      });
    });
  }
  /**
   * 判断onFulfilled或者onRejected返回的 x 的值是普通值还是promise对象
   * 如果是普通值 直接调用resolve
   * 如果是promise对象 查看promsie对象返回的结果
   * 再根据promise对象返回的结果 决定调用resolve 还是调用reject
   * @param {*} promise2
   * @param {*} x
   * @param {*} resolve
   * @param {*} reject
   * @returns
   */
  static resolvePromise(promise2, x, resolve, reject) {
    // 避免循环引用：确保 promise2 不能直接或间接引用自身，否则会造成循环引用，这会导致无限递归。
    if (promise2 === x) {
      return reject(new TypeError("Chaining cycle detected for promise"));
    }

    let called = false;

    if (x != null && (typeof x === "object" || typeof x === "function")) {
      try {
        const then = x.then;
        // 处理thenable对象
        if (typeof then === "function") {
          then.call(
            x,
            (y) => {
              if (called) return;
              called = true;
              Promise.resolvePromise(promise2, y, resolve, reject);
            },
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
}
