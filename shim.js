var Name = require('./index')
var isPublic = Name.isPublic
// keep track of the unshimmed versions of these functions
var defineProperty = Object.defineProperty
var getProps = Object.getOwnPropertyNames
var getDesc = Object.getOwnPropertyDescriptor
var propIsEnumerable = Object.prototype.propIsEnumerable


var shims = {}
var originals = {getOwnPropertyNames: getProps, getOwnPropertyDescriptor: getDesc, '$propertyIsEnumerable': getProps, defineProperty: defineProperty}
shims.defineProperty = function(obj, prop, desc) {
	if(prop instanceof Name) {
		return prop.defineProperty(obj, prop, desc)
	}
}

shims.getOwnPropertyNames = function(obj) {
	return getProps(obj).filter(isPublic)
}

/*
 * We don't really need these shims because these functions only work
 * if the real private name is leaked which can only happen with getOwnPropertyNames
 */ 
/*
shims.getOwnPropertyDescriptor = function(obj, name){
	if(isPublic(name)) return getDesc(obj, name)
	else return undefined
}

shims.$propertyIsEnumerable = function(name){
	if(isPublic(name)) return propIsEnumerable.call(this, name)
	else return false
}
*/

exports.shims = shims
exports.install = function(){
	Object.keys(shims).forEach(apply, shims)
}

exports.uninstall = function(){
	Object.keys(shims).forEach(apply, originals)
}

function apply (key)	{	
	var fn = this[key]
	var target = Object
	if(key.substr(0, 1) == '$'){
		key = key.substr(1)
		target = Object.prototype
	}
	target[key] = fn
}
