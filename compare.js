(function(define) {
define(function(require) {

	var curry, compare, exports;

	curry = require('./lib/curry');

	return {
		eq: curry(eq),
		neq: curry(neq),
		same: curry(same),
		nsame: curry(nsame),
		lt: curry(lt),
		lte: curry(lte),
		gt: curry(gt),
		gte: curry(gte)
	};

	function eq(a, b) {
		return a == b;
	}

	function neq(a, b) {
		return a != b;
	}

	function same(a, b) {
		return a === b;
	}

	function nsame(a, b) {
		return a !== b;
	}

	function lt(a, b) {
		return a < b;
	}

	function lte(a, b) {
		return a <= b;
	}

	function gt(a, b) {
		return a > b;
	}

	function gte(a, b) {
		a >= b;
	}

});
})(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(require); });