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
	
	function update(value) {
	  var newValue = void 0;
	
	  // if frozen -> don't update
	  if (this._isFrozen) return this;
	
	  // if explicit update -> don't use reducer/inputs
	  // else if -> set new value to undefined
	  // else -> use reducer/inputs to update
	  if (typeof value !== 'undefined') {
	    newValue = value;
	  } else if (typeof this._reducer !== 'function') {
	    newValue = undefined;
	  } else {
	    newValue = this._reducer.apply(this, _toConsumableArray(this._inputs.map(function (input) {
	      return input.valueOf();
	    })));
	  }
	
	  // if new value is undefined -> don't update, don't notify
	  //  note: new value is undefined when (given no explicit value)...
	  //    (1) reducer is not a function
	  //    (2) reducer returned an undefined value
	  if (typeof newValue === 'undefined') return this;
	  this._value = newValue;
	
	  // notify
	  //  if not quiet -> notify
	  //  that is: if quiet -> don't notify
	  if (!this._isQuiet) this._listeners.forEach(function (listener) {
	    return listener.update();
	  });
	
	  return this;
	}
	
	function setReducer(reducerFn) {
	  if (arguments.length > 1) throw new Error('expected single argument');
	  if (typeof reducerFn !== 'function') throw new TypeError('expected a function');
	  this._reducer = reducerFn;
	  return this;
	}
	
	function setInput() {
	  for (var _len = arguments.length, inputs = Array(_len), _key = 0; _key < _len; _key++) {
	    inputs[_key] = arguments[_key];
	  }
	
	  this._inputs = inputs;
	  return this;
	}
	
	function listenTo() {
	  var _this = this;
	
	  for (var _len2 = arguments.length, liveValues = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	    liveValues[_key2] = arguments[_key2];
	  }
	
	  liveValues.forEach(function (liveValue) {
	    if (!liveValue.hasOwnProperty('_listeners') || !Array.isArray(liveValue._listeners)) {
	      throw new TypeError('Expected a live value');
	    }
	    liveValue._listeners.push(_this);
	    return liveValue;
	  });
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
	  update: update,
	  setReducer: setReducer,
	  setInput: setInput,
	  setInputs: setInput,
	  listenTo: listenTo,
	  freeze: freeze,
	  unfreeze: unfreeze,
	  quiet: quiet,
	  unquiet: unquiet
	};
	
	function itsAlive() {
	  var initialValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
	
	  return Object.assign(Object.create(prototype), {
	    _value: initialValue,
	    _reducer: null,
	    _inputs: [],
	    _listeners: [],
	    _isFrozen: false,
	    _isQuiet: false
	  });
	}
	
	exports.default = itsAlive;

/***/ }
/******/ ])
});
;
//# sourceMappingURL=itsAlive.js.map