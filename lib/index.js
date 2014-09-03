var zlib = require('zlib'),
  extname = require('path').extname,
  each = require('async').each,
  clone = require('lodash.clone');


module.exports = plugin;

function plugin() {

  var compressible = /\.[html|css|js|json|xml|svg|txt]/;
    
  return function(files, metalsmith, done) {
        
      each(Object.keys(files), function(file, done) {

          if (compressible.test(file)) {
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

          } else {
              done();
          }
    }, done);
  };
}
