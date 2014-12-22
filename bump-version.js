/*
 * This is a simple script to update the versions in Git for Windows'
 * home page.
 */

var fs = require('fs');

var die = function(err) {
	process.stderr.write(err + '\n');
	process.exit(1);
};

var updateVersion = function(version, timestamp) {
	if (!version.match(/^\d+\.\d+\.\d+(\.\d+)?$/))
		die('Incorrect version format: ' + version);
	if (!timestamp.match(/^\d{8}(-\d+)?$/))
		die('Incorrect timestamp format: ' + timestamp);

	var fullString = version.replace(/ .*/, '') + '-preview' + timestamp;
	var fullRegex = /\d+\.\d+\.\d+(\.\d+)?-preview\d{8}(-\d+)?/gm;
	var versionRegex = /Version \d+\.\d+\.\d+(\.\d+)?[^<]*/gm;
	fs.readFile('index.html', 'utf8', function (err, data) {
		if (err)
			die(err);
		data = data.replace(fullRegex, fullString);
		data = data.replace(versionRegex, 'Version ' + version);
		fs.writeFile('index.html', data);
	});
};

if (process.argv.length != 4)
	die('Usage: node ' + process.argv[1] + ' <version> <timestamp>\n');

updateVersion(process.argv[2], process.argv[3]);
