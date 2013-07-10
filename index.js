/**
 * Private Name ES.next shim
 * Allows you to define hidden properties on objects
 * With the ES.next Name API
 * @module private-name
 */
var id 							= 0
	, prefix 					= '\u2063\u2063\u2063'
	, expando 				= generateName('NameHelper')
	, currentProperty = undefined
	, storage 				= generateName('NameStorage')
	, defineProperty 	= Object.defineProperty
	, exports 				= module.exports = Name

/**
 * Simple Private Names shim 
 * @param {string} publicName string to use for .valueOf() and the private properties internal name
 */
function Name(publicName) {
	var name = generateName(publicName)

	this.valueOf = function() {
		return publicName || '[object Name]'
	}

	this.toString = function(usePublic){
		if(usePublic) return this.valueOf()
		currentProperty = name
		return expando
	}

	this.defineProperty = function(obj, prop, desc){
		init(obj)
		if(typeof desc.get == 'function') createContext(desc.get)
		if(typeof desc.get == 'function') createContext(desc.set)
		return defineProperty(obj[storage], prop, desc)
	}
}

Name.isPublic =
function isPublic(name) {
	if(name instanceof Name) return false;
	else return name.substr(0, prefix.length) != prefix
}

Name.isPrivate =
function isPrivate(name){
	return !isPublic(name)
}

/*!
 * This is where the magic happens
 * Define a hidden property on Object.prototype 
 * Because Name#toString returns the expando string this is called every time a private name is accessed
 */
defineProperty(Object.prototype, expando, {
	enumerable: false,
	configurable: false,
	get: function() {
		var name = init(this)
		return name && this[storage][name]
	},
	set: function(value) {
		var name = init(this)
		if(name) this[storage][name] = value
	}
})

/*!
 * utility methods
 */
 
/**
 * generates a unique name for the property
 * @param  {String} str used for prettier names
 * @return {String} unique name
 */
function generateName(str) {
	var uid = (++id).toString() + Date.now()
		, str = str ? '<Private ' + str + ':' + uid + '>' : uid
	return prefix + str
}

/**
 * Creates a wrapper function to fix the context for getters/setters
 * @param  {Function} fn function to wrap
 * @return {Function} wrapped function      
 */
// new Function returns a function because it doesn't have to worry about this closures scope
var createWrapper = new Function('fn', 'return fn.bind(this.context)')
function createContext(fn) {
	return createWrapper(fn)
}
/**
 * Helper method, unsets the currentProperty flag and creates storage if nessarry
 * @param  {Object} self 
 * @return {String} name of the property or undefined if there was an error     
 */
function init(self) {
	var name = currentProperty
	currentProperty = undefined
	if(typeof self.hasOwnProperty != 'function') return undefined
	if(!self.hasOwnProperty(storage))
		createStorage(self, storage)
	return name
}

/**
 * Defines a new property on the object to store hidden fields
 * @param  {Object} self 
 * @param  {String} name 
 */
function createStorage(self, name) {
	defineProperty(self, name, {enumerable: false, configurable: true, value: {context: self}, writable: false})
}




