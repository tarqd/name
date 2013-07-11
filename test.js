var Name = require('./index')


var props = Object.getOwnPropertyNames
function getOwnPropertyNames(obj){
	return props(obj).filter(Name.isPublic)
}
Object.getOwnPropertyNames = getOwnPropertyNames

var obj = {cocks: true}
var hidden = new Name('foo')
var prop = new Name('test')
obj[hidden] = 'bar'
prop.define(obj, {
	enumerable: true,
	get: function(){
		console.log('hi guys!', this)
		return 'baz'
	}
})
console.log(obj, Object.keys(obj), Object.getOwnPropertyNames(obj), obj[hidden])
console.log(obj[prop])