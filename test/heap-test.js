var buster, assert, refute, fail, heap;

buster = require('buster');
heap = require('../heap');

assert = buster.assert;
refute = buster.refute;
fail = buster.assertions.fail;

function compare(a, b) {
	return a === b ? 0
		   : a < b ? -1
			 : 1;
}

buster.testCase('heap', {

	'merge': {
		'should merge sorted heaps': function() {
			var h1, h2;

			h1 = [1, 3];
			h2 = [0, 2, 4];

			assert.equals(heap.merge(compare, h1, h2), [0,1,2,3,4]);
		}
	}
});