module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		clean: ['temp/'],

		jshint: {
			options: {
				reporter: require('jshint-stylish')
			},

			build: ['Gruntfile.js', 'src/**/*.js']
		},
		uglify: {
			options: {
				banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n'
			},
			build: {
				files: {
					'dist/js/bullets.min.js': 'src/js/bullets.js'
				}
			}
		},

		pug: {
			build: {
				files: {
					'dist/index.html': 'src/index.pug'
				}
			}
		},

		less: {
			build: {
				files: {
					'temp/bullets.css': 'src/css/bullets.less'
				}
			}
		},
		cssmin: {
			options: {
				banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n'
			},
			build: {
				files: {
					'dist/css/bullets.min.css': 'temp/bullets.css'
				}
			}
		}
	});

	grunt.registerTask('default', ['jshint', 'uglify', 'pug', 'less', 'cssmin', 'clean']);

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-clean');

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('jshint-stylish');

	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-cssmin');

	grunt.loadNpmTasks('grunt-contrib-pug');
};
