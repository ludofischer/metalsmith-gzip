var test = require('tape');
var compress = require('..');
var Metalsmith = require('metalsmith');

test('HTML is compressed', function(t) {
  t.plan(3);
  var metalsmith = Metalsmith('test/fixtures/basic');
  metalsmith
      .use(compress())
      .build(function(err, files) {
          t.error(err, 'No build errors');
          t.ok(files['index.html.gz'], 'The compressed file is created');
          t.ok(files['index.html'], 'The original file is conserved');
      });
});

test('PDF is skipped', function(t) {
  t.plan(3);
  var metalsmith = Metalsmith('test/fixtures/pdf');
  metalsmith
      .use(compress())
      .build(function(err, files) {
          t.error(err, 'No build errors');
          t.notOk(files['document.pdf.gz'], 'No compressed file is created');
          t.ok(files['document.pdf'], 'The original file is conserved');
      });
});

