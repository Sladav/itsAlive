# itsAlive
Dead simple FRP.

------

### Overview

**itsAlive** is an attempt to add tangibility to functional reactive programming (FRP) for the purpose of making FRP easier and more accesible to programmers who are new to it.

It does this by introducing the concept of **living values** - variables that are allowed to mutate but only do so in a controlled fashion. See [documentation](#documentation) section for more details.

### Installation

> **NPM** &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; `npm install --save its-alive`
>
> **UNPKG** &nbsp;&nbsp; https://unpkg.com/its-alive@0.2.2

### Documentation

 - [Introduction](#introduction)
	 - [The very basics](#the-very-basics)
	 - [What's the point?](#we-want-to-define-a-relationship-between-a-and-b-not-simply-assign-b-a-value)
	 - [Elements of a relationship](#elements-of-a-relationship)
	 - [**Its Alive!**](#its-alive)
 - [Basics](#basics)
	 - [What is a "living" value?](#what-is-a-living-value)
	 - [Updating a living value](#updating-a-living-value)
	 - [Set Input vs Listen To](#why-are-setinput-and-listento-separated)
	 - [Values cannot be undefined](#values-cannot-be-undefined)
	 - [Synchronous updating](#synchronous-updating)
	 - [Asynchronous updating](#asynchronous-updating)
 - [Advanced](#advanced)
   - [Freezing a value](#freezing-a-value)
	 - [Quieting a value](#quieting-a-value)
	 - [Filter](#filter)
	 - [Reduce](#reduce)
	 - [Buffer](#buffer)
 - [API](#api)
 - [Examples](#examples)


#### Introduction

#####**The very basics**

Let's start by thinking about assignment. In JavaScript, variables are assigned **by value**.

```javascript
let a = 1
let b = a + 1
...
```

First, `a`  is assigned a value of `1`.  Then...

...

... well it's tempting to think `b` is assigned `a+1`, but it is not. `a+1` is evaluated to `2` and `b` is assigned the result.

When `a` is modified, the value of `b` does not change...

```javascript
...

a = 3
console.log(b)	// still 2, not 4 (= a + 1 = 3 + 1)

...
```

If we want changes in `a` to be reflected in `b`, we could always rewrite `b = a + 1`, but that kind of sucks.

#####**We want to define a relationship between `a` and `b`, not simply assign `b` a value**

Let's leave JavaScript world and describe the relationship in Math world. In Math world, the <a href="https://www.codecogs.com/eqnedit.php?latex==" target="_blank"><img src="https://latex.codecogs.com/gif.latex?=" title="=" /></a> sign is NOT assignment. It means &nbsp;<a href="https://www.codecogs.com/eqnedit.php?latex=b" target="_blank"><img src="https://latex.codecogs.com/gif.latex?b" title="b" /></a>&nbsp; ***is*** &nbsp;<a href="https://www.codecogs.com/eqnedit.php?latex=a&plus;1" target="_blank"><img src="https://latex.codecogs.com/gif.latex?a&plus;1" title="a+1" /></a>&nbsp; (forever! even after &nbsp;<a href="https://www.codecogs.com/eqnedit.php?latex=a&plus;1" target="_blank"><img src="https://latex.codecogs.com/gif.latex?a" title="a" /></a>&nbsp; changes)...

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <a href="https://www.codecogs.com/eqnedit.php?latex=b&space;=&space;a&space;&plus;&space;1" target="_blank"><img src="https://latex.codecogs.com/gif.latex?b&space;=&space;a&space;&plus;&space;1" title="b = a + 1" /></a>

We can even abstract out the "doing stuff" part of the relationship and call it a function, &nbsp;<a href="https://www.codecogs.com/eqnedit.php?latex=f" target="_blank"><img src="https://latex.codecogs.com/gif.latex?f" title="f" /></a>&nbsp;, and let &nbsp;<a href="https://www.codecogs.com/eqnedit.php?latex=x" target="_blank"><img src="https://latex.codecogs.com/gif.latex?x" title="x" /></a>&nbsp; be some generic input...

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="https://www.codecogs.com/eqnedit.php?latex=f(x)&space;=&space;x&space;&plus;&space;1" target="_blank"><img src="https://latex.codecogs.com/gif.latex?f(x)&space;=&space;x&space;&plus;&space;1" title="f(x) = x + 1" /></a>

... and then rewrite the relationship between &nbsp;<a href="https://www.codecogs.com/eqnedit.php?latex=b" target="_blank"><img src="https://latex.codecogs.com/gif.latex?a" title="a" /></a>&nbsp; and &nbsp;<a href="https://www.codecogs.com/eqnedit.php?latex=b" target="_blank"><img src="https://latex.codecogs.com/gif.latex?b" title="b" /></a>&nbsp; to be more concise...

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <a href="https://www.codecogs.com/eqnedit.php?latex=b&space;=&space;f(a)" target="_blank"><img src="https://latex.codecogs.com/gif.latex?b&space;=&space;f(a)" title="b = f(a)" /></a>

If we go back to JavaScript world, we can write an `addOne` function, but unfortunately, this does not fix our issue of assignment - **assignment passes a value, it does not define a relationship.**

```javascript
function addOne(x) { return x + 1 }
let a = 1
let b = addOne(a)

a = 3
console.log(b)  // still 2, not 4 (= a + 1 = 3 + 1)
```

So what problem are we trying to solve? We want to define a relationship between two variables! We do not want to simply evaluate an expression (possibly containing variables) and assign the result to a new variable.

#####**Elements of a relationship**

Let's breakdown out mathematical relationship from the above section. We had...

 - &nbsp;<a href="https://www.codecogs.com/eqnedit.php?latex=b" target="_blank"><img src="https://latex.codecogs.com/gif.latex?b" title="b" /></a>&nbsp; : &nbsp;***the variable being defined***

and

 - &nbsp;<a href="https://www.codecogs.com/eqnedit.php?latex=f(x)" target="_blank"><img src="https://latex.codecogs.com/gif.latex?f(x)" title="f(x)" /></a>&nbsp; : &nbsp;***a function that takes an input value and modifies it in some way***
 - &nbsp;<a href="https://www.codecogs.com/eqnedit.php?latex=x" target="_blank"><img src="https://latex.codecogs.com/gif.latex?x" title="x" /></a>&nbsp; : &nbsp;***represents the input to f(x)***
 - &nbsp;<a href="https://www.codecogs.com/eqnedit.php?latex=a" target="_blank"><img src="https://latex.codecogs.com/gif.latex?a" title="a" /></a>&nbsp; : &nbsp;***the variable we are using to define b***

So what is `b`? It ***is*** `f(x)` where `a` is fills in the input spot `x`.

#####**It's Alive! **

Let's use **itsAlive** to define the relationship between `a` and `b`...

```javascript
function addOne(x) { return x + 1 }

// initialize a to 1
const a = itsAlive(1)

// define relationship between a and b
const b = itsAlive()
			.setReducer(addOne)  // use the addOne function for f(x)
			.listenToInput(a)    // map a to the x (first) input spot       

a.update(3)
console.log(b.valueOf())	     // b is 4! Hurrah!
```

So, when using **itsAlive**, you explicity define a "living" value as a function and it's inputs - this pairs up perfectly with the mathematical **elements of a relationship** that we defined above.

#### Basics

#####**What *is* a "living" value?**

A "living" value is a **reactive** variable that is made up of the following components

 - a **cached value** (a number, string, boolean, null, or object, including arrays and functions; typically not undefined)
 - a **reducer function**
 - a **set of inputs** to the reducer function (which can also be listened to)
 - a **set of values to listen to**

These components are grouped together in an object returned by the **itsAlive** factory function `itsAlive()`. If you inspect the living value directly, you will see the object. The **value** can be accessed through the `.valueOf()` method (which is automatically called when using most binary operators).

```javascript
const a = itsAlive(3)

console.log(a) 				// object with a bunch of props/methods
console.log(a.valueOf())	// 3
console.log(+a)				// 3 - the `+` operator called `.valueOf()`
console.log(a+1)			// 4 - the `+` operator called `.valueOf()`
```

Those pieces that make up the living value can be set using the methods on the living value.

```javascript
function addOne(x) { return x + 1}
const a = itsAlive(3)
const b = itsAlive(0)				// set initial cached value to 0
			.setReducer(addOne)     // use addOne as the reducer function
			.setInput(a)            // use the value of `a` as the input to addOne
			.listenTo(a)            // update `b` when `a` updates

// the convenience function `.listenToInput(x)` is a shorter way
// to write `.setInput(x).listenTo(x)`
...
```
Note that after the above code runs, `a` is `3` and `b` is `0`. At first this might seem strange, but living values have to be explicitly updated! If you're wondering, "then what the hell is the point?", then hopefully its worth noting that when `a` updates, it automatically notifies all values listening to it to update as well.

```javascript
...
console.log(b.valueOf()) 	// 0 - not 3 because `a` or `b` have not been updated
...
```

#####**Updating a living value**

You can update a living value by calling it's `.update()` method.

 - **Without a supplied value**  the inputs are applied to the reducer and the result is stored as the new value
 - **With a supplied value** the reducer is bypassed and the supplied value is stored as the new value

Any time a living value is updated, it automatically updates all values listening to it.

```javascript
function addOne(x) { return x + 1}
const a = itsAlive(3)
const b = itsAlive(0)				// set initial cached value to 0
			.setReducer(addOne)     // use addOne as the reducer function
			.setInput(a)            // use the value of `a` as the input to addOne
			.listenTo(a)            // update `b` when `a` updates

b.update()							// 4 -- the value of `a` (3) was applied to
console.log(b.valueOf())			// the addOne reducer function

a.update(5)							// 5 -- explicitly set `a` to 5
console.log(a.valueOf())			

// because `b` was listening to `a`, `b.update()` was called, applying the new value of `a` to the `b` reducer function, addOne.

console.log(b.valueOf()) 			// 6 									
```

##### **Why are `.setInput()` and `.listenTo()` separated?**

If you want to create a *relationship* between two variables, like...

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="https://www.codecogs.com/eqnedit.php?latex=b&space;=&space;a&space;&plus;&space;1" target="_blank"><img src="https://latex.codecogs.com/gif.latex?b&space;=&space;a&space;&plus;&space;1" title="b = a + 1" /></a>

... you want to both set `a` as an input and also listen for changes in `a`. Why have two methods for this and not just use something that does both, something like a `.listenToInput()` method. Well, actually, `.listenToInput()` *is* available as a convenience method, but it's just a shorter way to write `.setInput().listenTo()`.

So why are they separated? This gives you the additional option of updating a living value independently of it's inputs. One possible use case for this is that a value can be dependent on itself without infinitely recursing!

```javascript
function addOne(x) { return x + 1}
const a = itsAlive(3)
const b = itsAlive(0)			// set initial cached value to 0

b.setReducer(addOne)     		// use addOne as the reducer function
	.setInput(b)                // use the current `b` value to calculate new one
	.listenTo(a)                // update `b` when `a` updates

a.update(5)							
console.log(b.valueOf())		// 1

a.update(7)							
console.log(b.valueOf())		// 2

a.update(9)							
console.log(b.valueOf())		// 3  -- `b` uses addOne to increment ITSELF  
								// each time `a` is updated			
```

See the advanced section on [Reduce](#reduce) for more.


##### **Values cannot be undefined**

Living values cannot be undefined. If you want to represent that the value has no value, use `null`. So what happens if the reducer returns `undefined`?

It does nothing. It does not update the value. It does not notify it's listeners.

See the advanced section on [Filter](#filter) for more.

##### **Synchronous updating**

*to be written...*

##### **Asynchronous updating**

*to be written...*

#### Advanced

##### **Freezing a value**

Frozen values cannot be updated. In turn, values listening to the frozen value will not be notified/updated.

```javascript
function addOne(x) { return x + 1}
const a = itsAlive(3)
const b = itsAlive(0)				// set initial cached value to 0
			.setReducer(addOne)     // use addOne as the reducer function
			.setInput(a)            // use the value of `a` as the input to addOne
			.listenTo(a)            // update `b` when `a` updates

a.freeze()
a.update(5)					// ignored
console.log(a.valueOf())	// still 3
console.log(b.valueOf())	// still 0

a.unfreeze()
a.update(5)					// sets `a` to 5, updates `b` to 6
console.log(a.valueOf())	// 5
console.log(b.valueOf())	// 6								
```

##### **Quieting a value**

Quieted values can be updated, but will not notify/update values that are listening to it.

```javascript
function addOne(x) { return x + 1}
const a = itsAlive(3)
const b = itsAlive(0)				// set initial cached value to 0
			.setReducer(addOne)     // use addOne as the reducer function
			.setInput(a)            // use the value of `a` as the input to addOne
			.listenTo(a)            // update `b` when `a` updates

a.quiet()
a.update(5)					// updates `a` to 5, `b` is not updated
console.log(a.valueOf())	// 5
console.log(b.valueOf())	// still 0

a.unquiet()
a.update(7)					// sets `a` to 5, updates `b` to 6
console.log(a.valueOf())	// 7
console.log(b.valueOf())	// 8								
```

##### **Filter**

As discussed [here](#values-cannot-be-undefined), when a values reducer returns an `undefined` value, it simply does nothing. We can use this behavior to design a reducer to selectively fail to update in certain conditions, creating a filter.

```javascript
function addOne_if_under10(x) { if( x < 10) return x+1 }
const a = itsAlive(3)
const b = itsAlive(0)				// set initial cached value to 0
			.setReducer(over10)     // use over10 as the reducer function
			.setInput(a)            // use the value of `a` as the input to addOne
			.listenTo(a)            // update `b` when `a` updates

a.update(5)
console.log(b.valueOf())	// 6

a.update(7)
console.log(b.valueOf())	// 8

a.update(2500)
console.log(b.valueOf())	// still 8 -- ignored change since a >= 10						
```

Alternatively, we can separate the `addOne`  and `under10` logic by having `b` be dependent on `a` while listening to an intermediate value `isUnder10`.

```javascript
function addOne(x) { return x+1 }
function under10(x) { if(x < 10) return true }

const a = itsAlive(3)
const isUnder10 = itsAlive()
			.setReducer(under10)
			.listenToInput(a)

const b = itsAlive(0)				
			.setReducer(addOne)     
			.setInput(a)            
			.listenTo(isUnder10)    

a.update(5)
console.log(b.valueOf())	// 6 -- `under10` updated from true -> true
							// this triggered `b` to update too

a.update(7)
console.log(b.valueOf())	// 8

a.update(2500)
console.log(b.valueOf())	// still 8 -- `under10` ignored change since a >= 10						
```

##### **Reduce**

Reduce here is similar to [`Array.prototype.reduce()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce). The reduce process taken, step by step, combines an "accumulated" value with a "current" value to obtain the next "accumulated" value.

You can use a living value to store your "accumulated" value and simply set the value to use itself as an input.

```javascript
// Array.prototype.reduce -- does not use itsAlive
function accumulate(sum, currentValue) { return sum += currentValue }
let sum = [1,2,3].reduce(accumulate, 0)		// 6
```

```javascript
// itsAlive reducing -- there's some added boilerplate to set up your living values, but updates can be synchronous or asynchronous
function add(a,b) { return a+b }
function logger(x) { console.log(x) } 			

const currentValue = itsAlive(),
      sum = itsAlive(),
      log = itsAlive().listenToInput(sum).setReducer(logger)

sum.setReducer(add)
	.setInputs(sum, currentValue)
	.listenTo(currentValue)

// synchronous updating
[1,2,3].forEach((x)=>currentValue.update(x))	// logs 1, 3, 6

// asynchronous updating
setTimeout(()=>currentValue.update(4), 2000)		// logs 10 after 2 second

```


##### **Buffer**

To maintain a history of past values, simply create a living array that listens to a value whose reducer function pushes updates to the living array.

```javascript
function logger(x) { console.log(x) }

const value = itsAlive(),
      history = itsAlive([]),
      log = itsAlive().listenToInput(history).setReducer(logger)

history
	.setInputs(value, history)
	.listenTo(value)
	.setReducer((val, arr)=>{
	    arr.push(val)
	    return arr
	  })

// note: the logger is logging new values of `history` after each update
value.update(1)		// logs [1]
value.update(2)		// logs [1,2]
value.update(3)		// logs [1,2,3]
```

You can modify the reducer on `history` to enforce rules. For example, you could add a check like `if(arr.length < 10)` to only take the first 10 values, or implement a queue structure to keep the 10 latest values.


#### **Make *itsAlive* from scratch**

*to be written...*

#### API

*to be written...*

#### Examples

*to be written...*

### License

MIT
