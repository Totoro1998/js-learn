const PENDING = "pending";
const REJECTED = "rejected";
const FULFILLED = "fulfilled";

// 错误捕获
class MyPromise {
  constructor(executor) {
    // 捕获执行器中的错误
    try {
      executor(this.resolve, this.reject);
    } catch (e) {
      this.reject(e);
    }
  }
  status = PENDING;
  value = undefined;
  reason = undefined;
  resolve_callbacks = [];
  reject_callbacks = [];

  // 定义为箭头函数是因为resolve和reject在myPromise实例中调用时会指向undefined或window。
  // 改为箭头函数this绑定当前myPromise实例。
  resolve = (value) => {
    if (this.status !== PENDING) {
      return;
    }
    this.status = FULFILLED;
    this.value = value;
    while (this.resolve_callbacks.length) {
      this.resolve_callbacks.shift()();
    }
    // this.resolve_callbacks.forEach((callback) => callback(this.value));
  };
  reject = (reason) => {
    if (this.status !== PENDING) {
      return;
    }
    this.status = REJECTED;
    this.reason = reason;
    while (this.reject_callbacks.length) {
      this.reject_callbacks.shift()();
    }
    // this.reject_callbacks.forEach((callback) => callback(this.reason));
  };

  static resolve() {}
  static reject() {}
  static any() {}
  static all(arr) {
    let result = [];
    let index = 0;
    return new MyPromise((resolve, reject) => {
      function add_data(key, value) {
        result[key] = value;
        index++;
        if (index === arr.length) {
          resolve(result);
        }
      }
      for (let i = 0; i < arr.length; i++) {
        let current = arr[i];
        if (current instanceof MyPromise) {
          current.then(
            (value) => {
              add_data(i, value);
            },
            (reason) => {
              reject(reason);
            }
          );
        } else {
          // 普通值
          add_data(i, arr[i]);
        }
      }
    });
  }
  static allSettled() {}
  static race() {}

  then(resolve_callback, reject_callback) {
    resolve_callback = resolve_callback ? resolve_callback : (value) => value;
    reject_callback = reject_callback
      ? reject_callback
      : (reason) => {
          throw reason;
        };
    let return_promise = new MyPromise((resolve, reject) => {
      if (this.status === FULFILLED) {
        //为了解决循环返回自身问题，采用微任务队列异步操作，可以拿到return_promise
        queueMicrotask(() => {
          try {
            // 如果result是普通值，直接调用resolve。
            // 如果result是MyPromise实例，需要查看result的状态status，status如果是FULFILLED，就调用resolve把成功的状态传给return_promise对象。如果是REJECTED，就调用reject方法。
            let result = resolve_callback(this.value);
            resolve_promise(return_promise, result, resolve, reject);
          } catch (e) {
            //如果resolve_callback报错，需要把报错信息传递给下一个promise
            reject(e);
          }
        });
      } else if (this.status === REJECTED) {
        queueMicrotask(() => {
          try {
            let result = reject_callback(this.reason);
            resolve_promise(return_promise, result, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      } else {
        this.resolve_callbacks.push(() => {
          queueMicrotask(() => {
            try {
              // 如果result是普通值，直接调用resolve。
              // 如果result是MyPromise实例，需要查看result的状态status，status如果是FULFILLED，就调用resolve把成功的状态传给return_promise对象。如果是REJECTED，就调用reject方法。
              let result = resolve_callback(this.value);
              resolve_promise(return_promise, result, resolve, reject);
            } catch (e) {
              //如果resolve_callback报错，需要把报错信息传递给下一个promise
              reject(e);
            }
          });
        });
        this.reject_callbacks.push(() => {
          queueMicrotask(() => {
            try {
              let result = reject_callback(this.reason);
              resolve_promise(return_promise, result, resolve, reject);
            } catch (e) {
              reject(e);
            }
          });
        });
      }
    });
    return return_promise;
  }
  catch(reject_callback) {}
  finally(callback) {}
}

function resolve_promise(return_promise, x, resolve, reject) {
  if (return_promise === x) {
    return reject(
      new TypeError("Chaining cycle detected for promise #<Promise>")
    );
  }
  if (x instanceof MyPromise) {
    x.then(resolve, reject);
  } else {
    resolve(x);
  }
}
