const zlib = require('zlib');

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
        const filesTbCompressed = metalsmith.match(options.src, Object.keys(files));
        Promise
            .all(filesTbCompressed.map(filepath => compress(files[filepath], filepath, options.gzip)))
            .then(compressed => compressed.forEach(([path, buffer]) => {
                if (options.overwrite) {
                    files[path].contents = buffer
                } else {
                    const compressedPath = `${path}.gz`
                    files[compressedPath] = { ...files[path], contents: buffer }
                }
            }))
            .then(done, done)
    };
}

module.exports = plugin;
