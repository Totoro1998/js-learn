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

  static resolve(value) {
    if (value instanceof MyPromise) {
      return value;
    } else {
      return new MyPromise((resolve, reject) => {
        resolve(value);
      });
    }
  }
  static reject(reason) {
    return new MyPromise((resolve, reject) => {
      reject(reason);
    });
  }
  // 一个成功就成功，全部失败才失败
  static any(arr) {
    let rejected_arr = [];
    let rejected_times = 0;
    return new MyPromise((resolve, reject) => {
      for (let i = 0; i < arr.length; i++) {
        const current = arr[i];
        if (current instanceof MyPromise) {
          current.then(resolve, (reason) => {
            rejected_arr[i] = reason;
            rejected_times++;
            if (rejected_times === arr.length) {
              reject(rejected_arr);
            }
          });
        } else {
          resolve(current);
        }
      }
    });
  }
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
  static allSettled() {
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
              add_data(i, {
                status: FULFILLED,
                value,
              });
            },
            (reason) => {
              add_data(i, {
                status: REJECTED,
                reason,
              });
            }
          );
        } else {
          // 普通值
          add_data(i, arr[i]);
        }
      }
    });
  }
  static race(arr) {
    return new MyPromise((resolve, reject) => {
      for (let i = 0; i < arr.length; i++) {
        let current = arr[i];
        if (current instanceof MyPromise) {
          current.then(resolve, reject);
        } else {
          resolve(current);
        }
      }
    });
  }

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
  catch(reject_callback) {
    return this.then(undefined, reject_callback);
  }
  finally(callback) {
    return this.then(
      (value) => {
        return MyPromise.resolve(callback()).then(() => value);
      },
      (reason) => {
        return MyPromise.resolve(callback()).then(() => {
          throw reason;
        });
      }
    );
  }
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
