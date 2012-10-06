var buster, assert, refute, fail, list, testArray;

buster = require('buster');
list = require('../list');

assert = buster.assert;
refute = buster.refute;
fail = buster.assertions.fail;

function isDense(arr, len) {
	var dense, i = 0;

	if(arguments.length < 2) {
		len = arr.length;
	}
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

	'list': {
		'should create an empty list': function() {
			assert.equals(list(), []);
		},

		'should create a list': function() {
			assert.equals(list(1, 2, 3), [1, 2, 3]);
		}
	},

	'generate': {
		'should generate n items': function() {
			assert.equals(list.generate(function(i) { return i; }, 3), [0, 1, 2]);
		}
	},

	'length': {
		'should return array length': function() {
			assert.equals(3, list.len([1, 2, 3]));
		},

		'should return array-like length': function() {
			assert.equals(3, list.len({ length: 3 }));
		},

		'should return string length': function() {
			assert.equals(3, list.len('123'));
		}
	},

	'cons': {
		'should return list when non-list input': function() {
			assert.equals(list.cons(1, 2), [1, 2]);
		},

		'should return list when empty list input': function() {
			assert.equals(list.cons(1, []), [1]);
		},

		'should return list': function() {
			assert.equals(list.cons(1, [2, 3, 4]), [1, 2, 3, 4]);
		}
	},

	'append': {
		'should append two lists': function() {
			assert.equals(list.append([1, 2], [3, 4]), [1, 2, 3, 4]);
		},

		'should return first list when second is empty': function() {
			var l = [1, 2, 3];
			assert.equals(list.append(l, []), l);
		},

		'should return second list when first is empty': function() {
			var l = [1, 2, 3];
			assert.equals(list.append([], l), l);
		},

		'should return empty list when both are empty': function() {
			assert.equals(list.append([], []), []);
		},

		'should be associative': function() {
			assert.equals(
				list.append(list.append([1, 2], [3, 4]), [5, 6]),
				list.append([1, 2], list.append([3, 4], [5, 6]))
			);
		}
	},

	'concat': {
		'should return empty list when input is empty': function() {

		}
	},

	'head': {
		'should return undefined when input is empty': function() {
			refute.defined(list.head([]));
		},

		'should return first element': function() {
			assert.equals(list.head([1, 2, 3]), 1);
		}
	},

	'tail': {
		'should return empty list when input is empty': function() {
			assert.equals(list.len(list.tail([])), 0);
		},

		'should return empty list when input length is 1': function() {
			assert.equals(list.len(list.tail([1])), 0);
		},

		'should return all but first item': function() {
			assert.equals(list.tail([1, 2, 3]), [2, 3]);
		}
	},

	'last': {
		'should return undefined when input is empty': function() {
			refute.defined(list.last([]));
		},

		'should return first element': function() {
			assert.equals(list.last([1, 2, 3]), 3);
		}
	},

	'initial': {
		'should return empty list when input is empty': function() {
			assert.equals(list.len(list.initial([])), 0);
		},

		'should return empty list when input length is 1': function() {
			assert.equals(list.len(list.initial([1])), 0);
		},

		'should return all but last item': function() {
			assert.equals(list.initial([1, 2, 3]), [1, 2]);
		}
	},

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