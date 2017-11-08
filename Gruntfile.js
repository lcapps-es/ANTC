module.exports = function(grunt) {
	
	require('load-grunt-tasks')(grunt);
	require('time-grunt')(grunt);

	var public = "./public/";

	
	// Project configuration.
	grunt.initConfig({

		watch : {
			sass : {
				files : [ './scss/*.scss' ],
				tasks : 'sass'
			},
			js : {
				files : [ './js/*.js' ],
				tasks : 'js'
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
		},

		concat : {
			options: {
				separator_start: ' ',
				separator_end: ' '
			},
			js : {
				src : ['./js/base.class.js', './js/*.class.js'],
				dest : './unificator.class.js'
			}
		},

		babel : {
			options : {
				sourceMap : true,
				minified : true,
				comments : false,
				//presets : [ 'babel-preset-es2015' ]
				//, plugins: ['transform-remove-console'] -- npm install babel-plugin-transform-remove-console --save-dev
			},
			dist : {
				files : {
					'./app.min.js' : './unificator.class.js'
				}
			}
		},

		clean : {
			js : {
				src : [ './unificator.class.js' ]
			},
		}


	});
	
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-sass');

	grunt.registerTask('default', [ 'sass', 'js' ]);
	grunt.registerTask('dev', [ 'default', 'watch' ]);
	grunt.registerTask('js', [ 'concat:js', 'babel', 'clean:js' ]);

};
	