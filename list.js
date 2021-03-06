/** @license MIT License (c) copyright B Cavalier */

/**
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 */
(function(define) {
define(function(require) {
	/*global StopIteration: true*/

	var curryable, f, flip, curry, uncurryContext, name,
	ap, apSlice, apForEach, apMap, apReduce, apReduceRight,
	apFilter, apSome, apEvery, apConcat, apSort, apJoin,
	stopIteration;

	f = require('./fn');
	stopIteration = require('./StopIteration');

	// Most every exported function will be curried
	flip = f.flip;
	curry = f.curry;
	uncurryContext = f.uncurryContext;

	// Borrow a bunch of stuff from Array
	ap = Array.prototype;
	apSlice = uncurryContext(ap.slice);
	apForEach = uncurryContext(ap.forEach);
	apMap = uncurryContext(ap.map);
	apReduce = uncurryContext(ap.reduce);
	apReduceRight = uncurryContext(ap.reduceRight);
	apFilter = uncurryContext(ap.filter);
	apSome = uncurryContext(ap.some);
	apEvery = uncurryContext(ap.every);
	apConcat = uncurryContext(ap.concat);
	apSort = uncurryContext(ap.sort);
	apJoin = uncurryContext(ap.join);

	createList.len = length;
	createList.zip = zip;
	createList.zipWith = zipWith;
	createList.unzip = unzip;
	createList.iterator = iterator;
	createList.riterator = reverseIterator;

	curryable = {
		generate: generate,

		cons: cons,
		head: head,
		tail: tail,
		initial: initial,
		last: last,

		append: append,
		concat: concat,
		join: flip(apJoin),
		flatten: flatten,

		forEach: forEach,
		map: flip(apMap),
		filter: flip(apFilter),
		some: flip(apSome),
		every: flip(apEvery),

		indexOf: indexOf,
		lastIndexOf: lastIndexOf,
		findFirst: findFirst,
		findLast: findLast,

		reduce: fold,
		fold: fold,
		fold1: fold1,
		foldr: foldr,
		foldr1: foldr1,
		unfold: unfold,

		scan: scan,
		scan1: scan1,
		scanr: scanr,
		scanr1: scanr1,

		take: take,
		takeWhile: takeWhile,
		drop: drop,
		dropWhile: dropWhile,

		partition: partition,
		collate: collate,

		sort: sort,
		unique: unique,

		shuffle: shuffle,
		sample: sample,
		randomSample: randomSample
	};

	for(name in curryable) {
		createList[name] = curry(curryable[name]);
	}

	return createList;

	// List operations

	/**
	 * Create a list from the supplied items
	 * @param  {*} item1 first item
	 * @return {Array} list of supplied items
	 */
	function createList(item1 /*, item2... */) {
		return apSlice(arguments);
	}

	/**
	 * Generate a new list by applying the supplied generator function
	 * @param  {Function} generator function to apply to generate list items
	 * @param  {Number} n number of items to generate
	 * @return {Array} list of n items
	 */
	function generate(generator, n) {
		// Note: can be implemented using unfold, but this will be faster
		var list, i;

		list = [];

		for(i = 0; i < n; i++) {
			list.push(generator(i));
		}

		return list;
	}

	/**
	 * Anamorphic unfold that constructs a list by calling an unspool
	 * function until donePredicate is true.
	 * @param  {Function} unspool function to generate next list item and
	 *  new seed. Must return a list of 2 items: [list value, new seed]
	 * @param  {Function} donePredicate function that must return true when
	 *  the unfold is complete
	 * @param  {*} seed value to pass to first invocation of unspool
	 * @return {Array} unfolded list
	 */
	function unfold(unspool, donePredicate, seed) {
		var list, result;

		list = [];

		while(!donePredicate(seed)) {
			result = unspool(seed);

			list.push(result[0]);
			seed = result[1];
		}

		return list;
	}

	/**
	 * Returns an iterator for the supplied list
	 * @param  {Array} list
	 * @return {Function} iterator
	 */
	function iterator(list) {
		var i, l;

		i = 0;
		l = length(list);

		return function() {
			if(i < l) {
				++i;
				return list[i];
			}
			
			throw stopIteration;
		};
	}

	/**
	 * Returns an iterator that iterates in reverse order over the supplied
	 * list.
	 * @param  {Array} list
	 * @return {Function} iterator
	 */
	function reverseIterator(list) {
		var i;

		i = length(list);
		return function() {
			if(i > 0) {
				--i;
				return list[i];
			}

			throw stopIteration;
		};
	}

	/**
	 * Returns the number of items in the list
	 * @param  {Array} list
	 * @return {Number} number of items in the list
	 */
	function length(list) {
		return list.length;
	}

	/**
	 * Basic list iterator
	 * @param fn {Function} function to apply to each item in arr
	 * @param arr {Array} list of items
	 */
	function forEach(fn, arr) {
		apForEach(arr, fn);
		return arr;
	}

	/**
	 * Standard fold
	 * @param reducer {Function} reducer function to apply to each item
	 * @param {*} initialValue initial value for fold
	 * @param arr {Array} list of items
	 * @return {*} fold result
	 */
	function fold(reducer, initialValue, arr) {
		return apReduce(arr, reducer, initialValue);
	}

	/**
	 * Standard fold without an initial value
	 * @param reducer {Function} reducer function to apply to each item
	 * @param arr {Array} list of items
	 * @return {*} fold result
	 */
	function fold1(reducer, arr) {
		return apReduce(arr, reducer);
	}

	/**
	 * Standard fold from the right
	 * @param reducer {Function} reducer function to apply to each item
	 * @param {*} initialValue initial value for foldr
	 * @param arr {Array} list of items
	 * @return {*} fold result
	 */
	function foldr(reducer, initialValue, arr) {
		return apReduceRight(arr, reducer, initialValue);
	}

	/**
	 * Standard fold from the right without an initial value
	 * @param reducer {Function} reducer function to apply to each item
	 * @param arr {Array} list of items
	 * @return {*} fold result
	 */
	function foldr1(reducer, arr) {
		return apReduceRight(arr, reducer);
	}

	function scan(reducer, initialValue, arr) {
		var reduced, results;

		results = [];
		
		reduced = fold(function(accum) {
			results.push(accum);
			return reducer.apply(null, arguments);
		}, initialValue, arr);

		results.push(reduced);

		return results;
	}

	function scan1(reducer, arr) {
		var reduced, results;

		results = [];
		
		reduced = fold1(function(accum) {
			results.push(accum);
			return reducer.apply(null, arguments);
		}, arr);

		results.push(reduced);

		return results;
	}

	function scanr(reducer, initialValue, arr) {
		var reduced, results;

		results = [];
		
		reduced = foldr(function(accum) {
			results.unshift(accum);
			return reducer.apply(null, arguments);
		}, initialValue, arr);

		results.unshift(reduced);

		return results;
	}

	function scanr1(reducer, arr) {
		var reduced, results;

		results = [];
		
		reduced = foldr1(function(accum) {
			results.unshift(accum);
			return reducer.apply(null, arguments);
		}, arr);

		results.unshift(reduced);

		return results;
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
	 * Returns a sorted copy of the input list using the supplied comparator
	 * for sorting.
	 * @param  {Function} comparator sort compare function
	 * @param  {Array} list list of items to be sorted
	 * @return {Array} sorted copy of the list
	 */
	function sort(comparator, list) {
		return apSort(apSlice(list), comparator);
	}

	/**
	 * Returns a copy of the sortedList with adjacent duplicates removed
	 * @param  {Function} comparator function that must return 0 for duplicate items
	 * @param  {Array} sortedList sorted list
	 * @return {Array} sorted copy with adjacent duplicates removed
	 */
	function unique(comparator, sortedList) {
		var prev;

		return fold(function(uniq, item, i) {
			if(uniq.length === 0) {
				uniq.push(item);
			} else if(comparator(item, prev) !== 0) {
				uniq.push(item);
			}

			prev = item;

			return uniq;

		}, [], sortedList);

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
	 * Join items from list together to form a String using the
	 * supplied separator String between each item
	 * @param  {String|Object} separator String to place between each item
	 * @param  {Array} list list to join
	 * @return {String} joined String
	 */
	function join(separator, list) {
		return apJoin(list, separator);
	}

	/**
	 * Prepends item to list
	 * @param  {*} item to prepend
	 * @param  {Array} list onto which to prepend item
	 * @return {Array} new list with item prepended
	 */
	function cons(item, list) {
		return append(createList(item), list);
	}

	/**
	 * Concatenates the two lists into one new list
	 * @param  {Array} head
	 * @param  {Array} tail
	 * @return {Array} concatenated list
	 */
	function append(head, tail) {
		return apConcat(head, tail);
	}

	/**
	 * Concatenates all lists in the supplied list of lists
	 * @param  {Array} lists list of lists
	 * @return {Array} concatenation of all lists
	 */
	function concat(lists) {
		// Could be this:
		// return fold(append, [], lists);
		// But leveraging builtin concat is *much* faster:
		return ap.concat.apply([], lists);
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
	 * Returns a list of all elements except the last
	 * @param  {Array} list
	 * @return {Array} list of all items except the lsat, or empty list
	 */
	function initial(list) {
		return apSlice(list, 0, length(list) - 1);
	}

	/**
	 * Returns the last element in the list
	 * @param  {Array} list
	 * @return {*} last element or undefined
	 */
	function last(list) {
		return list[length(list) - 1];
	}

	/**
	 * Returns a list of the first n elements of list, or list if
	 * n > length(list).  Original list is not modified
	 * @param  {Number} n number of elements to take
	 * @param  {Array} list list from which to take
	 * @return {Array} list of n elements from list
	 */
	function take(n, list) {
		return apSlice(list, 0, n);
	}

	function takeWhile(predicate, list) {
		var index = indexOf(predicate, list);
		return index >= 0 ? apSlice(list, 0, index) : apSlice(list);
	}

	function drop(n, list) {
		return apSlice(list, n);
	}

	function dropWhile(predicate, list) {
		var index = indexOf(predicate, list);
		return index >= 0 ? apSlice(list, index) : [];
	}

	/**
	 * Returns the first item in list for which predicate evaluates to true
	 * @param predicate {Function} predicate to evaluate for each item
	 * @param list {Array} items to scan
	 * @return {*} first item for which predicate evaluated to true or
	 * undefined if none.
	 */
	function findFirst(predicate, list) {
		return list[indexOf(predicate, list)];
	}

	/**
	 * Returns the last item in list for which predicate evaluates to true
	 * @param predicate {Function} predicate to evaluate for each item
	 * @param list {Array} items to scan
	 * @return {*} last item for which predicate evaluated to true or
	 * undefined if none.
	 */
	function findLast(predicate, list) {
		return list[lastIndexOf(predicate, list)];
	}

	/**
	 * Returns the index of the first item in list for which predicate
	 * evaluates to true.
	 * @param  {Function} predicate predicate to evaluate for each item
	 * @param  {Array} list items to scan
	 * @return {Number} index of first item for which predicate evaluates
	 *  to true, or -1 if none.
	 */
	function indexOf(predicate, list) {
		var index = -1;
		apSome(list, function(item, i) {
			if(predicate(item)) {
				index = i;
				return true;
			}

			return false;
		});

		return index;
	}

	/**
	 * Returns the index of the last item in list for which predicate
	 * evaluates to true.
	 * @param  {Function} predicate predicate to evaluate for each item
	 * @param  {Array} list items to scan
	 * @return {Number} index of last item for which predicate evaluates
	 *  to true, or -1 if none.
	 */
	function lastIndexOf(predicate, list) {
		var index = -1;

		try {
			apReduceRight(list, function(unused, item, i) {
				if(predicate(item)) {
					index = i;
					throw stopIteration;
				}
			}, void 0);
		} catch(e) {
			if(e !== stopIteration) {
				throw e;
			}
		}
		
		return index;
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
		return fold(function(result, a) {
			var key, list;

			key = predicate(a);
			list = result[key];
			if(!list) {
				result[key] = list = [a];
			} else {
				list.push(a);
			}

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

		return fold(doFlatten, [], arr);
	}

	/**
	 * Returns a new list containing the items from arr in a random order
	 * @param arr {Array} items to shuffle
	 * @return {Array} array containing all items from arr in a random order
	 */
	function shuffle(arr) {
		return randomSample(length(arr), arr);
	}

	/**
	 * Returns a new list containing sampleSize items from arr in random order.
	 * Uses Fisher-Yates.
	 * @param sampleSize {Number} number of items to include in the returned sample
	 * @param arr {Array} items from which to sample
	 * @return {Array} array containing sampleSize items from arr in random order
	 */
	function randomSample(sampleSize, arr) {
		var shuffled, i, j, n, len;

		shuffled = [];
		len = length(arr);

		if(len) {
			n = Math.min(sampleSize, len);
			i = 1;

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
		len = length(arr);
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
		return zipWith.apply(this, [defaultZip].concat(apSlice(arguments)));
	}

	function defaultZip(a /*, b... */) {
		return apSlice(arguments);
	}

	function unzip(list) {
		return zipWith.apply(this, [defaultZip].concat(list));
	}
});
}(typeof define === 'function' ? define : function(factory) { module.exports = factory(require); }));

