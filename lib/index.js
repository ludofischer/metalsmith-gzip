var zlib = require('zlib'),
  each = require('async').each,
  clone = require('lodash.clone'),
  defaults = require('lodash.defaults'),
  multimatch = require('multimatch');


module.exports = plugin;

function plugin(options) {
  var defaultOptions = {
    src: "**/*.+(html|css|js|json|xml|svg|txt)",
    gzip: {
        level: 6
    }
  };

  if (typeof options === 'object') {
    options = defaults(options, defaultOptions);
  } else {
      options = defaultOptions;
  }

  return function metalsmithGzip(files, metalsmith, done) {

      var filesTbCompressed = multimatch(Object.keys(files), options.src);

      each(filesTbCompressed, function compress(file, done) {
          var gzip = zlib.createGzip(options.gzip);
          var data = files[file];
          var compressedChunks = [];

          gzip.on('data', function storeCompressedChunk(chunk) {
              compressedChunks.push(chunk);
          });

          gzip.on('error', function signalError(error) {
              done(error);
          });

          gzip.on('end', function concatenateCompressedChunks() {
              var compressedFile = file + '.gz';
              files[compressedFile] = clone(data);
              files[compressedFile].contents = Buffer.concat(compressedChunks);
              done();
          });

          gzip.write(data.contents);
          gzip.end();

      }, done);
  };
}
