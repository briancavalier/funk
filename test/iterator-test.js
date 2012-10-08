var buster, assert, refute, fail, iterator, stopIteration;

buster = require('buster');
iterator = require('../iterator');
stopIteration = require('../StopIteration');

assert = buster.assert;
refute = buster.refute;

function items() {
	var i, len, arr;

	i = -1;
	arr = [].slice.apply(arguments);
	len = arr.length;

	return function() {
		i += 1;
		if(i < len) {
			return arr[i];
		}

		throw stopIteration;
	};
}

function add(x, y) {
	return x + y;
}

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
	},

	'append': {
		'should traverse both input iterators': function() {
			var i = iterator.append(items(1, 2), items(3, 4));
			assert.equals(i(), 1);
			assert.equals(i(), 2);
			assert.equals(i(), 3);
			assert.equals(i(), 4);
		}
	},

	'concat': {
		'should traverse all input iterators': function() {
			var i = iterator.concat(items(items(1), items(2), items(3)));
			assert.equals(i(), 1);
			assert.equals(i(), 2);
			assert.equals(i(), 3);
		}
	},

	'map': {
		'should map items': function() {
			var i = iterator.map(function(x) { return x + 1; }, items(1, 2, 3));
			assert.equals(i(), 2);
			assert.equals(i(), 3);
			assert.equals(i(), 4);
		}
	},

	'filter': {
		'should not return items where predicate evaluates to false': function() {
			var i = iterator.filter(function(x) { return x%2 === 0; }, items(1, 2, 3, 4, 5));
			assert.equals(i(), 2);
			assert.equals(i(), 4);
		},

		'should throw when items are exhausted': function() {
			var i = iterator.filter(function(x) { return x%2 === 0; }, items(1, 2, 3, 4, 5));
			i();
			i();
			assert.exception(i);
		}

	},

	'fold': {
		'should fold iterator': function() {
			assert.equals(iterator.fold(add, 0, items(1, 2, 3)), 6);
		}
	}

});