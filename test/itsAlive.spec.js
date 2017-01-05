import itsAlive from '../src'
import {expect} from 'chai'

function untested(){
  return expect('tested').to.be.true
}

//clear test console
console.log('\x1Bc')

describe('itsAlive', () => {

  it('is a function', () => {
    expect(itsAlive).to.be.a('function')
  })

  it('returns an "alive" value', () => {
    // duck type to determine if living value
    const properties = [
      '_value',
      '_reducer',
      '_inputs',
      '_listeners',
      '_isFrozen',
      '_isQuiet',
      'trigger'
    ]

    const methods = [
      'valueOf',
      'set',
      'update',
      'reducer',
      'input',
      'listenTo',
      'freeze',
      'unfreeze',
      'quiet',
      'unquiet'
    ]

    const value = itsAlive()
    const keys = Object.keys(value)

    expect(keys).to.have.lengthOf(properties.length)

    function valueHasProperty(prop) {
      expect(value).to.have.property(prop)
    }

    properties.forEach(valueHasProperty)

    function valueHasMethod(prop) {
      expect(value).to.have.property(prop)
      expect(value[prop]).to.be.a('function')
    }

    methods.forEach(valueHasMethod)

  })

  it('can set an initial value', () => {
    const value = itsAlive(0)

    expect(value.valueOf()).to.equal(0)
  })

})

describe('living value', () => {

  it('has the correct default values', () => {
    const value = itsAlive()

    expect(value._value).to.equal(null)
    expect(value.valueOf()).to.equal(null)

    expect(value._reducer.toString())
      .to.equal('function _reducer(x) {\n      return x;\n    }')
    expect(value._inputs).to.deep.equal([])
    expect(value._listeners).to.deep.equal([])
    expect(value._isFrozen).to.equal(false)
    expect(value._isQuiet).to.equal(false)

  })

})

describe('explicitly setting value', () => {

  it('sets the correct value', () => {
    const value = itsAlive()

    value.set(0)

    expect(value.valueOf()).to.equal(0)
  })

  it('bypasses the reducer', () => {
    const value = itsAlive().reducer(()=>1)

    value.set(0)

    expect(value.valueOf()).to.equal(0)
  })

  it('notifies listeners', () => {
    const value = itsAlive()
    const updated = itsAlive(false)
      .listenTo(value)
      .reducer(()=>true)

    value.set(1)

    expect(updated.valueOf()).to.true
  })

  it('allows method chaining', () => {
    const value = itsAlive()

    expect(value.set(0)).to.equal(value)
  })

})

describe('setting the reducer', () => {

  it('only accepts a single function', () => {
    const value = itsAlive()

    expect(()=>value.reducer()).to.throw()
    expect(()=>value.reducer(0)).to.throw()
    expect(()=>value.reducer(false)).to.throw()
    expect(()=>value.reducer('test')).to.throw()
    expect(()=>value.reducer([])).to.throw()
    expect(()=>value.reducer({})).to.throw()

    expect(()=>value.reducer(()=>{})).to.not.throw()

    expect(()=>value.reducer(()=>{},()=>{})).to.throw()
  })

  it('exposes the reducer on the "_reducer" property', () => {
    const value = itsAlive()
    const identity = x => x
    value.reducer(identity)

    expect(value._reducer).to.equal(identity)
  })

  it('allows method chaining', () => {
    const value = itsAlive()
    const identity = x => x

    expect(value.reducer(identity)).to.equal(value)
  })

})

describe('setting the inputs', () => {

  it('stores variadic arguments to "_inputs" property as an array', () => {
    const value = itsAlive()
    let a=1, b={a:1}, c=[1,2,3], d=()=>{return true}
    value.input(a, b, c, d)

    expect(value._inputs).to.be.deep.equal([a,b,c,d])
  })

  it('allows method chaining', () => {
    const value = itsAlive()
    let a=1, b={a:1}, c=[1,2,3], d=()=>{return true}

    expect(value.input(a, b, c, d)).to.be.equal(value)
  })

})

describe('listening to other live values', () => {

  it('throws error if other is not listenable', () => {
    const a = itsAlive('a')
    const b = itsAlive('b')

    expect(()=>a.listenTo(0)).to.throw()
    expect(()=>a.listenTo(false)).to.throw()
    expect(()=>a.listenTo('test')).to.throw()
    expect(()=>a.listenTo({})).to.throw()
    expect(()=>a.listenTo([])).to.throw()
    expect(()=>a.listenTo(()=>{})).to.throw()

    expect(()=>a.listenTo(b)).to.not.throw()
    expect(()=>a.listenTo({_listeners:[]})).to.not.throw()
  })

  it('adds listeners to the "listeners" array property', () => {
    const a = itsAlive('a')
    const b = itsAlive('b')
    const c = itsAlive('c')
    a.listenTo(b,c)

    expect(b._listeners).to.include(a)
    expect(c._listeners).to.include(a)
  })

  it('allows method chaining', () => {
    const a = itsAlive('a')
    const b = itsAlive('b')
    const c = itsAlive('c')

    expect(a.listenTo(b,c)).to.be.equal(a)
  })

})

describe('listenToInput convenience function', () => {

  it('stores variadic arguments to "_inputs" property as an array', () => {
    const value = itsAlive()
    let a=itsAlive(1),
        b=itsAlive({a:1}),
        c=itsAlive([1,2,3]),
        d=itsAlive(()=>{return true})
    value.listenToInput(a, b, c, d)

    expect(value._inputs).to.be.deep.equal([a,b,c,d])
  })

  it('throws error if other is not listenable', () => {
    const a = itsAlive('a')
    const b = itsAlive('b')

    expect(()=>a.listenToInput(0)).to.throw()
    expect(()=>a.listenToInput(false)).to.throw()
    expect(()=>a.listenToInput('test')).to.throw()
    expect(()=>a.listenToInput({})).to.throw()
    expect(()=>a.listenToInput([])).to.throw()
    expect(()=>a.listenToInput(()=>{})).to.throw()

    expect(()=>a.listenToInput(b)).to.not.throw()
    expect(()=>a.listenToInput({_listeners:[]})).to.not.throw()
  })

  it('adds listeners to the "listeners" array property', () => {
    const a = itsAlive('a')
    const b = itsAlive('b')
    const c = itsAlive('c')
    a.listenToInput(b,c)

    expect(b._listeners).to.include(a)
    expect(c._listeners).to.include(a)
  })

  it('allows method chaining', () => {
    const a = itsAlive('a')
    const b = itsAlive('b')
    const c = itsAlive('c')

    expect(a.listenToInput(b,c)).to.be.equal(a)
  })

})

describe('notifying listeners', () => {

  it('sets "trigger" on listeners', () => {
    const value = itsAlive(0)
    const updated = itsAlive(false)
      .listenTo(value)
      .reducer(()=>true)

    value.notify()

    expect(updated.trigger._value).to.equal(value)
  })

  it('notifies listeners', () => {
    const value = itsAlive(0)
    const updated = itsAlive(false)
      .listenTo(value)
      .reducer(()=>true)

    value.notify()

    expect(updated.valueOf()).to.true
  })

  it('allows method chaining', () => {
    const value = itsAlive(0)
    const updated = itsAlive(false)
      .listenTo(value)
      .reducer(()=>true)

    expect(value.notify()).to.equal(value)
  })

})

describe('trigger value', () => {

  it('allows for merging of two or more values', () => {
    const odds = itsAlive(1)
    const evens = itsAlive(2)

    const both = itsAlive()
    both.listenTo(odds, evens)
      .input(both.trigger)

    odds.set(3)
    expect(both.valueOf()).to.equal(3)

    evens.set(4)
    expect(both.valueOf()).to.equal(4)

    odds.set(57)
    expect(both.valueOf()).to.equal(57)
  })
})

describe('updating with default/identity reducer', () => {

  it('is equivalent to setting a value', () => {
    const value = itsAlive()

    value.update(5)
    expect(value.valueOf()).to.equal(5)
  })

})

describe('updating a value', () => {

  it('updates with partially supplied inputs', () => {
    const value = itsAlive()
      .inputs(1,1,1)
      .reducer((x,y,z) => x+y+z)

    // no supplied inputs
    value.update()
    expect(value.valueOf()).to.equal(3)

    // fully supplied inputs
    value.update(2,2,2)
    expect(value.valueOf()).to.equal(6)

    // partially supplied inputs
    value.update(undefined,2)
    expect(value.valueOf()).to.equal(4)
  })

  it('does not affect inputs', () => {
    const value = itsAlive()
      .inputs(1,1,1)
      .reducer((x,y,z) => x+y+z)

    // fully supplied inputs
    value.update(2,2,2)
    expect(value.valueOf()).to.equal(6)

    // no supplied inputs
    value.update()
    expect(value.valueOf()).to.equal(3)
  })

})


describe('freezing a value', () => {

  it('sets "_isFrozen" to true', () => {
    const value = itsAlive(0)
    value.freeze()

    expect(value._isFrozen).to.be.true
  })

  it('allows method chaining', () => {
    const value = itsAlive(0)

    expect(value.freeze()).to.equal(value)
  })

  it('prevents a value from being updated', () => {
    const value = itsAlive(0)
    value.freeze()
    value.update(1)

    expect(value.valueOf()).to.equal(0)
  })

  it('update attempts do not notify', () => {
    const value = itsAlive(0)
    const updated = itsAlive(false)
      .listenTo(value)
      .reducer(()=>true)

    value.freeze()
    value.update(1)

    expect(updated.valueOf()).to.false
  })

  describe('can be unfrozen', () => {

    it('sets "_isFrozen" to false', () => {
      const value = itsAlive(0)

      value.freeze()
      expect(value._isFrozen).to.be.true

      value.unfreeze()
      expect(value._isFrozen).to.be.false
    })

    it('allows method chaining', () => {
      const value = itsAlive(0)

      value.freeze()
      expect(value.unfreeze()).to.equal(value)
    })

    it('can be updated again', () => {
      const value = itsAlive(0)

      value.freeze()
      value.update(1)
      expect(value.valueOf()).to.equal(0)

      value.unfreeze()
      value.update(1)
      expect(value.valueOf()).to.equal(1)
    })

    it('will notify listeners again', () => {
      const value = itsAlive(0)
      const updated = itsAlive(false)
        .listenTo(value)
        .reducer(()=>true)

      value.freeze()
      value.update(1)
      expect(updated.valueOf()).to.false

      value.unfreeze()
      value.update(1)
      expect(updated.valueOf()).to.true
    })

  })

})

describe('quieting a value', () => {

  it('sets "_isQuiet" to true', () => {
    const value = itsAlive(0)
    value.quiet()

    expect(value._isQuiet).to.be.true
  })

  it('allows method chaining', () => {
    const value = itsAlive(0)

    expect(value.quiet()).to.equal(value)
  })

  it('can still be updated', () => {
    const value = itsAlive(0)
    value.quiet()
    value.update(1)

    expect(value.valueOf()).to.equal(1)
  })

  it('update attempts do not notify', () => {
    const value = itsAlive(0)
    const updated = itsAlive(false)
      .listenTo(value)
      .reducer(()=>true)

    value.quiet()
    value.update(1)

    expect(updated.valueOf()).to.false
  })

  describe('can be unquieted', () => {

    it('sets "_isQuiet" to false', () => {
      const value = itsAlive(0)

      value.quiet()
      expect(value._isQuiet).to.be.true

      value.unquiet()
      expect(value._isQuiet).to.be.false
    })

    it('allows method chaining', () => {
      const value = itsAlive(0)

      value.quiet()
      expect(value.unquiet()).to.equal(value)
    })

    it('can still be updated', () => {
      const value = itsAlive(0)

      value.quiet()
      value.update(1)
      expect(value.valueOf()).to.equal(1)

      value.unquiet()
      value.update(2)
      expect(value.valueOf()).to.equal(2)
    })

    it('will notify listeners again', () => {
      const value = itsAlive(0)
      const updated = itsAlive(false)
        .listenTo(value)
        .reducer(()=>true)

      value.quiet()
      value.update(1)
      expect(updated.valueOf()).to.false

      value.unquiet()
      value.update(1)
      expect(updated.valueOf()).to.true
    })

  })

})
