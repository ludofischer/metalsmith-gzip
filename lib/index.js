var zlib = require('zlib'),
  extname = require('path').extname,
  each = require('async').each,
  _ = require("lodash"),
  clone = require('lodash.clone'),
  multimatch = require('multimatch');

module.exports = plugin;

function plugin(options) {

  options = normalize(options);

  return function(files, metalsmith, done) {

      var filesTbCompressed = multimatch(Object.keys(files), options.src);

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

function normalize(options) {
  var defaults = {
    src: ["**/*"]
  };
  options = _.extend({}, defaults, options);

  return options;
}
