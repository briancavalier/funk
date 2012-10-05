(function(define) {
define(function(require) {

	var curry, compose, stopIteration, exports, name;

	curry = require('./lib/curry');
	stopIteration = require('./StopIteration');

	compose = f.compose;

	exports = {
		map: map,
		filter: filter,
		fold: fold,
		fold1: fold1,
		each: each
	};

	exports.repeat = f.of;

	for(name in exports) {
		exports[name] = f.curry(exports[name]);
	}

	return exports;

	function generate(fn) {
		return fn.bind();
	}

	function recurse(seed, fn) {
		return function() {
			seed = fn(seed);
			return seed;
		};
	}

	function map(mapFunc, iter) {
		return compose(iter, mapFunc);
	}

	function filter(predicate, iter) {
		return function() {
			var val;
			for(;;) {
				val = iter();
				if(predicate(val)) {
					return val;
				}
			}
		};
	}

	function fold(reducer, initialValue, iter) {
		var result = initialValue;
		return compose(iter, function(x) {
			result = reducer(result, x);
			return result;
		});
	}

	function fold1(reducer, iter) {
		return fold(reducer, iter(), iter);
	}

	function each(func, iter) {
		try {
			for(;;) {
				func(iter());
			}
		} catch(e) {
			if(e !== stopIteration) {
				throw e;
			}
		}
	}

});
})(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(require); });