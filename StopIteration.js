(function(define) {
define(function(require) {
	/*global StopIteration:true */

	return typeof StopIteration != 'undefined' ? StopIteration : {};

});
})(typeof define === 'function' && define.amd ? define : function(factory) { module.exports = factory(require); });