
function valueOf() {
  return this.value
}

function update() {}

function setReducer(reducerFn) {

}

function setInput() {}

function listenTo() {}

function freeze() {
  this.isFrozen = true
}

function unfreeze() {
  this.isFrozen = false
}

function quiet() {
  this.isQuiet = true
}

function unquiet() {
  this.isQuiet = false
}

const prototype = {
  valueOf,
  update,
  setReducer,
  setInput,
  listenTo,
  freeze,
  unfreeze,
  quiet,
  unquiet
}

function itsAlive(initialValue = null) {
  return Object.assign(Object.create(prototype), {
    value: initialValue,
    reducer: null,
    inputs: [],
    listeners: [],
    isFrozen: false,
    isQuiet: false
  })
}

export default itsAlive
