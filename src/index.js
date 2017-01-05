
function valueOf() {
  return this._value
}

function set(value) {
  // if frozen -> don't set
  if(this._isFrozen) return this

  // if no/undefined input -> don't set
  if(typeof value === 'undefined') return this
  this._value = value

  // notify
  //  if not quiet -> notify
  //  that is: if quiet -> don't notify
  if(!this._isQuiet) this.notify()

  return this
}

function update(...suppliedInputs) {
  let newValue, inputs, inputLength

  // if frozen -> don't update
  if(this._isFrozen) return this

  // if inputs are supplied ->
  //    temporarily overwrite defined inputs with any supplied inputs
  // else just use defined inputs
  if(suppliedInputs.length > 0) {
    inputLength = Math.max(this._inputs.length, suppliedInputs.length)
    inputs = [...Array(inputLength)].map((_, index) => {
      return typeof suppliedInputs[index] !== 'undefined' ?
        suppliedInputs[index] :
        this._inputs[index]
    })
  } else {
    inputs = this._inputs
  }

  // calculate new value by applying inputs to reducer
  newValue = this._reducer(...inputs.map(input=>input.valueOf()))

  // if new value is undefined -> don't update, don't notify
  //  note: new value is undefined when reducer returned an undefined value
  if(typeof newValue === 'undefined') return this
  this._value = newValue

  // notify
  //  if not quiet -> notify
  //  that is: if quiet -> don't notify
  if(!this._isQuiet) this.notify()

  return this
}

function notify() {
  this._listeners.forEach(listener => {
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
  set,
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
    _reducer: function (x) { return x },
    _inputs: [],
    _listeners: [],
    _isFrozen: false,
    _isQuiet: false,
    trigger: {
      _value: null,
      valueOf() { return this._value.valueOf() }
    }
  })
}

export default itsAlive
