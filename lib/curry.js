(function(define) {
define(function(require) {

	var apSlice, uncurryContext;

	uncurryContext = require('./uncurryContext');
	apSlice = uncurryContext(Array.prototype.slice);

	curry.arity = curryArity;

	return curry;

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


});
})(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(require); });