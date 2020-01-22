/* global process:true */
"use strict";
module.exports = function (grunt) {
	// Variables from environment

	// Project properties
	var webAppDir = "webapp";
	var targetDir = "dist";

	var preloadPrefix = "Mobilitaetskonto/Mobilitaetskonto/";
	var namespace = "Mobilitaetskonto.Mobilitaetskonto";

	var resourceroots = {};
	resourceroots[namespace] = './base';
	var preprocessorsWebAppDir = {};
	preprocessorsWebAppDir['{' + webAppDir + ',' + webAppDir + '/!(test)}/*.js'] = ['coverage'];


	// Project configuration.
	var config = {
		eslint: {
			options: {
				configFile: ".eslintrc.js"
			},
			target: [webAppDir + "/**/*.js"]
		},
		karma: {
			options: {
				// base path that will be used to resolve all patterns (eg. files, exclude)
				client: {
					openui5: {
						config: {
							theme: 'sap_belize',
							language: 'EN',
							bindingSyntax: 'complex',
							compatVersion: 'edge',
							preload: 'async',
							resourceroots: resourceroots
						},
						tests: [
							preloadPrefix + '/test/unit/AllTests',
						]
					}
				},
				browserNoActivityTimeout: '30000',
				frameworks: ['qunit', 'openui5'],
				openui5: {
					path: "https://<<your-gateway-system>>/sap/public/bc/ui5_ui5/1/resources/sap-ui-core.js" // eslint-disable-line
				},
				files: [{
					pattern: '**',
					included: false,
					served: true,
					watched: true
				}],
				reporters: ['progress'],
				port: 9876,
				logLevel: 'DEBUG',
				browserConsoleLogOptions: {
					level: 'warn'
				},
				browsers: ['Chrome'],
				coverageReporter: {
					includeAllSources: true,
					reporters: [{
						type: 'html',
						dir: '../coverage/'
					}, {
						type: 'text'
					}],
					check: {
						each: {
							statements: 100,
							branches: 100,
							functions: 100,
							lines: 100
						}
					}
				}
			},
			src: {
				basePath: webAppDir,
				singleRun: true,
				browsers: ['PhantomJS'],
				preprocessors: preprocessorsWebAppDir,
				reporters: ['progress', 'coverage']
			}
		}
	};

	grunt.loadNpmTasks("grunt-eslint");
	grunt.loadNpmTasks("@sap/grunt-sapui5-bestpractice-build");

	grunt.loadNpmTasks('grunt-karma');
	grunt.loadNpmTasks('grunt-openui5');

	grunt.config.merge(config);

	grunt.registerTask("check-lint", "Check validation", function () {
		var validation = grunt.file.readJSON(targetDir + "/di.code-validation.core_issues.json"),
			hasErrors = false;
		for (var check in validation.results) {
			grunt.log.writeln("Result for: " + check);
			for (var file in validation.results[check].issues) {
				validation.results[check].issues[file].forEach(function (error) {
					if (error.severity === "error") {
						grunt.log.error(error.path + "(" + error.line + "," + error.column + ") : " + error.message).error();
						hasErrors = true;
					}
				});
			}
		}
		if (hasErrors) {
			grunt.fail.warn('Errors found during code validation');
		}
	});
	
	grunt.registerTask('unit-test', ['karma:src']);
	grunt.registerTask("fiori-test", ["lint", "check-lint"]);
	grunt.registerTask("buildapp", ["build"]);
	grunt.registerTask("default", ["build"]);
};
