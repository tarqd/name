var Name = require('./index')

var obj = {}
var hidden = new Name('foo')

obj[hidden] = 'bar'

console.log(obj, Object.keys(obj), Object.getOwnPropertyNames(obj), obj[hidden])