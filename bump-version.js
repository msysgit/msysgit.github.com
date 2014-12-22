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

var autoUpdate = function() {
	Array.prototype.lastElement = function() {
		return this[this.length - 1];
	}

	Array.prototype.filterRegex = function(regex) {
		return this.map(function(value) {
			var match = value.match(regex);
			if (!match)
				return undefined;
			return match.lastElement();
		}).filter(function (value) {
			return value !== undefined;
		});
	};

	var determineVersion = function(body) {
		var tagNames = body.replace(/\n/gm, ',').split(',')
			.filterRegex(/"tag_name": *"([^"]*)"/);
		var regex = /^Git-\d+\.\d+\.\d+(\.\d+)?-preview(.*)/;
		var timestamps = tagNames.filterRegex(regex).sort();
		var latest = timestamps.lastElement();
		regex = new RegExp('^Git-(.*)-preview' + latest);
		var version = tagNames.filterRegex(regex)[0];
		regex = new RegExp('^Git-' + version + '-preview');
		var sameVersionCount = tagNames.filterRegex(regex).length;
		if (sameVersionCount > 1)
			version += ' Update ' + (sameVersionCount - 1);
		process.stderr.write('Auto-detected version ' + version
			+ ' (' + latest + ')\n');
		return [ version, latest ];
	};

	var https = require('https');
	https.body = '';
	https.get({
		'hostname': 'api.github.com',
		'path': '/repos/msysgit/msysgit/releases',
		'headers': {
			'User-Agent': 'Git for Windows version updater'
		}
	}, function(res) {
		if (res.statusCode != 200)
			die(res);
		res.on('data', function(data) {
			https.body += data.toString();
		});
		res.on('end', function() {
			var result = determineVersion(https.body);
			updateVersion(result[0], result[1]);
		});
	});
};

if (process.argv.length == 3 && '--auto' == process.argv[2])
	autoUpdate();
else if (process.argv.length == 4)
	updateVersion(process.argv[2], process.argv[3]);
else
	die('Usage: node ' + process.argv[1] + ' <version> <timestamp>\n');

