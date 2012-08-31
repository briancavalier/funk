(function() {

	var config = {};

	config.all = {
		environment: 'node',
		rootPath: '../',
		tests: ['test/**/*-test.js']
	};

	if (typeof module !== 'undefined') {
		module.exports = config;
	}

})();