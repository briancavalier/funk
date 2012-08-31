(function(define) {
define(function() {

	var slice;

	slice = Array.prototype.slice;

	return {
		forEach: forEach,
		reduce: reduce,
		map: map,

		first: first,
		last: last,
		
		partition: partition,
		collate: collate,
		flatten: flatten,
		
		zipWith: zipWith,
		zip: zip
	};

	// List operations

	function forEach(fn, arr) {
		var i, len, val;

		for(i = 0, len = arr.length; i < len; i++) {
			if(i in arr) {
				fn(arr[i], i, arr);
			}
		}
	}

	function reduce(reducer, arr /*, initialValue */) {
		var args, reduced, len, i;

		i = 0;
		arr = Object(arr);
		len = arr.length >>> 0;
		args = arguments;

		// If no initialValue, use first item of array (we know length !== 0 here)
		// and adjust i to start at second item
		if(args.length <= 1) {
			// Skip to the first real element in the array
			for(;;) {
				if(i in arr) {
					reduced = arr[i++];
					break;
				}

				// If we reached the end of the array without finding any real
				// elements, it's a TypeError
				if(++i >= len) {
					throw new TypeError();
				}
			}
		} else {
			// If initialValue provided, use it
			reduced = args[1];
		}

		// Do the actual reduce
		for(;i < len; ++i) {
			// Skip holes
			if(i in arr) {
				reduced = reducer(reduced, arr[i], i, arr);
			}
		}

		return reduced;
	}

	function map(mapper, arr) {
		return reduce(function(mapped, item) {
			mapped.push(mapper(item));
			return mapped;
		}, []);
	}

	function first(predicate, arr) {
		var i, len, val;

		for(i = 0, len = arr.length; i < len; i++) {
			if(i in arr) {
				val = arr[i];
				if(predicate(val)) {
					return val;
				}
			}
		}
	}

	function last(predicate, arr) {
		var i, len, val;

		for(i = arr.length - 1; i >= 0; i--) {
			if(i in arr) {
				val = arr[i];
				if(predicate(val)) {
					return val;
				}
			}
		}
	}

	function partition(predicate, arr) {
		var a, b;

		a = [];
		b = [];

		arr.forEach(function(val) {
			if(predicate(val)) {
				a.push(val);
			} else {
				b.push(val);
			}
		});

		return [a, b];
	}

	function collate(predicate, arr) {
		return arr.reduce(function(result, a) {
			var key = predicate(a);
			result[key] = a;
			return result;
		}, {});
	}

	function flatten(arr, recurse) {
		var doFlatten = recurse
			? function(result, a) {
				if(a instanceof Array) {
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

