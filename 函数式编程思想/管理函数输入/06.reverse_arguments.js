export function reverseArgs(fn) {
  return function argsReversed(...args) {
    return fn(...args.reverse());
  };
}
