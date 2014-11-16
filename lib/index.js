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
  
  var level;
  if (options && options.gzip.level) {
      level = options.gzip.level;
  } else {
      level = 6;
  }

  return function(files, metalsmith, done) {

      var filesTbCompressed = multimatch(Object.keys(files), src);

      each(filesTbCompressed, function(file, done) {

        var data = files[file];
        var streamifiedBuffer = new stream.Transform();
        streamifiedBuffer.push(data);
        stream.pipe(Gzip).pipe(out) {
          if (!!err) {
            done(err);
          }
        }
        streamifiedBuffer.on('end', function() {
          var rebuffered = Buffer.concat(this.data);
          return rebuffered;
        });
        streamifiedBuffer.end();

            var compressedFile = file + '.gz';
            files[compressedFile] = clone(data);
            files[compressedFile].contents = buffer;
            done();
        });

    }, done);
  };
}
