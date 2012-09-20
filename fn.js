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

	var slice = [].slice;

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
	 * Apply function f to the supplied arguments
	 * @param args
	 * @param f
	 * @return {*}
	 */
	function apply(args, f) {
		return f.apply(this, args);
	}

	/**
	 * Compose two or more functions
	 * @param f {Function}
	 * @param g {Function}
	 * @return {Function}
	 */
	function compose(f, g /*, h... */) {
		var head, tail;

		head = f;
		tail = slice.call(arguments, 1);

		return function() {
			return tail.reduce(function(result, f) {
				return f(result);
			}, head.apply(null, slice.call(arguments)));
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

		args = slice.call(arguments, 1);

		return function() {
			return f.apply(this, args.concat(slice.call(arguments)));
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
		return curryNext(fn, fn.length, slice.call(arguments, 1));
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
		return curryNext(fn, arity, slice.call(arguments, 2));
	}

	function curryNext(fn, arity, args) {
		return function() {
			var accumulated = args.concat(slice.call(arguments));

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

