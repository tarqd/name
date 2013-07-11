# name

  A very simple ES.next shim. It works fairly well without any monkey-patching (though it does need to create one non-enumerable property on Object.prototype but it's much less intrusive than replacing functions. The variable name is random and uses unicode characters so the chances of conflicts are slim to none)

## Installation

  Install with [component(1)](http://component.io):

    $ component install ilsken/name

## Usage (with component or node.js)
```javascript
var Name = require('name')
var myObject = {}
// you can also use new Name('something') to create a friendlier name for debugging tools which can see hidden properties

var hiddenProperty = new Name()

myObject[hiddenProperty] = 'foo'

console.log(myObject) // {}
console.log(myObject[hiddenProperty]) // "foo"
console.log(myObject.hasOwnProperty(hiddenProperty)) // false
console.log(Object.keys(myObject)) // []

## Usage (plain script tags)
```html
<script src="dist/name.js"></script>
<script>
  var hiddenProperty = new Name()
  // etc
```

## Gotchas

While this shim for the most part works without any monkey-patching there are currently a couple ways to leak the private properties names. If you want to fix those leaks you can use the patches below

#### Object.propertyNames(object) 
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
