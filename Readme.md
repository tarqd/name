# name

  A very simple ES.next Private Name shim. 
  Using the private `Name` object you can define hidden properties that no other code can access without the associated `Name` object
  This might be useful for storing meta data (like jQuery.data) or for creating a WeakMap shim
  
  It works fairly well without any monkey-patching (though it does need to create one non-enumerable property on Object.prototype but it's much less intrusive than replacing functions. The variable name is random and uses unicode characters so the chances of conflicts are slim to none)
  This is the least intrusive and most accurate shim for private names that I know of, if you find a way to make it better feel free to make a pull request!
## Installation

  Install with [component(1)](http://component.io):
  
    $ component install ilsken/name
    
  Install with [npm](https://npmjs.org/):
  
    $ npm install --save private-name

## Usage (with component or node.js)
```javascript
var Name = require('name') // use `require('private-name')` for node
var myObject = {}

// you can also use new Name('something') to create a friendlier name for debugging tools which can see hidden properties
var hiddenProperty = new Name()

// you can assign values directly using the hiddenProperty object
myObject[hiddenProperty] = 'foo'

// but the property is automatically non-enumerable and the real name of the property is never exposed 
console.log(myObject) // {}

// you can still access the value
console.log(myObject[hiddenProperty]) // "foo"

// but calls to hasOwnProperty and the like will fail (don't worry the property is still assigned to this object, not a prototype)
console.log(myObject.hasOwnProperty(hiddenProperty)) // false

console.log(Object.keys(myObject)) // []

## Usage in the browser (without component)
```html
<script src="dist/name.js"></script>
<script>
  var hiddenProperty = new Name()
  // etc
```

## Gotchas

While this shim for the most part works without any monkey-patching there are currently a couple ways to leak the private properties names. If you want to fix those leaks you can use the patches below

#### Object.getOwnPropertyNames(object) 
`Object.getOwnPropertyNames` will leak the private names of the variables. Because they use invisble unicode characters the chances of conflict are very slim but if you really want to make sure no one else can access the hidden variable names you can apply this patch
```javascript
var props = Object.getOwnPropertyNames
function getOwnPropertyNames(obj){
	return props(obj).filter(Name.isPublic)
}
Object.getOwnPropertyNames = getOwnPropertyNames
```

### Object.hasOwnProperty(Object.prototype, hiddenProperty)
If you define hidden properties on Object.prototype the method we use to hide doesn't work. I don't know why you would define hidden properties on the prototype but just in case here's how you'd patch this leak

```javascript
var has = Object.hasOwnProperty
function hasOwnProperty(obj, prop){
	return Name.isPublic(prop) && has(obj, prop)
}
```



## License

  MIT
