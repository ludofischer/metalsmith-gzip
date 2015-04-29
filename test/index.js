var test = require('tape');
var compress = require('..');
var Metalsmith = require('metalsmith');

test('By default, only the specified files are compressed', function(t) {
  t.plan(9);
  var metalsmith = Metalsmith('test/fixtures/pdf');
  metalsmith
      .use(compress())
      .build(function(err, files) {
          t.error(err, 'No build errors');
          t.ok(files['style.css.gz'], 'The compressed CSS is created');
          t.ok(files['style.css'], 'The original CSS is conserved');
          t.ok(files['index.html.gz'], 'The compressed HTML is created');
          t.ok(files['index.html'], 'The original HTML is conserved');
          t.ok(files['document.svg.gz'], 'The compressed SVG is created');
          t.ok(files['document.svg'], 'The original SVG is conserved');
          t.notOk(files['document.pdf.gz'], 'No compressed PDF is created');
          t.ok(files['document.pdf'], 'The original PDF is conserved');
      });
});

test('Multimatch source definition is followed', function(t) {
  t.plan(9);
  var metalsmith = Metalsmith('test/fixtures/pdf');
  metalsmith
      .use(compress({ src: ["**/*.css", "**/*.pdf"] }))
      .build(function(err, files) {
          t.error(err, 'No build errors');
          t.ok(files['document.pdf.gz'], 'The compressed PDF is created');
          t.ok(files['document.pdf'], 'The original PDF is conserved');
          t.ok(files['style.css.gz'], 'The compressed CSS is created');
          t.ok(files['style.css'], 'The original CSS is conserved');
          t.notOk(files['index.html.gz'], 'No compressed HTML is created');
          t.ok(files['index.html'], 'The original HTML is conserved');
          t.notOk(files['document.svg.gz'], 'No compressed SVG is created');
          t.ok(files['document.svg'], 'The original SVG is conserved');
      });
});

test('Overwrite option has effect', function(t) {
    t.plan(9);
    var metalsmith = Metalsmith('test/fixtures/pdf');
    metalsmith
      .use(compress({overwrite: true}))
      .build(function(err, files) {
          t.error(err, 'No build errors');
          t.notOk(files['style.css.gz'], 'No separate compressed CSS is created');
          t.ok(files['style.css'], 'The original CSS is conserved');
          t.notOk(files['index.html.gz'], 'No separate compressed HTML is created');
          t.ok(files['index.html'], 'The original HTML is conserved');
          t.notOk(files['document.svg.gz'], 'No separate compressed SVG is created');
          t.ok(files['document.svg'], 'The original SVG is conserved');
          t.notOk(files['document.pdf.gz'], 'No compressed PDF is created');
          t.ok(files['document.pdf'], 'The original PDF is conserved');
      });
});
