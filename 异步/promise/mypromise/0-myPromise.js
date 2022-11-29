const PENDING = "pending";
const REJECTED = "rejected";
const FULFILLED = "fulfilled";

class myPromise {
  constructor(executor) {
    executor(this.resolve, this.reject);
  }
  status = PENDING;
  value = undefined;
  reason = undefined;

  // 定义为箭头函数是因为resolve和reject在myPromise实例中调用时会指向undefined或window。
  // 改为箭头函数this绑定当前myPromise实例。
  resolve = (value) => {
    if (this.status !== PENDING) {
      return;
    }
    this.status = FULFILLED;
    this.value = value;
  };
  reject = (reason) => {
    if (this.status !== PENDING) {
      return;
    }
    this.status = REJECTED;
    this.reason = reason;
  };

  static resolve() {}
  static reject() {}
  static any() {}
  static all() {}
  static allSettled() {}
  static race() {}

  then(resolve_callback, reject_callback) {
    if (this.status === FULFILLED) {
      resolve_callback(this.value);
    } else if (this.status === REJECTED) {
      reject_callback(this.reason);
    }
  }
  catch(reject_callback) {}
  finally(callback) {}
}
