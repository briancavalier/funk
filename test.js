var fn = require('./fn');
var list = require('./list');
var iterator = require('./iterator');

var next = list.iterator(list(1, 2, 3));

next = fn.compose(
	iterator.filter(function(x) { return x < 5; }),
	iterator.map(function(x) { return x * 2; })
)(next);
// next = iterator.filter(function(x) { return x < 5; }, iterator.map(function(x) { return x * 2; }, next));

iterator.each(console.log.bind(console), next);
