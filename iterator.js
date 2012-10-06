(function(define) {
define(function(require) {

	var curry, uncurryContext, compose, stopIteration, exports, name, apSlice;

	curry = require('./lib/curry');
	uncurryContext = require('./lib/uncurryContext');
	compose = require('./lib/compose');
	stopIteration = require('./StopIteration');
	apSlice = uncurryContext(Array.prototype.slice);

	exports = {
		recurse: recurse,

		map: map,
		filter: filter,
		fold: fold,
		fold1: fold1,
		unfold: unfold,
		scan: scan,

		take: take,
		drop: drop,

		sample: sample,
		chance: chance,

		zipWith: zipWith,
		
		list: list,

		each: each
	};

	for(name in exports) {
		exports[name] = curry(exports[name]);
	}

	exports.repeat = repeat;
	exports.cycle = cycle;
	exports.generate = generate;

	exports.fold = fold;
	exports.scan = scan;

	exports.zip = zip;
	exports.unzip = unzip;

	return exports;

	function repeat(x) {
		return function() {
			return x;
		};
	}

	function cycle(list) {
		var i, len;

		i = -1;
		len = list.length;
		return function() {
			return list[++i % len];
		};
	}

	function generate(fn) {
		return fn.bind();
	}

	function recurse(seed, fn) {
		return function() {
			return (seed = fn(seed));
		};
	}

	function append(iter1, iter2) {
		var iter = iter1;
		return function() {
			try {
				return iter();
			} catch(e) {
				if(e === stopIteration && iter === iter1) {
					iter = iter2;
				} else {
					throw e;
				}
			}
		};
	}

	function concat(iters) {
		// TODO: traverse each iter returned by iters
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

	function unfold(unspool, donePredicate, seed) {
		var list, result;

		list = [];
		return function() {
			if(donePredicate(seed)) {
				throw stopIteration;
			}

			result = unspool(seed);
			seed = result[1];
			return result[0];
		};
	}

	function scan(reducer, initialValue, iter) {
		return fold(function(accum, val) {
			return accum.concat(val);
		}, [initialValue], iter);
	}

	function list(iter) {
		var l = [];
		each(list.push.bind(l), iter);

		return l;
	}

	function take(n, iter) {
		return function() {
			if(n === 0) {
				throw stopIteration;
			}

			n -= 1;
			return iter();
		};
	}

	function drop(n, iter) {
		return function() {
			if(n === 0) {
				return iter();
			}

			n -= 1;
		};
	}

	function sample(frequency, iter) {
		return function() {
			var skip = frequency;

			while(--skip) {
				iter();
			}

			return iter();
		};
	}

	function chance(odds, iter) {
		return function() {
			while(Math.random() < odds) {
				iter();
			}

			return iter();
		};
	}

	function zipWith(fn, iter1, iter2 /* ... */) {
		var iters, numIters;

		iters = apSlice(arguments, 1);
		numIters = iters.length;

		return function() {
			var values = [];
			for(var i = 0; i < numIters; i++) {
				values.push(iters[i]());
			}

			return fn.apply(this, values);
		};
	}

	function zip(iter1, iter2 /* ... */) {
		return zipWith.apply(this, [defaultZip].concat(apSlice(arguments)));
	}

	function defaultZip(a /*, b... */) {
		return apSlice(arguments);
	}

	function unzip(iter) {
		return zipWith.apply(this, [defaultZip].concat(iter));
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