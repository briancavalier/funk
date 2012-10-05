(function(define) {
define(function(require) {

	return function uncurryContext(fn) {
		return fn.call.bind(fn);
	};

});
})(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(require); });