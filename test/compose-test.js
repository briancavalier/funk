var buster, assert, refute, fail, compose;

buster = require('buster');
compose = require('../fn').compose;

assert = buster.assert;
refute = buster.refute;
fail = buster.assertions.fail;

function addOne(x) {
	return x + 1;
}

buster.testCase('compose', {

	'should compose 2 functions': function() {
		assert.equals(compose(addOne, addOne)(0), 2);
	},

	'should compose a single function as itself': function() {
		assert.equals(compose(addOne)(0), addOne(0));
	},

	'should compose n functions': function() {
		var funcs = [addOne, addOne, addOne, addOne, addOne];

		assert.equals(compose.apply(null, funcs)(0), funcs.length);
	},

	'should call first function with supplied args': function() {
		var expected = [1, 2, 3];

		function checkArgs() {
			assert.equals(Array.prototype.slice.call(arguments), expected);
		}

		compose(checkArgs).apply(null, expected);
	},

	'should compose f, g into g(f)': function() {
		function appendA(x) {
			return x + 'a';
		}
		function appendB(x) {
			return x + 'b';
		}

		assert.equals(compose(appendA, appendB)(''), 'ab');
	}
});