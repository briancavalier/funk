var fn = require('./fn');
var list = require('./list');
var iterator = require('./iterator');
var result;
var i, l1, l2, l3;

l1 = list.generate(list.generate(fn.identity), 100);

var start = Date.now();
for(i = 0;i < 10000; i++) {
	result = list.concat(l1);
}
console.log(Date.now() - start);