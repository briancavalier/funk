var buster, assert, refute, fail, list, testArray;

buster = require('buster');
list = require('../list');

assert = buster.assert;
refute = buster.refute;
fail = buster.assertions.fail;

function isDense(arr, len) {
	var dense, i = 0;

	if(arguments.length < 2) len = arr.length;
	dense = arr.length === len;

	if(dense) {
		while(i++ in arr) {}
	}

	return dense && (i - 1) === len;
}

testArray = (function(n) {
	for(var array = [], i = 0; i<n; i++) {
		array.push(i);
	}

	return array;
}(20));

buster.testCase('list', {

	'shuffle': {
		'should return a dense list of the same size': function() {
			assert(isDense(list.shuffle(testArray)));
		}

	},

	'sample': {
		'should return a dense list of the specified sample size': function() {
			assert(isDense(list.sample(8, testArray), 8));
		}
	},

	'randomSample': {
		'should return a dense list of the specified sample size': function() {
			assert(isDense(list.randomSample(8, testArray), 8));
		}
	},

	'zipWith': {
		'should apply zipFunc to each slice': function() {
			function add(x, y) { return x + y; }

			assert.equals(list.zipWith(add, [1,2], [3,4]), [4,6]);
		}
	},

	'zip': {
		'should zip 1 list': function() {
			assert.equals(list.zip([1, 2, 3]), [[1], [2], [3]]);
		},

		'should zip 2 lists': function() {
			assert.equals(list.zip([1, 2, 3], [4, 5, 6]), [[1,4], [2,5], [3,6]]);
		},

		'should zip N lists': function() {
			assert.equals(list.zip([1, 2, 3], [4, 5, 6], [7, 8, 9]), [[1,4,7], [2,5,8], [3,6,9]]);
		}
	},

	'unzip': {
		'should unzip 1 list': function() {
			assert.equals(list.unzip([[1], [2], [3]]), [[1, 2, 3]]);
		},

		'should unzip 2 lists': function() {
			assert.equals(list.unzip([[1,4], [2,5], [3,6]]), [[1, 2, 3], [4, 5, 6]]);
		}

	}
});