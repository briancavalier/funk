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

	function forEach(fn, arr) {
		arr.forEach(fn);
	}

	function reduce(reducer, arr /*, initialValue */) {
		return arguments.length > 2
			? arr.reduce(reducer, arguments[2])
			: arr.reduce(reducer);
	}

	function map(mapper, arr) {
		return arr.map(mapper);
	}

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

