import * as helpers from './helpers'

var plainObjectConstructor = {}.constructor.toString()
function isCustomType(object) {
  var constructorString = object.constructor.toString()

  return constructorString !== plainObjectConstructor
}

function isExternalType(object) {
  // react elements are not plain objects, but they are not custom types either
  // can't deep copy them
  return object.$$typeof && object.$$typeof.toString().includes('react.')
}

function copy(object) {
  var i, result // iterator, types array, result

  if (object && typeof object == 'object') {
    switch (true) {
      case helpers.isDate(object):
        result = new Date(object)
        break
      case helpers.isArray(object):
        result = new Array(object.length)
        for (i = 0; i < object.length; i++) {
          result[i] = copy(object[i])
        }
        break
      /*		case (helpers.isStringObject(object)):
				result = new String(object);
				break;
			case (helpers.isNumberObject(object)):
				result = new Number(object);
				break;
			case (helpers.isBooleanObject(object)):
				result = new Boolean(object);
				break;*/
      default:
        if (isCustomType(object)) {
          result = Object.create(object)
        } else if (isExternalType(object)) {
          result = object
          return result
        } else {
          result = {}
        }

        for (i in object) {
          if (Object.prototype.hasOwnProperty.apply(object, [i])) result[i] = copy(object[i])
        }
        break
    }
  }
  return result || object
}

function mixin(target, source, force) {
  for (var f in source) if (target[f] === undefined || force) target[f] = source[f]
  return target
}

function defined(obj) {
  return typeof obj != 'undefined'
}

var seed
function uid() {
  if (!seed) seed = new Date().valueOf()

  seed++
  return seed
}

//creates function with specified "this" pointer
function bind(functor, object) {
  if (functor.bind) return functor.bind(object)
  else
    return function () {
      return functor.apply(object, arguments)
    }
}

function event(el, event, handler, capture) {
  if (el.addEventListener) el.addEventListener(event, handler, capture === undefined ? false : capture)
  else if (el.attachEvent) el.attachEvent('on' + event, handler)
}

function eventRemove(el, event, handler, capture) {
  if (el.removeEventListener) el.removeEventListener(event, handler, capture === undefined ? false : capture)
  else if (el.detachEvent) el.detachEvent('on' + event, handler)
}

export { copy, defined, mixin, uid, bind, event, eventRemove }
