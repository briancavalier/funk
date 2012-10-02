var fn, list, numbers, filterMultiples, reduceSum, sumOfMultiples;

fn = require('../../fn');
list = require('../../list');

filterMultiples = fn.partial(list.filter, isMultiple);
reduceSum = fn.partial(list.reduce, sum, 0);
sumOfMultiples = fn.compose(
	fn.partial(list.generate, plusOne),
	filterMultiples,
	reduceSum
);

console.log(sumOfMultiples(100));

function plusOne(x) {
	return x + 1;
}

function isMultiple(x) {
	return x % 3 === 0 || x % 5 === 0;
}

function sum(x, y) {
	return x + y;
}
