'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const formatBytes = require('../lib/formatBytes.js');

test('Debug format bad input', function(t) {
    assert(formatBytes(undefined) === null, 'It returns null when the input is undefined');
    assert(formatBytes(true) === null, 'It returns null when the input is bad');
});

test('Debug format should correctly format bytes', function(t) {
    assert(formatBytes(23) === '23.0B', 'It formats small sizes');
    assert(formatBytes(324 * (1 << 10)) === '324kB', 'It formats kilobytes');
    assert(formatBytes(1 * (1 << 20)) === '1.00MB', 'It formats megabtyes');
    assert(formatBytes(1 * (1 << 30)) === '1.00GB', 'It formats gigabytes');
    assert(formatBytes(450 * (1 << 20)) === '450MB', 'It formats hundreds of megabytes');
    assert(formatBytes(1 * (1 << 30) + 450 * (1 << 20)) === '1.44GB', 'It formats gigabytes and megabytes');
});
