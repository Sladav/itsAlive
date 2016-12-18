import itsAlive from '../src'
import {expect} from 'chai'

//clear test console
console.log('\x1Bc')

describe('itsAlive', () => {

  it('is a function', () => {
    expect(itsAlive).to.be.a('function')
  })

  it('returns an "alive" value', () => {
    // duck type to determine if living value
    const properties = [
      'value',
      'reducer',
      'inputs',
      'listeners',
      'isFrozen',
      'isQuiet'
    ]

    const methods = [
      'valueOf',
      'update',
      'setReducer',
      'setInput',
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

})

describe('living value', () => {

  it('has the correct default values', () => {
    const value = itsAlive()

    expect(value.value).to.equal(null)
    expect(value.valueOf()).to.equal(null)

    expect(value.reducer).to.equal(null)
    expect(value.inputs).to.deep.equal([])
    expect(value.listeners).to.deep.equal([])
    expect(value.isFrozen).to.equal(false)
    expect(value.isQuiet).to.equal(false)
    
  })



})
