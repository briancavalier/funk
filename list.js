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

	var slice = Array.prototype.slice;

	return {
		forEach: forEach,
		reduce: reduce,
		map: map,
		filter: filter,
		first: first,
		last: last,
		
		partition: partition,
		collate: collate,
		flatten: flatten,

		zipWith: zipWith,
		zip: zip,
		unzip: unzip
	};

	// List operations

	/**
	 * Basic list iterator
	 * @param fn {Function} function to apply to each item in arr
	 * @param arr {Array} list of items
	 */
	function forEach(fn, arr) {
		arr.forEach(fn);
	}

	/**
	 * Standard reduce/fold in a curryable format
	 * @param reducer {Function} reducer function to apply to each item
	 * @param arr {Array} list of items
	 * @return {*} reduce result
	 */
	function reduce(reducer, arr /*, initialValue */) {
		return arguments.length > 2
			? arr.reduce(reducer, arguments[2])
			: arr.reduce(reducer);
	}

	/**
	 * Standard map in a curryable format
	 * @param mapper {Function} mapper function to apply to each item
	 * @param arr {Array} list of items
	 * @return {Array} mapped results
	 */
	function map(mapper, arr) {
		return arr.map(mapper);
	}

	/**
	 * Standard map in a curryable format
	 * @param predicate {Function} predicate to evaluate for each item
	 * @param arr {Array} list of items
	 * @return {Array} array of items for which predicate evaluates to true
	 */
	function filter(predicate, arr) {
		return arr.filter(predicate);
	}

	function first(predicate, arr) {
		var i, len, val;

		for(i = 0, len = arr.length; i < len; i++) {
			if(i in arr) {
				val = arr[i];
				if(predicate(val)) {
					break;
				}
			}
		}

		return val;
	}

	function last(predicate, arr) {
		var i, val;

		for(i = arr.length - 1; i >= 0; i--) {
			if(i in arr) {
				val = arr[i];
				if(predicate(val)) {
					break;
				}
			}
		}

		return val;
	}

	function some(predicate, arr) {
		var i, len, found;

		found = false;

		for(i = 0, len = arr.length;i < len; i++) {
			found = predicate(arr[i]);
			if(found) {
				break;
			}
		}

		return found;
	}


	function whilst(predicate, arr) {
		var i, len;

		for(i = 0, len = arr.length;i < len; i++) {
			if(!predicate(arr[i])) {
				break;
			}
		}

		return arr.slice(0, i);
	}

	function until(predicate, arr) {
		var i, len;

		for(i = 0, len = arr.length;i < len; i++) {
			if(predicate(arr[i])) {
				break;
			}
		}

		return arr.slice(0, i);
	}

	function partition(predicate, arr) {
		var a, b;

		a = [];
		b = [];

		arr.forEach(function(val) {
			if(predicate(val)) {
				b.push(val);
			} else {
				a.push(val);
			}
		});

		return [a, b];
	}

	function collate(predicate, arr) {
		return arr.reduce(function(result, a) {
			result[predicate(a)] = a;
			return result;
		}, {});
	}

	function flatten(arr, recurse) {
		var doFlatten = recurse
			? function(result, a) {
				if(Array.isArray(a)) {
					result = result.concat(doFlatten(a));
				} else {
					result.push(a);
				}

				return result;
			}
			: function(result, a) {
				return result.concat(a);
			};

		return arr.reduce(doFlatten, []);
	}

	function zipWith(fn, a /*, b... */) {
		var numArrays, arrays, len, i, j, values, zipped;

		arrays = slice.call(arguments, 1);
		numArrays = arrays.length;

		len = a.length;
		for(i = 1; i < numArrays; i++) {
			len = Math.min(len, arrays[i]);
		}

		zipped = [];

		for(i = 0; i < numArrays; i++) {
			values = [];
			for(j = 0; j < len; j++) {
				values.push(arrays[i][j]);
			}

			zipped.push(fn.apply(this, values));
		}
	}

	function zip(a, b /*, c... */) {
		return zipWith.apply(this, defaultZip, slice.call(arguments, 1));
	}

	function defaultZip(a /*, b... */) {
		return slice.call(arguments);
	}

	function unzip(list) {
		return zipWith.apply(this, defaultZip, list);
	}
});
}(typeof define === 'function' ? define : function(factory) { module.exports = factory(); }));

