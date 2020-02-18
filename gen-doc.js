/* eslint-disable */

const jsdoc2md = require('jsdoc-to-markdown');
const fs = require('fs');
const path = require('path');

var myArgs = process.argv.slice(2);

if (myArgs.length !== 2) {
	console.log("wrong number of arguments");
	return;
}

var wikiPath = myArgs[0];
var jsFilesPath = myArgs[1];

console.log('wikiPath:', wikiPath, 'jsFilesPath:', jsFilesPath);

// sync version: https://stackoverflow.com/a/28289589/7024066
function walkSync(currentDirPath, callback) {
	fs.readdirSync(currentDirPath).forEach(function (name) {
		var filePath = path.join(currentDirPath, name);
		var stat = fs.statSync(filePath);
		if (stat.isFile()) {
			callback(filePath, stat);
		} else if (stat.isDirectory()) {
			walkSync(filePath, callback);
		}
	});
}

// https://gist.github.com/drodsou/de2ba6291aea67ffc5bc4b52d8c32abd
function writeFileSyncRecursive(filename, content, charset) {
	const folders = filename.split(path.sep).slice(0, -1);
	if (folders.length) {
		// create folder path if it doesn't exist
		folders.reduce((last, folder) => {
			const folderPath = last ? last + path.sep + folder : folder;
			if (!fs.existsSync(folderPath)) {
				fs.mkdirSync(folderPath);
			}
			return folderPath;
		});
	}
	fs.writeFileSync(filename, content, charset);
}

var filePaths = [];

walkSync(jsFilesPath, function (filePath, stat) {
	if (path.extname(filePath) !== ".js") {
		return;
	}

	console.log("process", filePath);
	var output = jsdoc2md.renderSync({
		files: filePath
	});

	if (output === "") {
		console.log("no JSDoc comments found");
		return;
	}

	var completePath = wikiPath + `doc/${filePath}.md`;
	writeFileSyncRecursive(completePath, output);

	filePaths.push(`doc/${filePath}.md`);

	console.log("wrote md file", completePath);
});

var homeFilePath = wikiPath + "home.md";
var newlines = "\n\n";
var homeContent = "# Dokumentation der Mobilitätskonto SAP UI5 App" + newlines;

for (var i = 0; i < filePaths.length; i++) {
	var filePath = filePaths[i];
	homeContent = homeContent + `[${filePath}](/${filePath})` + newlines;
}

writeFileSyncRecursive(homeFilePath, homeContent);

console.log("wrote home.md file", homeFilePath);