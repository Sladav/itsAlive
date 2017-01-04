(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("itsAlive", [], factory);
	else if(typeof exports === 'object')
		exports["itsAlive"] = factory();
	else
		root["itsAlive"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	function valueOf() {
	  return this._value;
	}
	
	function set(value) {
	  // if frozen -> don't set
	  if (this._isFrozen) return this;
	
	  // if no/undefined input -> don't set
	  if (typeof value === 'undefined') return this;
	  this._value = value;
	
	  // notify
	  //  if not quiet -> notify
	  //  that is: if quiet -> don't notify
	  if (!this._isQuiet) this.notify();
	
	  return this;
	}
	
	function update() {
	  var _this = this;
	
	  for (var _len = arguments.length, suppliedInputs = Array(_len), _key = 0; _key < _len; _key++) {
	    suppliedInputs[_key] = arguments[_key];
	  }
	
	  var newValue = void 0,
	      inputs = void 0,
	      inputLength = void 0;
	
	  // if frozen -> don't update
	  if (this._isFrozen) return this;
	
	  // if inputs are supplied ->
	  //    temporarily overwrite defined inputs with any supplied inputs
	  // else just use defined inputs
	  if (suppliedInputs.length > 0) {
	    inputLength = Math.max(this._inputs.length, suppliedInputs.length);
	    inputs = [].concat(_toConsumableArray(Array(inputLength))).map(function (_, index) {
	      return typeof suppliedInputs[index] !== 'undefined' ? suppliedInputs[index] : _this._inputs[index];
	    });
	  } else {
	    inputs = this._inputs;
	  }
	
	  // calculate new value by applying inputs to reducer
	  newValue = this._reducer.apply(this, _toConsumableArray(inputs.map(function (input) {
	    return input.valueOf();
	  })));
	
	  // if new value is undefined -> don't update, don't notify
	  //  note: new value is undefined when reducer returned an undefined value
	  if (typeof newValue === 'undefined') return this;
	  this._value = newValue;
	
	  // notify
	  //  if not quiet -> notify
	  //  that is: if quiet -> don't notify
	  if (!this._isQuiet) this.notify();
	
	  return this;
	}
	
	function notify() {
	  var _this2 = this;
	
	  this._listeners.forEach(function (listener) {
	    listener.trigger._value = _this2;
	    listener.update();
	  });
	  return this;
	}
	
	function reducer(reducerFn) {
	  if (arguments.length > 1) throw new Error('expected single argument');
	  if (typeof reducerFn !== 'function') throw new TypeError('expected a function');
	  this._reducer = reducerFn;
	  return this;
	}
	
	function input() {
	  for (var _len2 = arguments.length, inputs = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	    inputs[_key2] = arguments[_key2];
	  }
	
	  this._inputs = inputs;
	  return this;
	}
	
	function listenTo() {
	  var _this3 = this;
	
	  for (var _len3 = arguments.length, liveValues = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
	    liveValues[_key3] = arguments[_key3];
	  }
	
	  liveValues.forEach(function (liveValue) {
	    if (!liveValue.hasOwnProperty('_listeners') || !Array.isArray(liveValue._listeners)) {
	      throw new TypeError('Expected a live value');
	    }
	    liveValue._listeners.push(_this3);
	    return liveValue;
	  });
	  return this;
	}
	
	function listenToInput() {
	  this.input.apply(this, arguments);
	  this.listenTo.apply(this, arguments);
	  return this;
	}
	
	function freeze() {
	  this._isFrozen = true;
	  return this;
	}
	
	function unfreeze() {
	  this._isFrozen = false;
	  return this;
	}
	
	function quiet() {
	  this._isQuiet = true;
	  return this;
	}
	
	function unquiet() {
	  this._isQuiet = false;
	  return this;
	}
	
	var prototype = {
	  valueOf: valueOf,
	  set: set,
	  update: update,
	  notify: notify,
	  reducer: reducer,
	  input: input,
	  inputs: input,
	  listenTo: listenTo,
	  listenToInput: listenToInput,
	  listenToInputs: listenToInput,
	  freeze: freeze,
	  unfreeze: unfreeze,
	  quiet: quiet,
	  unquiet: unquiet
	};
	
	function itsAlive() {
	  var initialValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
	
	  return Object.assign(Object.create(prototype), {
	    _value: initialValue,
	    _reducer: function _reducer(x) {
	      return x;
	    },
	    _inputs: [],
	    _listeners: [],
	    _isFrozen: false,
	    _isQuiet: false,
	    trigger: {
	      _value: null,
	      valueOf: function valueOf() {
	        return this._value;
	      }
	    }
	  });
	}
	
	exports.default = itsAlive;

/***/ }
/******/ ])
});
;
//# sourceMappingURL=itsAlive.js.map