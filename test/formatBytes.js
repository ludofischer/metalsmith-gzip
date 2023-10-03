'use strict';

const test = require('tape');
const formatBytes = require('../lib/formatBytes.js');

test('Debug format bad input', function(t) {
    t.plan(2);
    t.ok(formatBytes(undefined) === null, 'It returns null when the input is undefined');
    t.ok(formatBytes(true) === null, 'It returns null when the input is bad');
});

test('Debug format should correctly format bytes', function(t) {
    t.plan(6);
    t.ok(formatBytes(23) === '23.0B', 'It formats small sizes');
    t.ok(formatBytes(324 * (1 << 10)) === '324kB', 'It formats kilobytes');
    t.ok(formatBytes(1 * (1 << 20)) === '1.00MB', 'It formats megabtyes');
    t.ok(formatBytes(1 * (1 << 30)) === '1.00GB', 'It formats gigabytes');
    t.ok(formatBytes(450 * (1 << 20)) === '450MB', 'It formats hundreds of megabytes');
    t.ok(formatBytes(1 * (1 << 30) + 450 * (1 << 20)) === '1.44GB', 'It formats gigabytes and megabytes');
});
