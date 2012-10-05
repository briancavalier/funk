(function(define) {
define(function(require) {

	var apply, uncurryContext, apSlice, apReduce;

	apply = require('./apply');
	uncurryContext = require('./uncurryContext');
	apSlice = uncurryContext(Array.prototype.slice);
	apReduce = uncurryContext(Array.prototype.reduce);

	/**
	 * Compose two or more functions
	 * @param f {Function}
	 * @param g {Function}
	 * @return {Function}
	 */
	return function compose(f, g /*, h... */) {
		var tail = apSlice(arguments, 1);

		return function() {
			return apReduce(tail, apply, f.apply(null, apSlice(arguments)));
		};
	};

});
})(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(require); });