/** @license MIT License (c) copyright B Cavalier */

/**
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 */
(function(define) {
define(function() {

	var ap, apSlice, apReduce, apply, compose, curry, uncurryContext;

	apply = require('./lib/apply');
	compose = require('./lib/compose');
	curry = require('./lib/curry');
	uncurryContext = require('./lib/uncurryContext');

	ap = Array.prototype;
	apSlice = uncurryContext(ap.slice);
	apReduce = uncurryContext(ap.reduce);

	return {
		identity: identity,
		of: of,

		apply: curry(apply),
		compose: compose,

		flip: flip,
		partial: partial,
		curry: curry,
		curryr: curryr,
		uncurryContext: uncurryContext
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
	 * Returns a function whose argument order is flipped (reversed)
	 * from the input function.  E.g. flip(f)(x, y) === f(y, x);
	 * @param  {Function} fn 2-argument function to flip
	 * @return {Function} 2-argument function whose args are flipped
	 */
	function flip(fn) {
		return function(x, y) {
			return fn(y, x);
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

	function curryr(fn /*, args... */) {
		return curryrNext(fn, fn.length, apSlice(arguments, 1));
	}

	function curryrNext(fn, arity, args) {
		return function() {
			var accumulated = apSlice(arguments).concat(args);

			return accumulated.length < arity
				? curryrNext(fn, arity, accumulated)
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

