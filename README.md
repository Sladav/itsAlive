# itsAlive
Dead simple FRP.

### Overview

**itsAlive** is mostly an experiment in a different way to define a variable. It proposes a middle-ground approach between assignment (one-time definition) and equality (forever-in-sync) that allows you to explicitly define **how** and **when** your values mutate.

**itsAlive** hopefully adds tangibility to functional reactive programming (FRP) and makes FRP easier and more accesible to programmers who are new to it.

&nbsp;

### Installation & Usage

*Installation*

**NPM** &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; `npm install --save its-alive`

**CDN** &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; https://unpkg.com/its-alive@0.4.1

&nbsp;

*Usage*

**ES6** &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`import itsAlive from 'itsAlive'`

**CDN** &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`<script src="https://unpkg.com/its-alive@0.4.1">`

&nbsp;

### Contents

[Motivation/Concept](#motivationconcept)
- [#](#equality) Equality
- [#](#assignment) Assignment
- [#](#reactive-updating) Reactive Updating

[Main API](#main-api)

[Tutorial (in examples)](#tutorial-in-examples)

&nbsp;

## Motivation/Concept

This section looks at three different ways to relate two variables, <a href="https://www.codecogs.com/eqnedit.php?latex=a" target="_blank"><img src="https://latex.codecogs.com/gif.latex?a" title="a" /></a> and <a href="https://www.codecogs.com/eqnedit.php?latex=b" target="_blank"><img src="https://latex.codecogs.com/gif.latex?b" title="b" /></a> via a function, <a href="https://www.codecogs.com/eqnedit.php?latex=f" target="_blank"><img src="https://latex.codecogs.com/gif.latex?f" title="f" /></a>.

I'll write this vague idea of a "relationship" like this...

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="https://www.codecogs.com/eqnedit.php?latex=b&space;\sim&space;a" target="_blank"><img src="https://latex.codecogs.com/gif.latex?b&space;\sim&space;a" title="b \sim a" /></a>

Then, if we want to see **how** they are related, we can introduce some function, <a href="https://www.codecogs.com/eqnedit.php?latex=f" target="_blank"><img src="https://latex.codecogs.com/gif.latex?f" title="f" /></a> that defines the **how** part.

How do we define the  **when**?

#### Equality

In mathematics, we can write it as an **equality** relationship like this...

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="https://www.codecogs.com/eqnedit.php?latex=b&space;=&space;f(a)" target="_blank"><img src="https://latex.codecogs.com/gif.latex?b&space;=&space;f(a)" title="b = f(a)" /></a>

Without having to worry about real-worldly implementation details, the **when** part is easily defined: **always**.

[This blog post](http://paulstovell.com/blog/reactive-programming) (not mine), does a good job of explaining what this would look like if this existed as an alternative to the assignment operator. A summary:

```
var f = x => x + 1
var a = 10
var b <= f(a)			// The "destiny" operator, implementing equality
a = 20
Assert.AreEqual(21, b)	// true
```

**how**:  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;f(x)

**when**:  &nbsp;&nbsp;always


#### Assignment

When programming, we typically use **assignment**.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="https://www.codecogs.com/eqnedit.php?latex=b&space;:=&space;f(a)" target="_blank"><img src="https://latex.codecogs.com/gif.latex?b&space;:=&space;f(a)" title="b := f(a)" /></a>

or in JavaScript

```js
let b = f(a)
```

The relationship between <a href="https://www.codecogs.com/eqnedit.php?latex=a" target="_blank"><img src="https://latex.codecogs.com/gif.latex?a" title="a" /></a> and <a href="https://www.codecogs.com/eqnedit.php?latex=b" target="_blank"><img src="https://latex.codecogs.com/gif.latex?b" title="b" /></a> is easily broken! When <a href="https://www.codecogs.com/eqnedit.php?latex=a" target="_blank"><img src="https://latex.codecogs.com/gif.latex?a" title="a" /></a> changes, <a href="https://www.codecogs.com/eqnedit.php?latex=b" target="_blank"><img src="https://latex.codecogs.com/gif.latex?b" title="b" /></a> doesn't.

```js
let f = x => x + 1
let a = 10
let b = f(a)	// 11
a = 20
console.log(b)	// 11, not 21  :(
```

**how**:  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;f(x)

**when**:  &nbsp;&nbsp;at assignment

#### Reactive Updating

The "relationship" used by **itsAlive** lets you explicitly specify the **when**.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="https://www.codecogs.com/eqnedit.php?latex=b&space;\overset{a}{\leftarrow}&space;f(a)" target="_blank"><img src="https://latex.codecogs.com/gif.latex?b&space;\overset{a}{\leftarrow}&space;f(a)" title="b \overset{a}{\leftarrow} f(a)" /></a>

When <a href="https://www.codecogs.com/eqnedit.php?latex=a" target="_blank"><img src="https://latex.codecogs.com/gif.latex?a" title="a" /></a> changes/updates, reassign <a href="https://www.codecogs.com/eqnedit.php?latex=f(a)" target="_blank"><img src="https://latex.codecogs.com/gif.latex?f(a)" title="f(a)" /></a> to <a href="https://www.codecogs.com/eqnedit.php?latex=b" target="_blank"><img src="https://latex.codecogs.com/gif.latex?b" title="b" /></a>.  It's worth nothing that this is effectively the equality relationship defined above - <a href="https://www.codecogs.com/eqnedit.php?latex=b" target="_blank"><img src="https://latex.codecogs.com/gif.latex?b" title="b" /></a> is always kept updated because it is recalculated every time its only dependency, <a href="https://www.codecogs.com/eqnedit.php?latex=a" target="_blank"><img src="https://latex.codecogs.com/gif.latex?a" title="a" /></a>, is changed.

This relation decouples the **how** and the **when**. For instance, if we have a third variable, <a href="https://www.codecogs.com/eqnedit.php?latex=c" target="_blank"><img src="https://latex.codecogs.com/gif.latex?c" title="c" /></a>, we could make <a href="https://www.codecogs.com/eqnedit.php?latex=b" target="_blank"><img src="https://latex.codecogs.com/gif.latex?b" title="b" /></a> react to <a href="https://www.codecogs.com/eqnedit.php?latex=c" target="_blank"><img src="https://latex.codecogs.com/gif.latex?c" title="c" /></a>, but still define <a href="https://www.codecogs.com/eqnedit.php?latex=b" target="_blank"><img src="https://latex.codecogs.com/gif.latex?b" title="b" /></a> in terms of <a href="https://www.codecogs.com/eqnedit.php?latex=f" target="_blank"><img src="https://latex.codecogs.com/gif.latex?f" title="f" /></a> and <a href="https://www.codecogs.com/eqnedit.php?latex=a" target="_blank"><img src="https://latex.codecogs.com/gif.latex?a" title="a" /></a>.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="https://www.codecogs.com/eqnedit.php?latex=b&space;\overset{c}{\leftarrow}&space;f(a)" target="_blank"><img src="https://latex.codecogs.com/gif.latex?b&space;\overset{c}{\leftarrow}&space;f(a)" title="b \overset{c}{\leftarrow} f(a)" /></a>

So the full **definition** of `b` is in terms of `f`, `a`, and `c`.

- `f` -- **how**
- `a` -- **how**
- `c` -- **when**

**Is this distinction useful??**

**- `b` can use itself as an input without blowing up.**

For example, imagine you have a counter that increments every time you click:

<a href="https://www.codecogs.com/eqnedit.php?latex=count&space;\overset{click}{\leftarrow}&space;count&space;&plus;&space;1" target="_blank"><img src="https://latex.codecogs.com/gif.latex?count&space;\overset{click}{\leftarrow}&space;count&space;&plus;&space;1" title="count \overset{click}{\leftarrow} count + 1" /></a>


**-`b` can be lazy.**

For example, if calculating `f(a)` is expensive, don't recalculate `b` every time `a` changes, but rather by updating `refresh` only when you need the next `b` value.

<a href="https://www.codecogs.com/eqnedit.php?latex=b&space;\overset{refresh}{\leftarrow}&space;f(a)" target="_blank"><img src="https://latex.codecogs.com/gif.latex?b&space;\overset{refresh}{\leftarrow}&space;f(a)" title="b \overset{refresh}{\leftarrow} f(a)" /></a>


### **Main API**

The goal is to do this (see above for explanation)...

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="https://www.codecogs.com/eqnedit.php?latex=b&space;\overset{c}{\leftarrow}&space;f(a)" target="_blank"><img src="https://latex.codecogs.com/gif.latex?b&space;\overset{c}{\leftarrow}&space;f(a)" title="b \overset{c}{\leftarrow} f(a)" /></a>

&nbsp;

**when c *updates***

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;apply **a** to

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;a function, **f**, and

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;assign the result to **b**

&nbsp;

**So,** the API for defining `b` is...

Initialize `b`
```js
const b = itsAlive()
```
Set the reducer function, `f`
```js
const b = itsAlive().reducer(f)
```
Set input to `a`
```js
const b = itsAlive().reducer(f).input(a)
```
Listen for updates on `c`
```js
const b = itsAlive().reducer(f).input(a).listenTo(c)
```
&nbsp;

----------------

# Tutorial (in examples)

*skip to the [Extra Examples](#extra-examples) to get a better feel for how you might use **itsAlive***

[Static Living Values](#static-living-values)
  - [#1](#1-the-default-living-value-is-a-null) The default Living Value is a `null`
  - [#2](#2-you-can-set-a-value-explicitly) You can set a value explicitly
  - [#3](#3-set-an-initial-value-by-supplying-it-to-itsalive) Set an initial value by supplying  it to `itsAlive()`
  - [#4](#4-you-get-a-living-value-with-valueof) You get a living value with `.valueOf()`
  - [#5](5-it-can-be-any-js-primitive-or-any-objectarrayfunction-cant-be-undefined) It can be any JS primitive or any object/array/function; can't be `undefined`

[Living Values with Inputs](#living-values-with-inputs)
  - [#6](#6-you-can-set-any-primitiveobject-as-an-input) You can set any primitive/object as an input
  - [#7](#7-or-use-another-living-value-as-an-input) Or use another Living Value as an input
  - [#8](#8-the-default-reducer-doesnt-really-do-anything) The default reducer doesn't really do anything
  - [#9](#9-update-applies-the-inputs-to-the-reducer-function) `update` applies the inputs to the reducer function
  - [#10](#10-bypass-defined-inputs-by-supplying-your-own-input-args-to-update) Bypass defined inputs by supplying your own input args to `update`
  - [#11](#11-note-update-and-set-are-not-the-same) Note: `update` and `set` are not the same

[Reductive Living Values](#reductive-living-values)
  - [#12](#12-a-reducer-is-a-function-associated-with-a-living-value) A `reducer` is a function associated with a Living Value
  - [#13](#13-reducers-can-have-side-effects-but-should-be-pure) Reducers can have side-effects (but should be pure)
  - [#14](#14-living-values-ignore-undefined-update-values) Living Values ignore `undefined` update values

[Reactive Living Values](#reactive-living-values)
  - [#15](#15-a-living-value-can-to-react-to-another-value-updating-by-listening-for-updates) A Living Value can to react to another value updating by listening for updates
  - [#16](#16-inputs-and-the-values-that-induce-updates-are-completely-decoupled) Inputs and the values that induce updates are completely decoupled!
  - [#17](#17-a-living-value-can-listenreact-to-its-own-inputs) A Living Value can listen/react to its own input(s)
  - [#18](#18-using-listentoinputx-is-the-same-as-listentoxinputx) Using `.listenToInput(x)` is the same as `.listenTo(x).input(x)`
  - [#19](#19-a-living-value-can-use-itself-as-an-input) A Living Value can use itself as an input
  - [#20](#20-but-it-should-not-listenreact-to-itself) But it should NOT listen/react to itself

[Synchronously Updating Living Values](#synchronously-updating-living-values)
  - [#21](#21-update-using-a-for-loop) Update using a for loop
  - [#22](#22-update-using-array-map) Update using array map

[Asynchronously Updating Living Values](#asynchronously-updating-living-values)
  - [#23](#23-update-using-a-timer) Update using a timer
  - [#24](#24-make-a-dom-event-trigger-an-update) Make a DOM event trigger an update
  - [#25](#25-make-a-promise-trigger-an-update) Make a Promise trigger an update

[Ways to stop values from updating](#ways-to-stop-values-from-updating)
  - [#26](#26-you-can-freeze-a-living-value) You can freeze a Living Value
  - [#27](#27-you-can-quiet-a-living-value) You can quiet a Living Value

[Map, Filter, Fold (Reduce), Buffer](#map-filter-fold-reduce-buffer)
  - [#28](#28-map) Map
  - [#29](#29-filter) Filter
  - [#30](30-fold-reduce) Fold (Reduce)
  - [#31](31-buffer) Buffer

[Using a Living Value's `.trigger` property](#using-a-living-values-trigger-property)
  - [#32](#32-the-value-that-triggered-the-update-is-available-on-trigger) The value that triggered the update is available on `.trigger`
  - [#33](#33-use-trigger-as-an-input-to-merge-values) Use `.trigger` as an input to merge values

[Extra Examples](#extra-examples)
  - [#34](#34-a-counter) A counter
  - [#35](#35-drag-and-drop) Drag and drop

## Static Living Values

### 1. The default Living Value is a `null`

[[view code](http://codepen.io/sladav/pen/WRbxJL?editors=0011)]
```js
const a = itsAlive()
console.log( a.valueOf() )    // null
```

### 2. You can set a value explicitly

[[view code](http://codepen.io/sladav/pen/GrgqGx?editors=0011)]
```js
const a = itsAlive().set(5)
console.log( a.valueOf() )    // 5
```

### 3. Set an initial value by supplying it to `itsAlive()`

[[view code](http://codepen.io/sladav/pen/XpJKBm?editors=0011)]
```js
const a = itsAlive(5)
console.log( a.valueOf() )    // 5
```

is the same as

```js
const a = itsAlive().set(5)
console.log( a.valueOf() )    // 5
```

### 4. You get a living value with `.valueOf()`

[[view code](http://codepen.io/sladav/pen/dNPXjR?editors=0011)]
```js
const a = itsAlive().set(5)

console.log( a.valueOf() )    // 5
```

Most binary operators use `valueOf()` too:
```
+ - * / %
& | ^ << >> >>>
< <= > >=
```

Which means you can also do this...
```js
const a = itsAlive().set(5)

console.log( a.valueOf() )    // 5
console.log( +a )             // 5
console.log( a + 1 )          // 6

```

### 5. It can be any JS primitive or any object/array/function; can't be `undefined`

[[view code](http://codepen.io/sladav/pen/MJYeqg?editors=0011)]
###### **null**
```js
const a = itsAlive().set(null)
console.log( a.valueOf() )    // null
```

###### **number**
```js
const b = itsAlive().set(5)
console.log( b.valueOf() )    // 5
```

###### **string**
```js
const c = itsAlive().set('str')
console.log( c.valueOf() )    // 'str'
```

###### **boolean**
```js
const d = itsAlive().set(true)
console.log( d.valueOf() )    // true
```

###### **array (object)**
```js
const e = itsAlive().set([1,2,3])
console.log( e.valueOf() )    // [1,2,3]
```

###### **function (object)**
```js
function addOne(a) { return a+1 }
const f = itsAlive().set(addOne)
console.log( f.valueOf() )    // addOne
```

###### or any **object**
```js
const g = itsAlive().set({first: 'Bob', last: 'Roberts'})
console.log( g.valueOf() )    // {first: 'Bob', last: 'Roberts'}
```

## Living Values with **Inputs**

### 6. You can **set any primitive/object** as an **input**

[[view code](http://codepen.io/sladav/pen/KawMxL?editors=0011)]
```js
const a = itsAlive().input(5).update()
console.log( a.valueOf() )    // 5
```

### 7. Or use another Living Value as an input

[[view code](http://codepen.io/sladav/pen/ZLYOqY?editors=0011)]
```js
const b = itsAlive(5)
const a = itsAlive().input(b).update()
console.log( a.valueOf() )    // 5
```

### 8. The **default reducer** doesn't really do anything

**It's an identity function.** It just passes the first input through as a value.

So,

[[view code](http://codepen.io/sladav/pen/oBgLaw?editors=0011)]
```js
const a = itsAlive().input(5)

```

is the same as

```js
const b = itsAlive().input(5).reducer( x => x )
```

### 9. `update` applies the inputs to the reducer function

[[view code](http://codepen.io/sladav/pen/rjaLQO?editors=0011)]
```js
const a = itsAlive().input(5)
console.log( a.valueOf() )    // null --- the default value

a.update()
console.log( a.valueOf() )    // 5 -- the result of passing 5 to the identity reducer
```

### 10. Bypass defined inputs by supplying your own input args to `update`

... but it does not redefine the inputs. Do this with caution.

[[view code](http://codepen.io/sladav/pen/OWPXao?editors=0011)]
```js
const a = itsAlive().input(5)

a.update(7)
console.log( a.valueOf() )    // 7 -- the result of passing 7 to the identity reducer

a.update()
console.log( a.valueOf() )    // 5 -- the result of passing 5 to the identity reducer
```

### 11. Note: `update` and `set` are not the same

`update` applies the inputs (or supplied input args) to the reducer, while

`set` bypasses both inputs and reducer and sets the value directly.

[[view code](http://codepen.io/sladav/pen/KawMrj?editors=0011)]
```js
const addOne = x => x + 1
const a = itsAlive().input(5).reducer(addOne)

a.update()
console.log( a.valueOf() )    // 6 -- the result of passing 5 to `addOne`

a.update(7)
console.log( a.valueOf() )    // 8 -- the result of passing 7 to `addOne`

a.set(15)
console.log( a.valueOf() )    // 15 -- did not use the reducer
```


## Reductive Living Values
... know ***how*** to reduce a set of inputs into a value.

### 12. A `reducer` is a function associated with a Living Value

When a living value is updated the reducer function takes the Living Value inputs and returns a new value.

[[view code](http://codepen.io/sladav/pen/GrgqPd?editors=0011)]
```js
const addOne = x => x + 1
const timesTwo = x => 2*x

const [a,b,c] = [...Array(3)].map(itsAlive)

a.set(1)                        // a is just 1; no input, no reducer
b.input(a).reducer(addOne)      // b uses addOne; b is a+1
c.input(b).reducer(timesTwo)    // c uses timesTwo; c is 2*b

// note: update manually because values are not yet reactive...
b.update()
c.update()

console.log( b.valueOf() )        // 2  = a + 1 = 2
console.log( c.valueOf() )        // 4  = 2 * b = 4
```

### 13. Reducers can have side-effects (but should be pure)

Here's two examples of a logger - they log to the console as a side-effect.

[[view code](http://codepen.io/sladav/pen/pRvbqM?editors=0011)]
**non-reactive**
```js
const logger = x => console.log(x)
const a = itsAlive(0)
const aLog = itsAlive().input(a).reducer(logger)

aLog.update()   // logs 0 (the value of a)
a.set(1)
aLog.update()   // logs 1 (the new value of a)
```

**reactive**
```js
const logger = x => console.log(x)
const b = itsAlive(0)
const bLog = itsAlive().listenToInput(b).reducer(logger)

b.set(1)    // logs 1 to console
b.set(2)    // logs 2 to console
```

### 14. Living Values ignore `undefined` update values

[[view code](http://codepen.io/sladav/pen/ygyJwL?editors=0011)]
```js
const doNothing = x => {}

const a = itsAlive(0)
const b = itsAlive(1).input(a).reducer(doNothing)

a.set(1)
b.update()
console.log( b.valueOf() )  // still 1 (not undefined)
```

## Reactive Living Values
... know ***when*** to reduce a set of inputs into a value.

### 15. A Living Value can to react to another value updating by listening for updates

[[view code](http://codepen.io/sladav/pen/EZayMg?editors=0011)]
```js
const a = itsAlive(0)
const b = itsAlive(1).listenTo(a).reducer( () => 7 )

// when a updates
a.update(0)

// b automatically updates too
console.log( b.valueOf() )  // 7
```

### 16. Inputs and the values that induce updates are completely decoupled!

[[view code](http://codepen.io/sladav/pen/xgbEgX?editors=0011)]
```js
const addOne = x => x + 1
const a = itsAlive('init')
const b = itsAlive(0)
const c = itsAlive().listenTo(a).input(b).reducer(addOne)

// c is initially null
console.log( c.valueOf() )  // null

// manually updating c, reduces b with addOne
c.update()
console.log( c.valueOf() )  // 1  -  b is 0, b+1 is 1

// updating b does not automatically update c
b.update(1)
console.log( c.valueOf() )  // still 1

// but updating a DOES automatically update c (with latest b as input)
a.update('this text does not matter')
console.log( c.valueOf() )  // 2  -  b is 1, b+1 is 2
```

### 17. A Living Value can listen/react to its own input(s)

[[view code](http://codepen.io/sladav/pen/vgEXgz?editors=0011)]
```js
const addOne = x => x + 1
const a = itsAlive(0)
const b = itsAlive(1).listenTo(a).input(a).reducer(addOne)

// when a updates, b updates
a.update(1)
console.log( b.valueOf() )  // 2

a.update(2)
console.log( b.valueOf() )  // 3

a.update(3)
console.log( b.valueOf() )  // 4
```

### 18. Using `.listenToInput(x)` is the same as `.listenTo(x).input(x)`

[[view code](http://codepen.io/sladav/pen/BpyLpe?editors=0011)]
```js
const addOne = x => x + 1
const a = itsAlive(0)
const b = itsAlive(1).listenToInput(a).reducer(addOne)

a.update(1)
console.log( b.valueOf() )  // 2
```

### 19. A Living Value can use itself as an input

[[view code](http://codepen.io/sladav/pen/pRvEeg?editors=0011)]
```js
const addOne = x => x + 1
const a = itsAlive(0)

a.input(a).reducer(addOne)

a.update()
console.log( a.valueOf() )  // 1

a.update()
console.log( a.valueOf() )  // 2

a.update()
console.log( a.valueOf() )  // 3
```

### 20. But it should NOT listen/react to itself

[[view code](http://codepen.io/sladav/pen/pRvEPg?editors=0011)]
If it listens/reacts to itself it will immediately infinitely recurse!

```js
const addOne = x => x + 1
const a = itsAlive(0)

a.input(a).reducer(addOne)

a.listenTo(a)

// error!
a.update()    // when a updates it updates a which updates a which updates a which....
```

### Synchronously updating Living Values

### 21. Update using a for loop

[[view code](http://codepen.io/sladav/pen/jyEMYW?editors=0011)]
```js
const addOne = x => x + 1
const timesTwo = x => 2 * x
const logger = x => console.log(x)

const [a, b, c, log] = [...Array(4)].map(itsAlive)

b.listenToInput(a).reducer(addOne)
c.listenToInput(b).reducer(timesTwo)
log.listenToInput(c).reducer(logger)

console.log('before')

for (let counter = 0; counter <= 2; counter++) {
  a.update(counter)   
  // counter = 0 -> a = 0 -> b = 0 + 1 = 1 -> c = 2 * 1 = 2
  // counter = 1 -> a = 1 -> b = 1 + 1 = 2 -> c = 2 * 2 = 4
  // counter = 2 -> a = 2 -> b = 2 + 1 = 3 -> c = 2 * 3 = 6
}

console.log('after')

// console:
//    'before'
//    2
//    4
//    6
//    'after'
```

### 22. Update using array map

[[view code](http://codepen.io/sladav/pen/RKNGxE?editors=0011)]
```js
const addOne = x => x + 1
const timesTwo = x => 2 * x
const logger = x => console.log(x)

const [a, b, c, log] = [...Array(4)].map(itsAlive)

b.listenToInput(a).reducer(addOne)
c.listenToInput(b).reducer(timesTwo)
log.listenToInput(c).reducer(logger)

console.log('before')

[0, 1, 2].map( x => a.update(x) )
// x = 0 -> a = 0 -> b = 0 + 1 = 1 -> c = 2 * 1 = 2
// x = 1 -> a = 1 -> b = 1 + 1 = 2 -> c = 2 * 2 = 4
// x = 2 -> a = 2 -> b = 2 + 1 = 3 -> c = 2 * 3 = 6

console.log('after')

// console:
//    'before'
//    2
//    4
//    6
//    'after'
```

### Asynchronously updating Living Values

### 23. Update using a timer

[[view code](http://codepen.io/sladav/pen/pRvNBZ?editors=0011)]
```js
const addOne = x => x + 1
const timesTwo = x => 2 * x
const logger = x => console.log(x)

const [a, b, c, log] = [...Array(4)].map(itsAlive)

b.listenToInput(a).reducer(addOne)
c.listenToInput(b).reducer(timesTwo)
log.listenToInput(c).reducer(logger)

console.log('before')

setTimeout( () => a.update(0), 1000)
setTimeout( () => a.update(2), 2000)
a.update(1)

console.log('after')

// console:
//    'before'
//    4
//    'after'
//    2     **after 1 second**
//    6     **after 2 seconds**
```

### 24. Make a DOM event trigger an update

[[view code](http://codepen.io/sladav/pen/LxEboE?editors=0011)]
```js
const addOne = x => x + 1
const timesTwo = x => 2 * x
const logger = x => console.log(x)

const [a, b, c, log] = [...Array(4)].map(itsAlive)

b.listenToInput(a).reducer(addOne)
c.listenToInput(b).reducer(timesTwo)
log.listenToInput(c).reducer(logger)

document.addEventListener('click', event => a.update(event.clientX))

// for each mouse click console logs 2 * (cursor's xPos + 1)
```

### 25. Make a Promise trigger an update

[[view code](http://codepen.io/sladav/pen/EZaNzB?editors=0011)]
```js
const logger = x => console.log(x)

const [user, email, emailLog, err, errLog] = [...Array(5)].map(itsAlive)

email.listenToInput(user).reducer( u => u.email )
emailLog.listenToInput(email).reducer(logger)
errLog.listenToInput(err).reducer(logger)

fetch('http://jsonplaceholder.typicode.com/users/1')
  .then(r => r.json())
  .then(u => user.update(u), (e) => err.update(e))

setTimeout(()=>{
  fetch('http://jsonplaceholder.typicode.com/users/2')
    .then(r => r.json())
    .then(u => user.update(u), e => err.update(e))
}, 2000)
```

## Ways to stop values from updating

### 26. You can freeze a Living Value

Frozen values cannot be updated. In turn, values listening to the frozen value will not be notified/updated.

[[view code](http://codepen.io/sladav/pen/RKNoXo?editors=0011)]
```js
const addOne = x => x + 1
const a = itsAlive(3)
const b = itsAlive(0).listenToInput(a).reducer(addOne)

a.freeze()
a.update(5)                 // ignored
console.log(a.valueOf())    // still 3
console.log(b.valueOf())    // still 0

a.unfreeze()
a.update(5)                 // updates `a` to 5, updates `b` to 6
console.log(a.valueOf())    // 5
console.log(b.valueOf())    // 6
```

### 27. You can quiet a Living Value
Quieted values can be updated, but will not notify/update values that are listening to it.

[[view code](http://codepen.io/sladav/pen/wgBoVP?editors=0011)]
```js
const addOne = x => x + 1
const a = itsAlive(3)
const b = itsAlive(0).listenToInput(a).reducer(addOne)

a.quiet()
a.update(5)                 // updates `a` to 5, `b` is not notified, not updated
console.log(a.valueOf())    // 5
console.log(b.valueOf())    // still 0

a.unquiet()
a.update(7)                 // updates `a` to 7, `b` updates to 8
console.log(a.valueOf())    // 7
console.log(b.valueOf())    // 8
```

## Map, Filter, Fold (Reduce), Buffer

### 28. Map

Setting a reducer in itsAlive is essentially setting a map function. The primary difference between the reducer you set in itsAlive and a map function is that map is strictly 1-to-1, whereas the reducer you set for a living value can be many-to-1; your many inputs are reduced to a single value (rather than being mapped from one value to another).

[[view code](http://codepen.io/sladav/pen/rjaWXR?editors=0011)]
```js
const logger = x => console.log(x.valueOf())
const addOne = x => x + 1
const add = (x, y) => x + y

const a = itsAlive().input(5).reducer(addOne)
const b = itsAlive().inputs(5,a).reducer(add)

const log = itsAlive()
log.listenTo(a,b).input(log.trigger).reducer(logger)


const c = [ 5 ]

a.update()                      //  6
console.log(c.map(addOne))      //  [ 6 ]

b.update()                      //  11
```

### 29. Filter

In itsAlive, you can selectively ignore (aka filter) updates to an input by designing your reducer to return `undefined` where appropriate.

[[view code](http://codepen.io/sladav/pen/MJYJwZ?editors=0011)]
```js
const logger = x => console.log(x)
const addOne_if_under10 = x => { if( x < 10) return x + 1 }

const [a, b, bLog] = [...Array(3)].map(itsAlive)

b.listenToInput(a).reducer(addOne_if_under10)
bLog.listenToInput(b).reducer(logger)

a.update(5)       // logs 6
a.update(7)       // logs 8

a.update(2500)    // does not log since b was not updated (2500 >= 10)
console.log('does not log 2500')

console.log( b.valueOf() )  // still 8
```

### 30. Fold (Reduce)

Fold, reduce (as in `Array.prototype.reduce`), accumulate, aggregate are all different names for a higher-order function that, given a series of values, successively modifies an accumulated value with the current value in the series.

itsAlive allows you to fold/reduce changes to a value over time by using a second Living Value as an accumulator. The accumulator can maintain a memory of length 1 by using itself as one of its inputs.

[[view code](http://codepen.io/sladav/pen/JEoEGd?editors=0011)]
```js
const logger = x => console.log(x)
const sum = (x, agg) => x + agg
const [a, aggregate, aggLog] = [...Array(3)].map(itsAlive)

aggregate.listenTo(a).inputs(a, aggregate).reducer(sum)
aggLog.listenToInput(aggregate).reducer(logger)

a.update(1)   // logs 1
a.update(2)   // logs 3   since 3 = 2 + 1 = a + agg
a.update(3)   // logs 6   since 6 = 3 + 3 = a + agg
```

### 31. Buffer

To maintain a history of past values, simply create a living array that listens to a value whose reducer function pushes updates to the living array.

[[view code](http://codepen.io/sladav/pen/BpypjJ?editors=0011)]
```js
const logger = x => console.log(x)
const record = (val, arr) => {
  arr.push(val)
  return arr
}
const [a, history, log] = [...Array(3)].map(itsAlive)

history.set([])
  .inputs(a, history)
  .listenTo(a)
  .reducer(record)

log.listenToInput(history).reducer(logger)

a.update(1)   // logs [1]
a.update(2)   // logs [1,2]
a.update(3)   // logs [1,2,3]
```
You can modify the reducer on history to enforce rules. For example, you could add a check like if(arr.length < 10) to only take the first 10 values, or implement a queue structure to keep the 10 latest values.

## Using a Living Values `.trigger` property

### 32. The value that triggered the update is available on `.trigger`

[[view code](http://codepen.io/sladav/pen/xgbgRG?editors=0011)]
```js
const logger = x => console.log(x)
const addOne = x => x + 1

const [a, b, c, merged] = [...Array(5)].map(itsAlive)

merged.listenTo(a,b,c)

a.update(1)
console.log(merged.trigger.valueOf())   //  1

b.update(2)
console.log(merged.trigger.valueOf())   //  2

c.update(3)
console.log(merged.trigger.valueOf())   //  3
```

### 33. Use `.trigger` as an input to merge values

[[view code](http://codepen.io/sladav/pen/NdPdaL?editors=0011)]
```js
const logger = x => console.log(x)
const addOne = x => x + 1

const [a, b, c, merged, log] = [...Array(5)].map(itsAlive)

merged.listenTo(a,b,c).input(merged.trigger).reducer(addOne)
log.listenToInput(merged).reducer(logger)

// The merged value uses whatever triggered `merged` to update as its input
a.update(2)   // 3
b.update(5)   // 6
a.update(1)   // 2
c.update(4)   // 5
```

## Extra Examples

### 34. A counter

uses some jquery, but it doesn't have to

[[view code](http://codepen.io/sladav/pen/RKwxJm?editors=1010)]
```html
<div>
    <h1 id="count"></h1>
    <button id="inc">+1</button>
    <button id="dec">-1</button>
    <p />
    <button id="inc2">+2</button>
    <button id="dec2">-2</button>
    <h4>note: by design, ± 2 only works when count is even</h4>
</div>
```
```js
// initialize living values
const [_buttonClick, count, countDom_] = [...Array(3)].map(itsAlive)

// use jquery to update `_buttonClick`
// note: using '_' prefix to indicate an "input" from the "real world"
$('button').click(evt => _buttonClick.update(evt))

count.set(0)
  .listenTo(_buttonClick)         // update count when button is clicked
  .input(count, _buttonClick)     
  .reducer((c, evt)=>{
    // for each id, define what to do with count, c
    return {
      inc: c + 1,
      dec: c - 1,
      inc2: c % 2 === 0 ? c + 2 : undefined,
      dec2: c % 2 === 0 ? c - 2 : undefined
    }[evt.target.id]
  })

// update the DOM with the count value
// note: using the '_' postfix to indicate a "side-effect"/"output" to the "real world"
countDom_.listenToInput(count)
  .reducer(count => $('#count').html(count))
  .update()
```

### 35. Drag and drop

[[view code](http://codepen.io/sladav/pen/VmoLOy)]
```js
const dragTarget = document.getElementById('dragTarget')
const [_clickXY, _dragXY, dragXY_] = [...Array(3)].map(itsAlive)

// note: using '_' prefix to indicate an "input" from the "real world"
_clickXY.reducer( target => ({x: target.offsetX, y: target.offsetY}) )  // stores click xy location
_dragXY.reducer( target => ({x: target.clientX, y: target.clientY}) )   // stores dragTarget's xy location

// _dragXY, the state storing the XY location of the dragTarget, is initially frozen (cannot update)
//    mousedown on the dragTarget unfreezes _dragXY, allowing it to be updated
//    mouseup re-freezes _dragXY, preventing it from updating
_dragXY.freeze()
dragTarget.onmousedown = evt => {
  _dragXY.unfreeze()
  _clickXY.update(evt)
}
document.onmouseup = evt => _dragXY.freeze()
document.onmousemove = evt => _dragXY.update(evt)

// update the dragTarget's top, left properties
// note: using the '_' postfix to indicate a "side-effect"/"output" to the "real world"
dragXY_.listenTo(_dragXY)
  .input(dragTarget, _dragXY, _clickXY)
  .reducer((target, dragXY, clickXY)=>{
    target.style.left = `${dragXY.x - clickXY.x}px`
    target.style.top = `${dragXY.y - clickXY.y}px`
  })
```


# License

MIT
