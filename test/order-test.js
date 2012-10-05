var buster, assert, refute, fail, order;

buster = require('buster');
order = require('../order');

assert = buster.assert;
refute = buster.refute;

buster.testCase('order', {

	'strict': {
		'should compare strict': function() {
			var val = {};

			refute.equals(order(1, '1'), 0);
			refute.equals(order(val, {}), 0);
			refute.equals(order(null, void 0), 0);
			refute.equals(order(false, 0), 0);

			assert.equals(order(val, val), 0);
			assert.equals(order(1, 1), 0);
			assert.equals(order(1, 2), -1);
			assert.equals(order(2, 1), 1);
		}
	},

	'coerce': {
		'should compare coerced values': function() {
			assert.equals(order.coerce(null, void 0), 0);
			assert.equals(order.coerce(false, 0), 0);

			assert.equals(order.coerce(1, '1'), 0);
			assert.equals(order.coerce(1, '2'), -1);
			assert.equals(order.coerce(2, '1'), 1);
		}
	},

	'map': {
		'should apply function to both': function() {
			var c = order.map(function(x) { return -x; });
			assert.equals(c(1, -1), -1);
		}
	}

});