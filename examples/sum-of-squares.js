var fn, list, numbers, sumOfSquares, mapSquares, reduceSum, composedSumOfSquares;

fn = require('../fn');
list = require('../list');

mapSquares = fn.partial(list.map, square);
reduceSum = fn.partial(list.reduce, sum, 0);
composedSumOfSquares = fn.compose(mapSquares, reduceSum);

numbers = list.generate(fn.identity, 5);

sumOfSquares = reduceSum(mapSquares(numbers));
console.log(sumOfSquares);

sumOfSquares = composedSumOfSquares(numbers);
console.log(sumOfSquares);

sumOfSquares = numbers.map(square).reduce(sum);
console.log(sumOfSquares);

function sum(x, y) {
	return x + y;
}

function square(x) {
	return x * x;
}
