'use strict';
module.exports = function(grunt){

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		compass: {
			dist: {
				options: {
					config: 'config.rb'
				}
			}
		},
		watch: {
			css: {
				files: '**/*.scss',
				tasks: ['compass', 'notify:compass'],
				options: {
					//events: 'all',
					spawn: false,
					livereload: true,
				}
			}
		},
		notify: {
			compass: {
				options: {
					title: 'Task Complete',
					message: 'Compass Compiled'
				}
			},
			init: {
				options: {
					title: "Grunt",
					message: "Ready"
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-notify');

	// Default task(s).
	grunt.registerTask('default', [ 'notify:init', 'compass', 'watch' ]);

}
