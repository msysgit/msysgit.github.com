'use strict';

module.exports = function(grunt) {

	grunt.initConfig({

		cssmin: {
			compress: {
				options: {
					compatibility: 'ie8',
					keepSpecialComments: 0
				},
				files: {
					'css/pack.css': [
						'css/normalize.css',
						'css/jquery.fancybox.css',
						'css/style.css',
						'css/small.css'
					]
				}
			}
		},

		uglify: {
			options: {
				compress: {
					warnings: false
				},
				mangle: true,
				preserveComments: false
			},
			compress: {
				files: {
					'js/pack.js': [
						'js/jquery-1.10.2.min.js',
						'js/jquery.fancybox.js',
						'js/jquery.mousewheel.js'
					]
				}
			}
		},

		connect: {
			server: {
				options: {
					base: './',
					hostname: 'localhost',
					keepalive: true,
					open: true,
					port: 4000
				}
			}
		}

	});

	// Load the grunt plugins
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('default', ['cssmin', 'uglify']);
};
