/* global process:true */
"use strict";
module.exports = function (grunt) {
	// Variables from environment

	// Project properties
	var webAppDir = "webapp";
	var targetDir = "dist";

	// Project configuration.
	var config = {
		eslint: {
			options: {
				configFile: ".eslintrc.js"
			},
			target: [webAppDir + "/**/*.js"]
		}
	};

	grunt.loadNpmTasks("grunt-eslint");
	grunt.loadNpmTasks("@sap/grunt-sapui5-bestpractice-build");

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

	grunt.registerTask("fiori-test", ["lint", "check-lint"]);
	grunt.registerTask("buildapp", ["build"]);
	grunt.registerTask("default", ["build"]);
};