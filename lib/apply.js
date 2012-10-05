(function(define) {
define(function(require) {

	/**
	 * Apply function f to x
	 * @param x {*} value on which to apply f
	 * @param f {Function} function to apply to x
	 * @return {*} result of applying f to x
	 */
	return function apply(x, f) {
		return f(x);
	}

});
})(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(require); });