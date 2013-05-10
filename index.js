var fs = require('fs');
var path = require('path');

var through = require('through');
var falafel = require('falafel');
var gen = require('escodegen').generate;

module.exports = brpkg;

function brpkg(file) {
	if (!/\.js$/.test(file)) return through();
	var data = '';

	var tr = through(write, end);
	return tr;

	function write(chunk) {
		data += chunk;
	}

	function end() {
		try {
			transform(data, file, tr);
		} catch (err) {
			this.emit('error', new Error(err.message + ' (' + file + ')'))
		}
	}
}

function transform(data, file, tr) {
	var dirname = path.dirname(file);
	var pending = 0;
	var vars = ['__filename', '__dirname'];
	var output = falafel(data, function (node) {
		if (!isRequire(node)) {
			return;
		}
		var arg = gen(node.arguments[0]);
		var reqPath = Function(vars, 'return ' + arg)(file, dirname);

		reqPath = path.resolve(dirname, reqPath);
		if (!/\/package\.json$/.test(reqPath)) return;

		while (node.parent.type === 'MemberExpression') node = node.parent;
		var req = gen(node);
		++pending;
		fs.readFile(reqPath, 'utf8', function (err, src) {
			if (err) return tr.emit('error', err);
			req = req.replace(/^require\(.+\)/, '(' + src + ')');
			var value = eval(req);
			node.update(JSON.stringify(value));
			if (!--pending) finish(output, tr);
		});
	});
	if (!pending) finish(output, tr);
}

function finish(output, tr) {
	tr.queue(String(output));
	tr.queue(null);
}

function isRequire(node) {
	return node.type === 'CallExpression'
		&& node.callee.type === 'Identifier'
		&& node.callee.name === 'require'
}