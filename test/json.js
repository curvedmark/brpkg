var test = require('tap').test;
var browserify = require('browserify');

var vm = require('vm');
var fs = require('fs');
var path = require('path');

var version = require('./files/package.json').version;

test('bundle a file', function (t) {
    t.plan(1);

    var b = browserify();
    b.add('./files/json.js');
    b.transform('..');

    b.bundle(function (err, src) {
        if (err) t.fail(err);
        vm.runInNewContext(src, { console: { log: log } });
    });

    function log (msg) {
        t.equal(msg.version, version);
    }
});