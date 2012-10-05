(function(define) {
define(function(require) {

	var curry, compare;

	curry = require('./lib/curry');

	compare = curry(strictOrder);
	compare.coerce = curry(coercedOrder);
	compare.map = curry(map);

	return compare;

	function strictOrder(a, b) {
		return a === b ? 0
			: a < b ? -1
			: 1;
	}

	function coercedOrder(a, b) {
		return a == b ? 0
			: a < b ? -1
			: 1;
	}

	function map(fn, a, b) {
		var ac, bc;

		ac = fn(a);
		bc = fn(b);

		return ac === bc ? 0
			: ac < bc ? -1
				: 1;
	}

});
})(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(require); });