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

	var ap, apSlice, apForEach, apMap, apReduce, apFilter, apSome, apEvery, apConcat;

	ap = Array.prototype;
	apSlice = ap.slice.call.bind(ap.slice);
	apForEach = ap.forEach.call.bind(ap.forEach);
	apMap = ap.map.call.bind(ap.map);
	apReduce = ap.reduce.call.bind(ap.reduce);
	apFilter = ap.filter.call.bind(ap.filter);
	apSome = ap.some.call.bind(ap.some);
	apEvery = ap.every.call.bind(ap.every);
	apConcat = ap.concat.call.bind(ap.concat);

	return {
		of: of,
		generate: generate,

		forEach: forEach,
		reduce: reduce,
		map: map,
		filter: filter,
		some: some,
		every: every,
		first: first,
		last: last,
		concat: concat,

		head: head,
		tail: tail,

		partition: partition,
		collate: collate,
		flatten: flatten,

		shuffle: shuffle,
		sample: sample,
		randomSample: randomSample,

		zipWith: zipWith,
		zip: zip,
		unzip: unzip
	};

	// List operations

	/**
	 * Create a list from the supplied items
	 * @param  {*} item1 first item
	 * @return {Array} list of supplied items
	 */
	function of(item1 /*, item2... */) {
		return apSlice(arguments);
	}

	/**
	 * Generate a new list by applying the supplied generator function
	 * @param  {Function} generator function to apply to generate list items
	 * @param  {Number} n number of items to generate
	 * @return {Array} list of n items
	 */
	function generate(generator, n) {
		var list, i;

		list = [];

		for(i = 0; i < n; i++) {
			list.push(generator(i));
		}

		return list;
	}

	/**
	 * Basic list iterator
	 * @param fn {Function} function to apply to each item in arr
	 * @param arr {Array} list of items
	 */
	function forEach(fn, arr) {
		return apForEach(arr, fn);
	}

	/**
	 * Standard reduce/fold in a curryable format
	 * @param reducer {Function} reducer function to apply to each item
	 * @param arr {Array} list of items
	 * @return {*} reduce result
	 */
	function reduce(reducer, initialValue, arr) {
		return apReduce(arr, reducer, initialValue);
	}

	/**
	 * Standard map in a curryable format
	 * @param mapper {Function} mapper function to apply to each item
	 * @param arr {Array} list of items
	 * @return {Array} mapped results
	 */
	function map(mapper, arr) {
		return apMap(arr, mapper);
	}

	/**
	 * Standard filter in a curryable format
	 * @param predicate {Function} predicate to evaluate for each item
	 * @param arr {Array} list of items
	 * @return {Array} array of items for which predicate evaluates to true
	 */
	function filter(predicate, arr) {
		return apFilter(arr, predicate);
	}

	/**
	 * Returns true iff predicate evaluates to true for at least one
	 * item in arr
	 * @param predicate {Function}
	 * @param arr {Array}
	 * @return {Boolean}
	 */
	function some(predicate, arr) {
		return apSome(arr, predicate);
	}

	/**
	 * Returns true iff predicate evaluates to true for all items in arr
	 * @param predicate {Function}
	 * @param arr {Array}
	 * @return {Boolean}
	 */
	function every(predicate, arr) {
		return apEvery(arr, predicate);
	}

	/**
	 * Concatenates the two lists into one new list
	 * @param  {Array} head
	 * @param  {Array} tail
	 * @return {Array} concatenated list
	 */
	function concat(head, tail) {
		return apConcat(head, tail);
	}

	/**
	 * Returns the first element in the list
	 * @param  {Array} list
	 * @return {*} first element or undefined
	 */
	function head(list) {
		return list[0];
	}

	/**
	 * Returns a list of all elements except the first
	 * @param  {Array} list
	 * @return {Array} list of all items except the first, or empty list.
	 */
	function tail(list) {
		return apSlice(list, 1);
	}

	/**
	 * Returns the first item in arr for which predicate evaluates to true
	 * @param predicate {Function} predicate to evaluate for each item
	 * @param arr {Array} items to scan
	 * @return {*} first item for which predicate evaluated to true or
	 * undefined if none.
	 */
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

	/**
	 * Returns the last item in arr for which predicate evaluates to true
	 * @param predicate {Function} predicate to evaluate for each item
	 * @param arr {Array} items to scan
	 * @return {*} last item for which predicate evaluated to true or
	 * undefined if none.
	 */
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

	/**
	 * Partition a list into 2 lists by evaluating the supplied
	 * predicate on each item.  Items for which the predicate evaluates
	 * to false will be placed in one result list, and items for which
	 * it evaluates to true in another
	 * @param  {Function} predicate predicate to evaluate for each item
	 * @param  {Array} arr list to partition
	 * @return {Array} array containing two lists, the 0th contains items
	 * for which predicate evaluated to false, and the 1st contains items
	 * for which it evaluated to true, e.g. [falseItems, trueItems]
	 */
	function partition(predicate, arr) {
		var a, b;

		a = [];
		b = [];

		forEach(function(val) {
			if(predicate(val)) {
				b.push(val);
			} else {
				a.push(val);
			}
		}, arr);

		return [a, b];
	}

	function collate(predicate, arr) {
		return reduce(function(result, a) {
			result[predicate(a)] = a;
			return result;
		}, {}, arr);
	}

	function flatten(arr, shallow) {
		var doFlatten = shallow
			? concat
			: function (result, a) {
				if (Array.isArray(a)) {
					result = concat(result, doFlatten(a));
				} else {
					result.push(a);
				}

				return result;
			};

		return reduce(doFlatten, [], arr);
	}

	/**
	 * Returns a new list containing the items from arr in a random order
	 * @param arr {Array} items to shuffle
	 * @return {Array} array containing all items from arr in a random order
	 */
	function shuffle(arr) {
		return randomSample(arr.length, arr);
	}

	/**
	 * Returns a new list containing sampleSize items from arr in random order
	 * @param sampleSize {Number} number of items to include in the returned sample
	 * @param arr {Array} items from which to sample
	 * @return {Array} array containing sampleSize items from arr in random order
	 */
	function randomSample(sampleSize, arr) {
		var shuffled, i, j, n;

		shuffled = [];

		if(arr.length) {
			n = Math.min(sampleSize, arr.length);
			i = 0;

			shuffled.push(arr[0]);

			for(;i < n; i++) {
				j = Math.floor(Math.random() * i);
				shuffled[i] = shuffled[j];
				shuffled[j] = arr[i];
			}
		}

		return shuffled;
	}

	/**
	 * Returns a new list containing sampleSize items from arr, maintaining
	 * relative order of the items.
	 * @param sampleSize {Number} number of items to include in the returned sample
	 * @param arr {Array} items from which to sample
	 * @return {Array} array containing sampleSize items from arr
	 */
	function sample(sampleSize, arr) {
		var sampled, i, dist, len;

		sampled = [];
		len = arr.length;
		if(len) {
			sampleSize = Math.min(sampleSize, len);

			if(sampleSize === len) {
				sampled = apSlice(arr);
			} else {
				dist = Math.floor(len / sampleSize);

				for(i = 0; i < len; i += dist) {
					sampled.push(arr[i]);
				}
			}
		}

		return sampled.slice(0, sampleSize);
	}

	function zipWith(fn, a /*, b... */) {
		var numArrays, arrays, len, i, j, values, zipped;

		arrays = apSlice(arguments, 1);
		numArrays = arrays.length;

		len = a.length;
		for(i = 1; i < numArrays; i++) {
			len = Math.min(len, arrays[i].length);
		}

		zipped = [];

		for(i = 0; i < len; i++) {
			values = [];
			for(j = 0; j < numArrays; j++) {
				values.push(arrays[j][i]);
			}

			zipped.push(fn.apply(this, values));
		}

		return zipped;
	}

	function zip(a, b /*, c... */) {
		return zipWith.apply(this, concat(defaultZip, apSlice(arguments)));
	}

	function defaultZip(a /*, b... */) {
		return apSlice(arguments);
	}

	function unzip(list) {
		return zipWith.apply(this, concat(defaultZip, list));
	}
});
}(typeof define === 'function' ? define : function(factory) { module.exports = factory(); }));

