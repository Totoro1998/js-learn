const PENDING = "pending";
const REJECTED = "rejected";
const FULFILLED = "fulfilled";

class MyPromise {
  constructor(executor) {
    executor(this.resolve, this.reject);
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
      this.resolve_callbacks.shift()(this.value);
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
      this.reject_callbacks.shift()(this.reason);
    }
    // this.reject_callbacks.forEach((callback) => callback(this.reason));
  };

  static resolve() {}
  static reject() {}
  static any() {}
  static all() {}
  static allSettled() {}
  static race() {}

  then(resolve_callback, reject_callback) {
    let return_promise = new MyPromise((resolve, reject) => {
      if (this.status === FULFILLED) {
        //为了解决循环返回自身问题，采用微任务队列异步操作，可以拿到return_promise
        queueMicrotask(() => {
          // 如果result是普通值，直接调用resolve。
          // 如果result是MyPromise实例，需要查看result的状态status，status如果是FULFILLED，就调用resolve把成功的状态传给return_promise对象。如果是REJECTED，就调用reject方法。
          let result = resolve_callback(this.value);
          resolve_promise(return_promise, result, resolve, reject);
        });
      } else if (this.status === REJECTED) {
        reject_callback(this.reason);
      } else {
        this.resolve_callbacks.push(resolve_callbacks);
        this.reject_callbacks.push(reject_callback);
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
