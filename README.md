# itsAlive
Dead simple FRP.

------


### Overview

**itsAlive** is an attempt to add tangibility to functional reactive programming (FRP) for the purpose of making FRP easier and more accesible to programmers who are new to it.

It does this by introducing the concept of **living values** - variables that are allowed to mutate but only do so in a controlled fashion. See [documentation](#documentation) for more details.

### Installation

> **NPM** &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; `npm install --save its-alive`
>
> **UNPKG** &nbsp;&nbsp; https://unpkg.com/its-alive@0.1.3

### Documentation

#### Introduction

**The very basics**

Let's start by thinking about how values are assigned to variables.

```javascript
let a = 1
let b = a + 1
...
```

Variables are assigned by value.

First, `a`  is assigned a value of `1`.  Then...

... well it's tempting to think `b` is assigned `a+1`, but it is not. `a+1` is evaluated to `2` and `b` is assigned the result.

When `a` is modified, the value of `b` does not change...

```javascript
...

a = 3
console.log(b)	// still 2, not 4 (= a + 1 = 3 + 1)

...
```

If we want the changes in `a` to be reflect in `b`, we could always rewrite `b = a + 1`, but that kind of sucks.

**We want to define a relationship between `a` and `b`, not simply assign `b` a value**

Let's leave JavaScript world and describe the relationship in Math world. In Math world, the <a href="https://www.codecogs.com/eqnedit.php?latex==" target="_blank"><img src="https://latex.codecogs.com/gif.latex?=" title="=" /></a> sign is NOT assignment. It means &nbsp;<a href="https://www.codecogs.com/eqnedit.php?latex=b" target="_blank"><img src="https://latex.codecogs.com/gif.latex?b" title="b" /></a>&nbsp; ***is*** &nbsp;<a href="https://www.codecogs.com/eqnedit.php?latex=a&plus;1" target="_blank"><img src="https://latex.codecogs.com/gif.latex?a&plus;1" title="a+1" /></a>&nbsp; (even after &nbsp;<a href="https://www.codecogs.com/eqnedit.php?latex=a&plus;1" target="_blank"><img src="https://latex.codecogs.com/gif.latex?a" title="a" /></a>&nbsp; changes)...

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <a href="https://www.codecogs.com/eqnedit.php?latex=b&space;=&space;a&space;&plus;&space;1" target="_blank"><img src="https://latex.codecogs.com/gif.latex?b&space;=&space;a&space;&plus;&space;1" title="b = a + 1" /></a>

We can even abstract out the "doing stuff" part of the relationship and call it a function, &nbsp;<a href="https://www.codecogs.com/eqnedit.php?latex=f" target="_blank"><img src="https://latex.codecogs.com/gif.latex?f" title="f" /></a>&nbsp;, and let &nbsp;<a href="https://www.codecogs.com/eqnedit.php?latex=x" target="_blank"><img src="https://latex.codecogs.com/gif.latex?x" title="x" /></a>&nbsp; be some generic input...

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="https://www.codecogs.com/eqnedit.php?latex=f(x)&space;=&space;x&space;&plus;&space;1" target="_blank"><img src="https://latex.codecogs.com/gif.latex?f(x)&space;=&space;x&space;&plus;&space;1" title="f(x) = x + 1" /></a>

... and then rewrite the relationship between &nbsp;<a href="https://www.codecogs.com/eqnedit.php?latex=b" target="_blank"><img src="https://latex.codecogs.com/gif.latex?a" title="a" /></a>&nbsp; and &nbsp;<a href="https://www.codecogs.com/eqnedit.php?latex=b" target="_blank"><img src="https://latex.codecogs.com/gif.latex?b" title="b" /></a>&nbsp; to be more concise...

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <a href="https://www.codecogs.com/eqnedit.php?latex=b&space;=&space;f(a)" target="_blank"><img src="https://latex.codecogs.com/gif.latex?b&space;=&space;f(a)" title="b = f(a)" /></a>

If we go back to JavaScript world be can write an `addOne` function, but unfortunately, this does not fix our issue of assignment passing a value and not defining a relationship.

```javascript
function addOne(x) { return x + 1 }
let a = 1
let b = addOne(a)

a = 3
console.log(b)  // still 2, not 4 (= a + 1 = 3 + 1)
```

So what problem are we trying to solve? We want to define a relationship between two variables! We do not want to simply evaluate an expression (possibly containing variables) and assign the result to a new variable.

**Elements of a relationship**

Let's breakdown out mathematical relationship from the above section. We had...

 - &nbsp;<a href="https://www.codecogs.com/eqnedit.php?latex=b" target="_blank"><img src="https://latex.codecogs.com/gif.latex?b" title="b" /></a>&nbsp; : &nbsp;***the variable being defined***

and

 - &nbsp;<a href="https://www.codecogs.com/eqnedit.php?latex=f(x)" target="_blank"><img src="https://latex.codecogs.com/gif.latex?f(x)" title="f(x)" /></a>&nbsp; : &nbsp;***a function that takes an input value and modifies it in some way***
 - &nbsp;<a href="https://www.codecogs.com/eqnedit.php?latex=x" target="_blank"><img src="https://latex.codecogs.com/gif.latex?x" title="x" /></a>&nbsp; : &nbsp;***represents the input to f(x)***
 - &nbsp;<a href="https://www.codecogs.com/eqnedit.php?latex=a" target="_blank"><img src="https://latex.codecogs.com/gif.latex?a" title="a" /></a>&nbsp; : &nbsp;***the variable we are using to define b***

So what is `b`? It ***is*** `f(x)` where `a` is fills in the input spot `x`.

**It's Alive! **

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

**To create a "living" value**



```javascript

```

#### Make from scratch

#### Advanced

#### API

### Examples
