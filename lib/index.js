var zlib = require('zlib'),
  extname = require('path').extname,
  each = require('async').each,
  clone = require('lodash.clone'),
  multimatch = require('multimatch');

module.exports = plugin;

function plugin(options) {
  var src;
  if (options && options.src) {
      src = options.src;
  } else {
      src = "**/*.+(html|css|js|json|xml|svg|txt)";
  }

  return function(files, metalsmith, done) {

      var filesTbCompressed = multimatch(Object.keys(files), src);

      each(filesTbCompressed, function(file, done) {

        var data = files[file];
         zlib.gzip(data.contents, function(err, buffer) {
            if (!!err) {
                done(err);
            }

            var compressedFile = file + '.gz';
            files[compressedFile] = clone(data);
            files[compressedFile].contents = buffer;
            done();
        });

    }, done);
  };
}
