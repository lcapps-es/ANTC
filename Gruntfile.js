module.exports = function(grunt) {
	
	require('load-grunt-tasks')(grunt);
	require('time-grunt')(grunt);

	var public = "./public/";
	var zipFiles = ['**', '!build*/**', '!.vscode/**', '!js/**', '!node_modules/**', '!scss/**', '!Gruntfile.js', '!LICENSE', '!manifest-*.json', '!package*.json', '!README.md', '!*.zip'];

	var modifyJSON = function(file, key, value) {
        if (!grunt.file.exists(file)) {
            grunt.log.error("file " + file + " not found");
            return true; //return false to abort the execution
        }
        var project = grunt.file.readJSON(file); //get file as json object

        project[key] = value;
        grunt.file.write(file, JSON.stringify(project, null, 2));
	};
	
	// Project configuration.
	grunt.initConfig({

		watch : {
			sass : {
				files : [ './scss/*.scss' ],
				tasks : 'sass'
			},
			js : {
				files : [ './js/*.js', './libs/*.js' ],
				tasks : 'js'
			}
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
			},
			libjs : {
				src : './libs/*.js',
				dest : './unificatorlibs.class.js'
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
					'./app.min.js' : './unificator.class.js',
					'./libs.min.js' : './unificatorlibs.class.js',
				}
			},
		},

		clean : {
			js : {
				src : [ './unificator.class.js' ]
			},
			libjs : {
				src : [ './unificatorlibs.class.js' ]
			}
		},

		copy: {
			chrome: {
				src: ['manifest-chrome.json'],
				dest: 'manifest.json'
			},
			firefox: {
				src: ['manifest-firefox.json'],
				dest: 'manifest.json'
			}
		},

		zip: {
			chrome: {
				src: zipFiles,
				dest: 'ANTC-chrome-'+grunt.option('ver')+'.zip',
			},
			firefox: {
				src: zipFiles,
				dest: 'ANTC-firefox-'+grunt.option('ver')+'.zip',
			},
		}

	});
	
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-zip');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');

	grunt.registerTask('default', [ 'sass', 'js' ]);
	grunt.registerTask('deploy', [ 'sass', 'js', 'version', 'prepareZip' ]);
	grunt.registerTask('devChrome', [ 'default', 'copy:chrome', 'watch' ]);
	grunt.registerTask('devFirefox', [ 'default', 'copy:firefox', 'watch' ]);
	grunt.registerTask('js', [ 'concat', 'babel', 'clean' ]);

	grunt.registerTask('version', function(){
		var version = grunt.option('ver');
		if(typeof version == 'undefined') {
			grunt.fail.fatal('No version provided (ver parameter)');
		}
		if(!/[0-9]+\.[0-9]+\.[0-9]+/.test(version)) {
			grunt.fail.fatal('Not a valid version');
		}
		modifyJSON('package.json', 'version', grunt.option('ver'));
		modifyJSON('manifest-chrome.json', 'version', grunt.option('ver'));
		modifyJSON('manifest-chrome.json', 'version_name', "Stable "+grunt.option('ver'));
		modifyJSON('manifest-firefox.json', 'version', grunt.option('ver'));
	});

	grunt.registerTask('prepareZip', function(){
		grunt.task.run(['copy:chrome', 'zip:chrome']);
		grunt.task.run(['copy:firefox', 'zip:firefox']);
	});

};
	