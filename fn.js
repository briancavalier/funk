/** @license MIT License (c) copyright B Cavalier & J Hann */

/**
 * part of the cujo.js family of libraries (http://cujojs.com/)
 *
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 *
 */
(function(define) {
define(function() {

	var ap, apSlice, apReduce;

	ap = Array.prototype;
	apSlice = ap.slice.call.bind(ap.slice);
	apReduce = ap.reduce.call.bind(ap.reduce);

	return {
		identity: identity,
		of: of,

		apply: apply,
		compose: compose,

		partial: partial,
		curry: curry,
		curry1: curry1,
		curryArity: curryArity,
		uncurry: uncurry
	};

	/**
	 * The identity function.  Always returns x
	 * @param x {*} input arg, will be returned
	 * @return {*} x
	 */
	function identity(x) {
		return x;
	}

	/**
	 * Create a function that always returns x
	 * @param x {*} arg that resulting function will return
	 * @return {Function} function that returns x
	 */
	function of(x) {
		return function() {
			return x;
		};
	}

	/**
	 * Apply function f to x
	 * @param x {*} value on which to apply f
	 * @param f {Function} function to apply to x
	 * @return {*} result of applying f to x
	 */
	function apply(x, f) {
		return f(x);
	}

	/**
	 * Compose two or more functions
	 * @param f {Function}
	 * @param g {Function}
	 * @return {Function}
	 */
	function compose(f, g /*, h... */) {
		var tail = apSlice(arguments, 1);

		return function() {
			return apReduce(tail, apply, f.apply(null, apSlice(arguments)));
		};
	}

	/**
	 * Return a version of f that has been partially applied to the
	 * supplied arguments. Accepts a variable number of arguments with which
	 * to partially apply f.
	 * @param f {Function} function to partially apply
	 * @param arg1 {*} First of any number of arguments
	 * @return {*}
	 */
	function partial(f, arg1 /*,... */) {
		var args;
		// Optimization: return f if no args provided
		if (arguments.length === 1) {
			return f;
		}

		args = apSlice(arguments, 1);

		return function() {
			return f.apply(this, args.concat(apSlice(arguments)));
		};
	}

	/**
	 * Curry an N-argument function to a series of single argument (pure) functions
	 * @param  {Function} fn Function to curry
	 * @return {Function} curried version of fn
	 */
	function curry1(fn) {
		var arity = fn.length;

		return arity > 1 ? curry1Next(fn, arity, []) : fn;
	}

	function curry1Next(fn, arity, args) {
		return function(x) {
			var accumulated = args.concat(x);

			return accumulated.length < arity
				? curry1Next(fn, arity, accumulated)
				: fn.apply(this, accumulated);
		};
	}

	/**
	 * Curry an N-argument function to a series of less-than-N-argument functions
	 * @param  {Function} fn Function to curry
	 * @return {Function} curried version of fn
	 */
	function curry(fn /*, args... */) {
		return curryNext(fn, fn.length, apSlice(arguments, 1));
	}

	/**
	 * Curry a function, specifying the arity of the function.  Useful in the case
	 * where the function's length cannot be used because it has undeclared or variable
	 * params
	 * @param  {Function} fn    Function to curry
	 * @param  {Number}   arity Specific arity of the function
	 * @return {Function} curried version of fn
	 */
	function curryArity(fn, arity /*, args... */) {
		return curryNext(fn, arity, apSlice(arguments, 2));
	}

	function curryNext(fn, arity, args) {
		return function() {
			var accumulated = args.concat(apSlice(arguments));

			return accumulated.length < arity
				? curryNext(fn, arity, accumulated)
				: fn.apply(this, accumulated);
		};
	}

	function uncurry(f) {
		return function() {
			var i, next, len;
			
			next = f;

			for (i = 0, len = arguments.length; i < len; i++) {
				next = next(arguments[i]);
			}

			return next;
		};
	}

});
}(typeof define === 'function' ? define : function(factory) { module.exports = factory(); }));

