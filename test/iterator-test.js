var buster, assert, refute, fail, iterator;

buster = require('buster');
iterator = require('../iterator');

assert = buster.assert;
refute = buster.refute;

buster.testCase('iterator', {

	'repeat': {
		'should repeat value': function() {
			var val, i;

			val = 1;
			i = iterator.repeat(val);

			assert.equals(i(), val);
			assert.equals(i(), val);
			assert.equals(i(), val);
		}
	},

	'cycle': {
		'should cycle over input list': function() {
			var list, i;

			list = [1, 2, 3];
			i = iterator.cycle(list);

			assert.equals(i(), list[0]);
			assert.equals(i(), list[1]);
			assert.equals(i(), list[2]);
			assert.equals(i(), list[0]);
			assert.equals(i(), list[1]);
			assert.equals(i(), list[2]);
		}
	},

	'generate': {
		'should use supplied function': function() {
			var val, i;

			val = {};
			i = iterator.generate(function() { return val; });

			assert.equals(i(), val);
		}
	},

	'recurse': {
		'should recurse on the supplied function': function() {
			var i;

			function timesTwo(x) { return x*2; }

			i = iterator.recurse(1, timesTwo);
			assert.equals(i(), 2);
			assert.equals(i(), 4);
			assert.equals(i(), 8);
		}
	}

});