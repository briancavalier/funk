(function(define) {
define(function() {

	var slice;

	slice = Array.prototype.slice;

	curry.arity = curryArity;

	return {
		identity: identity,
		of: of,
		apply: apply,
		compose: compose,
		partial: partial,
		curry: curry,
		curry1: curry1,
		uncurry: uncurry
	};

	function identity(x) {
		return x;
	}

	function of(x) {
		return function() {
			return x;
		};
	}

	function apply(f, args) {
		return f.apply(this, args);
	}

	function compose(f, g /*, h... */) {
		var funcs = slice.call(arguments);

		return function() {
			return funcs.reduce(function(args, f) {
				return [f.apply(null, args)];
			}, slice.call(arguments))[0];
		};
	}

	function partial(f /* args... */) {
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
		if (typeof f != "function" || f.length === 0) {
			return f;
		}

		return function() {
			var i, next;
			
			next = f;

			for (i = 0; i < arguments.length; i++) {
				next = next(arguments[i]);
			}

			return next;
		};
	}

});
}(typeof define === 'function' ? define : function(factory) { module.exports = factory(); }));

