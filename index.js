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

	this.define = function(obj, desc){
		// hidden properties can never enumerable
		desc.enumerable = false
		return defineProperty(obj, name, desc)
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
 * Using Object.prototype allows .hasOwnProperty(name) to return false without a shim
 */
defineProperty(Object.prototype, expando, {
	enumerable: false,
	configurable: false,
	get: function() {
		var name = init(this)
		return name && this[name]
	},
	set: function(value) {
		var name = init(this, true)
		if(name) this[name] = value
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
 * Helper method, unsets the currentProperty flag and defines the property if nessarry
 * @param  {Object} self 
 * @param {Boolean} define if set to true, a property will be created if it does not exist
 * @return {String} name of the property or undefined if there was an error     
 */
function init(self, define) {
	var name = currentProperty
	currentProperty = undefined
	if(typeof self.hasOwnProperty != 'function') return undefined
	// make sure all hidden properties are non-enumerable
	if(define && name && name != expando && !self.hasOwnProperty(name)) {
		defineProperty(self, name, {
			configurable: true,
			enumerable: false,
			writable: true,
			value: undefined
		})
	}
	return name
}




