'use strict;'

const UNITS = [
    'B',
    'kB',
    'MB',
    'GB',
    'TB',
    'PB',
];

/**
 * This function is inspired by the methos in visionmedia/bytes and sindresorhus/pretty-bytes
 * both licensed under the MIT license.
 *
 * @param {number} value
 * @return {string | null}
 */
function formatBytes(value) {
    if (!Number.isFinite(value)) {
        return null;
    }

    const mag = Math.abs(value);

    const exponent = Math.min(Math.floor(Math.log(mag) / Math.log(1024)), UNITS.length - 1);
    const result = mag / (1024 ** exponent);
    return result.toPrecision(3) + UNITS[exponent];
}

module.exports = formatBytes;
