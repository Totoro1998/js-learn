export function isUndefined(val) {
  return val === undefined;
}

export const isArray = Array.isArray.bind(Array);

/**
 * 要判断一个值是否为对象数据类型，不能用instanceof操作符来判断，
 * 因为有两种假阴性（False negative）的情况。
 * @param {*} val
 * @returns
 */
function isObject(val) {
  return val instanceof Object;
}
isObject(Object.prototype); //false
isObject(Object.create(null)); //false

//不能用typeof操作符来判断，因为有假阳性（False positive）
//的情况：null，和假阴性的情况：函数和宿主对象
function isObject(val) {
  return typeof val === "object";
}
isObject(null); //true

/**
 *
 * Object作为普通函数使用时，能够接收任何类型的参数值。
 * 假如参数是简单数据类型，则返回它的包装对象；假如参数是对象，则返回它本身；假如参数是undefined或null，
 * 则返回一个空对象。
 * @param {*} val
 * @returns
 */
export function isObject(val) {
  return val === Object(val);
}
