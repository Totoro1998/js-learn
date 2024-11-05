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
    if (this.status === FULFILLED) {
      onFulfilled(this.value);
    }
    if (this.status === REJECTED) {
      onRejected(this.reason);
    }
    // 处理异步，异步处理时，onFulfilled或者onRejected处理程序会在用户调用executor的resolve或者reject函数时执行
    if (this.status === PENDING) {
      this.onFulfilledCallbacks.push(() => {
        onFulfilled(this.value);
      });
      this.onRejectedCallbacks.push(() => {
        onRejected(this.reason);
      });
    }
  }
}

const test = new Promise((resolve, reject) => {
  const flag = 3; // 1代表成功，2代表失败，3代表抛出错误
  console.log("Promise Run Start");
  setTimeout(() => {
    if (flag === 1) {
      resolve("成功了");
    } else if (flag === 2) {
      reject("失败了");
    } else {
      // 由于Promise的executor是同步执行的，所以抛出错误不会触发promise的错误处理程序
      throw new Error("抛出一个错误");
    }
  }, 1000);
});

test.then(
  (value) => {
    console.log("处理程序1成功", value);
  },
  (reason) => {
    console.log("处理程序1失败", reason);
  }
);
// 添加多个处理程序
test.then(
  (value) => {
    console.log("处理程序2成功", value);
  },
  (reason) => {
    console.log("处理程序2失败", reason);
  }
);
