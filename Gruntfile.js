module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		jshint: {

			options: {
				reporter: require('json-stylish')
			},

			build: ['Gruntfile.js', 'src/**/*.js']

		}
	});

	grunt.loadNpmTask('grunt-contrib-watch');

	grunt.loadNpmTask('grunt-contrib-uglify');
	grunt.loadNpmTask('grunt-contrib-jshint');
	grunt.loadNpmTask('jshint-stylish');

	grunt.loadNpmTask('grunt-contrib-less');
	grunt.loadNpmTask('grunt-contrib-cssmin');

	grunt.loadNpmTask('grunt-contrib-pug');
};
