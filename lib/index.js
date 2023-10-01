var zlib = require('zlib'),
    each = require('async').each

function plugin(options) {
    const defaultOptions = {
        src: "**/*.+(html|css|js|json|xml|svg|txt)",
        gzip: {
            level: 6
        },
        overwrite: false
    };

    if (typeof options === 'object') {
      options = Object.assign(defaultOptions, options);
    } else {
        options = defaultOptions;
    }

    return function metalsmithGzip(files, metalsmith, done) {

        const filesTbCompressed = metalsmith.match(options.src, Object.keys(files));

        each(filesTbCompressed, function compress(file, asyncDone) {
            const gzip = zlib.createGzip(options.gzip);
            const data = files[file];
            const compressedChunks = [];

            gzip.on('data', function storeCompressedChunk(chunk) {
                compressedChunks.push(chunk);
            });

            gzip.on('error', function signalError(error) {
                asyncDone(error);
            });

            gzip.on('end', function concatenateCompressedChunks() {
                if (options.overwrite) {
                    data.contents = Buffer.concat(compressedChunks);
                } else {
                    const compressedFile = file + '.gz';
                    files[compressedFile] = Object.assign({}, data);
                    files[compressedFile].contents = Buffer.concat(compressedChunks);
                }
                asyncDone();
            });

            gzip.write(data.contents);
            gzip.end();

        }, done);
    };
}

module.exports = plugin;
