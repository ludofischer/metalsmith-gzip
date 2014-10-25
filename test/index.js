var test = require('tape');
var compress = require('..');
var Metalsmith = require('metalsmith');

test('By default, everything is compressed', function(t) {
  t.plan(5);
  var metalsmith = Metalsmith('test/fixtures/pdf');
  metalsmith
      .use(compress())
      .build(function(err, files) {
          t.error(err, 'No build errors');
          t.ok(files['style.css.gz'], 'The compressed file is created');
          t.ok(files['style.css'], 'The original file is conserved');
          t.ok(files['document.pdf.gz'], 'The compressed file is created');
          t.ok(files['document.pdf'], 'The original file is conserved');
      });
});

test('Multimatch source definition is followed', function(t) {
  t.plan(5);
  var metalsmith = Metalsmith('test/fixtures/pdf');
  metalsmith
      .use(compress({ src: ["**/*.css"] }))
      .build(function(err, files) {
          t.error(err, 'No build errors');
          t.notOk(files['document.pdf.gz'], 'No compressed file is created');
          t.ok(files['document.pdf'], 'The original file is conserved');
          t.ok(files['style.css.gz'], 'The compressed file is created');
          t.ok(files['style.css'], 'The original file is conserved');
      });
});

