/*global module:false*/
module.exports = function(grunt) {

	var fs, json5;

	fs = require('fs');
	json5 = require('json5');

	// Project configuration.
	grunt.initConfig({
		lint: {
			files: ['grunt.js', '*.js', 'test/**/*.js']
		},

		jshint: {
			options: json5.parse(''+fs.readFileSync('.jshintrc'))
		},

		buster: {
			test: {
				config: 'test/buster.js'
			}
		},

		watch: {
			files: '<config:lint.files>',
			tasks: 'default'
		}

	});

	grunt.loadNpmTasks('grunt-buster');
	grunt.loadNpmTasks('grunt-css');
	grunt.loadNpmTasks('grunt-html');

	// Use buster for testing
	grunt.registerTask('test', 'buster');

	// htmllint appears to be broken, don't use it yet.
	// grunt.registerTask('lintall', 'lint csslint htmllint');
	grunt.registerTask('lintall', 'lint');

	grunt.registerTask('default', 'lintall test');

};