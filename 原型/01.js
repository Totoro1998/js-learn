function Person() {
  this.name = "fk";
  this.age = 25;
}

const person = new Person();

console.log(Reflect.getPrototypeOf(Person) === Person.prototype); //false
console.log(Reflect.getPrototypeOf(person) === Person.prototype); // true
console.log(Reflect.getPrototypeOf(Person) === Function.prototype); //true
