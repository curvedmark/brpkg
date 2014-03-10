var test = require('tap').test;
var browserify = require('browserify');

var vm = require('vm');
var fs = require('fs');
var path = require('path');

test('do not fail bundling file when "undefined" got passed to require', function (t) {
    t.plan(1);

    var b = browserify();
    b.add('./files/undefined.js');
    b.transform('..');

    b.bundle(function (err, src) {
        if (err) t.fail(err);
        t.ok(true);
    });
});