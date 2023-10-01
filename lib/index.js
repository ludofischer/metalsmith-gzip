const zlib = require('zlib'),
      bytes = require('bytes');

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

const defaultOptions = {
    src: "**/*.+(html|css|js|json|xml|svg|txt)",
    gzip: {
        level: 6
    },
    overwrite: false
};

function plugin(options) {
    options = { ...defaultOptions, ...(options || {}) }

    return function metalsmithGzip(files, metalsmith, done) {
        const debug = metalsmith.debug('metalsmith-gzip')
        debug('Running with options %o', options)

        const filesTbCompressed = metalsmith.match(options.src, Object.keys(files));
        const fileSizeTbCompressed = filesTbCompressed.reduce((total, path) => {
            total += Buffer.byteLength(files[path].contents)
            return total
        }, 0)
        debug('Matched %s files to compress (= %s)', filesTbCompressed.length, bytes(fileSizeTbCompressed));

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
                debug('Done compressing %s files (= %s, %s% of original)', filesTbCompressed.length, bytes(newSizes), percentageNewSize)
                done()
            }, err => {
                debug.error('Compression error: %O', err)
                done(err)
            })
    };
}

module.exports = plugin;
