var zlib = require('zlib'),
  clone = require('lodash.clone'),
    multimatch = require('multimatch'),
    each = require('async').each;

module.exports = plugin;

function plugin(options) {
  var src;
  if (options && options.src) {
      src = options.src;
  } else {
      src = "**/*.+(html|css|js|json|xml|svg|txt)";
  }

  var level;
    if (options && options.gzip && options.gzip.level) {
      level = options.gzip.level;
  } else {
      level = 6;
  }

  return function(files, metalsmith, done) {

      var filesTbCompressed = multimatch(Object.keys(files), src);

      each(filesTbCompressed, function compress(file, done) {
          var gzip = zlib.createGzip({level: level});
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
