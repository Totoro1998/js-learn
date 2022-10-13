function add(a, b, c) {
  return a + b + c;
}
function curried_add(a) {
  return function (b) {
    return function (c) {
      return a + b + c;
    };
  };
}

export function curry(fn, arity = fn.length) {
  return (function nextCurried(prevArgs) {
    return function curried(nextArg) {
      var args = [...prevArgs, nextArg];
      //如果参数个数大于等于最初的fn.length，则结束递归调用，调用fn函数；否则继续收集参数
      if (args.length >= arity) {
        return fn(...args);
      } else {
        //将收集到的参数传递给nextCurried
        return nextCurried(args);
      }
    };
  })([]);
}

//Currying More Than One Argument
export function looseCurry(fn, arity = fn.length) {
  return (function nextCurried(prevArgs) {
    return function curried(...nextArgs) {
      var args = [...prevArgs, ...nextArgs];

      if (args.length >= arity) {
        return fn(...args);
      } else {
        return nextCurried(args);
      }
    };
  })([]);
}
//Order Matters
export function curryProps(fn, arity = 1) {
  return (function nextCurried(prevArgsObj) {
    return function curried(nextArgObj = {}) {
      var [key] = Object.keys(nextArgObj);
      var allArgsObj = Object.assign({}, prevArgsObj, {
        [key]: nextArgObj[key],
      });

      if (Object.keys(allArgsObj).length >= arity) {
        return fn(allArgsObj);
      } else {
        return nextCurried(allArgsObj);
      }
    };
  })({});
}

function foo({ x, y, z } = {}) {
  console.log(`x:${x} y:${y} z:${z}`);
}

var f1 = curryProps(foo, 3);
f1({ y: 2 })({ x: 1 })({ z: 3 });

export function uncurry(fn) {
  return function uncurried(...args) {
    var ret = fn;

    for (let arg of args) {
      ret = ret(arg);
    }

    return ret;
  };
}
