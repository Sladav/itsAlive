
function valueOf() {
  return this._value
}

function update(value) {
  let newValue

  // if frozen -> don't update
  if(this._isFrozen) return this

  // if explicit update -> don't use reducer/inputs
  // else if -> set new value to undefined
  // else -> use reducer/inputs to update
  if(typeof value !== 'undefined') {
    newValue = value
  } else if(typeof this._reducer !== 'function') {
    newValue = undefined
  } else {
    newValue = this._reducer(...this._inputs.map(input=>input.valueOf()))
  }

  // if new value is undefined -> don't update, don't notify
  //  note: new value is undefined when (given no explicit value)...
  //    (1) reducer is not a function
  //    (2) reducer returned an undefined value
  if(typeof newValue === 'undefined') return this
  this._value = newValue

  // notify
  //  if not quiet -> notify
  //  that is: if quiet -> don't notify
  if(!this._isQuiet) this.notify()

  return this
}

function notify() {
  this._listeners.forEach(listener=>{
    listener.trigger._value = this
    listener.update()
  })
  return this
}

function reducer(reducerFn) {
  if(arguments.length > 1) throw new Error('expected single argument')
  if(typeof reducerFn !== 'function') throw new TypeError('expected a function')
  this._reducer = reducerFn
  return this
}

function input(...inputs) {
  this._inputs = inputs
  return this
}

function listenTo(...liveValues) {
  liveValues.forEach((liveValue) => {
    if(!liveValue.hasOwnProperty('_listeners') || !Array.isArray(liveValue._listeners)) {
      throw new TypeError('Expected a live value')
    }
    liveValue._listeners.push(this)
    return liveValue
  })
  return this
}

function listenToInput(...inputs) {
  this.input(...inputs)
  this.listenTo(...inputs)
  return this
}

function freeze() {
  this._isFrozen = true
  return this
}

function unfreeze() {
  this._isFrozen = false
  return this
}

function quiet() {
  this._isQuiet = true
  return this
}

function unquiet() {
  this._isQuiet = false
  return this
}

const prototype = {
  valueOf,
  update,
  notify,
  reducer,
  input,
  inputs: input,
  listenTo,
  listenToInput,
  listenToInputs: listenToInput,
  freeze,
  unfreeze,
  quiet,
  unquiet
}

function itsAlive(initialValue = null) {
  return Object.assign(Object.create(prototype), {
    _value: initialValue,
    _reducer: null,
    _inputs: [],
    _listeners: [],
    _isFrozen: false,
    _isQuiet: false,
    trigger: {
      _value: null,
      valueOf() { return this._value }
    }
  })
}

export default itsAlive
