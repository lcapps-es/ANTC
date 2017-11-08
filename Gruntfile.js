module.exports = function(grunt) {
	
	require('load-grunt-tasks')(grunt);
	require('time-grunt')(grunt);

	var path = "";

	
	// Project configuration.
	grunt.initConfig({

		watch : {
			sass : {
				files : [ './scss/*.scss' ],
				tasks : 'sass'
			},
		},

		sass : {
			options : {
				sourceMapContents : true,
				sourceMapEmbed : true,
				outputStyle: 'compressed'
			},
			dist: {
				files: {
					'./style.min.css' : './scss/main.scss'
				}
			}
		}

	});
	
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-sass');

	grunt.registerTask('default', [ 'sass' ]);
	grunt.registerTask('dev', [ 'default', 'watch', ]);

};
	