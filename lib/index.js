'use strict';

const zlib = require('zlib');
const formatBytes = require('./formatBytes.js');

function compress(file, path, gzipOpts) {
    return new Promise((resolve, reject) => {
        const gzip = zlib.createGzip(gzipOpts);
        const compressedChunks = [];

        gzip.on('data', function storeCompressedChunk(chunk) {
            compressedChunks.push(chunk);
        });

        gzip.on('error', reject);

        gzip.on('end', function concatenateCompressedChunks() {
            resolve([path, Buffer.concat(compressedChunks)]);
        });

        gzip.write(file.contents);
        gzip.end();
    });
}

/**
 * @typedef {Object} Options
 * @property {string} [src] Glob pattern of files to match for compression
 * @property {import('zlib').ZlibOptions} [gzip] Options to pass to `zlib.createGzip`
 * @property {boolean} [overwrite=false] Whether to overwrite original files (true) or create a new file with .gz suffix.
 */

/** @type {Options} */
const defaultOptions = {
    src: "**/*.+(html|css|js|json|xml|svg|txt)",
    gzip: {
        level: 6
    },
    overwrite: false
};

/**
 * A Metalsmith plugin to compress build files with gzip.
 * @param {Options} options 
 * @returns {import('metalsmith').Plugin}
 */
function gzip(options) {
    options = { ...defaultOptions, ...(options || {}) }

    return function gzip(files, metalsmith, done) {
        const debug = metalsmith.debug('metalsmith-gzip')
        debug('Running with options %o', options)

        const filesTbCompressed = metalsmith.match(options.src, Object.keys(files));
        const fileSizeTbCompressed = filesTbCompressed.reduce((total, path) => {
            total += Buffer.byteLength(files[path].contents)
            return total
        }, 0)
        debug('Matched %s files to compress (= %s)', filesTbCompressed.length, formatBytes(fileSizeTbCompressed));

        Promise
            .all(filesTbCompressed.map(filepath => compress(files[filepath], filepath, options.gzip)))
            .then(compressed => {
                let [newSizes] = [0]
                compressed.forEach(([path, buffer]) => {
                    newSizes += Buffer.byteLength(buffer)
                    if (options.overwrite) {
                        files[path].contents = buffer
                    } else {
                        const compressedPath = `${path}.gz`
                        files[compressedPath] = { ...files[path], contents: buffer }
                    }
                })
                const percentageNewSize = ((newSizes / fileSizeTbCompressed) * 100).toFixed(1)
                debug('Done compressing %s files (= %s, %s% of original)', filesTbCompressed.length, formatBytes(newSizes), percentageNewSize)
                done()
            }, err => {
                debug.error('Compression error: %O', err)
                done(err)
            })
    };
}

module.exports = gzip;
