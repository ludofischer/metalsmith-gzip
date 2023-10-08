'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
var compress = require('..');
var Metalsmith = require('metalsmith');

test('By default, only the specified files are compressed', async function(t) {
  var metalsmith = Metalsmith('test/fixtures/pdf');
  return metalsmith
      .env('DEBUG', process.env.DEBUG)
      .use(compress())
      .build(function(err, files) {
          assert.ifError(err, 'No build errors');
          assert(files['style.css.gz'], 'The compressed CSS is created');
          assert(files['style.css'], 'The original CSS is conserved');
          assert(files['index.html.gz'], 'The compressed HTML is created');
          assert(files['index.html'], 'The original HTML is conserved');
          assert(files['document.svg.gz'], 'The compressed SVG is created');
          assert(files['document.svg'], 'The original SVG is conserved');
          assert.strictEqual(files['document.pdf.gz'], undefined, 'No compressed PDF is created');
          assert(files['document.pdf'], 'The original PDF is conserved');
      });
});

test('Multimatch source definition is followed', async function(t) {
  var metalsmith = Metalsmith('test/fixtures/pdf');
  return metalsmith
      .env('DEBUG', process.env.DEBUG)
      .use(compress({ src: ["**/*.css", "**/*.pdf"] }))
      .build(function(err, files) {
          assert.ifError(err, 'No build errors');
          assert(files['document.pdf.gz'], 'The compressed PDF is created');
          assert(files['document.pdf'], 'The original PDF is conserved');
          assert(files['style.css.gz'], 'The compressed CSS is created');
          assert(files['style.css'], 'The original CSS is conserved');
          assert.strictEqual(files['index.html.gz'], undefined, 'No compressed HTML is created');
          assert(files['index.html'], 'The original HTML is conserved');
          assert.strictEqual(files['document.svg.gz'], undefined, 'No compressed SVG is created');
          assert(files['document.svg'], 'The original SVG is conserved');
      });
});

test('Overwrite option has effect', async function(t) {
    var metalsmith = Metalsmith('test/fixtures/pdf');
    return metalsmith
      .env('DEBUG', process.env.DEBUG)
      .use(compress({overwrite: true}))
      .build(function(err, files) {
          assert.ifError(err, 'No build errors');
          assert.strictEqual(files['style.css.gz'], undefined, 'No separate compressed CSS is created');
          assert(files['style.css'], 'The original CSS is conserved');
          assert.strictEqual(files['index.html.gz'], undefined, 'No separate compressed HTML is created');
          assert(files['index.html'], 'The original HTML is conserved');
          assert.strictEqual(files['document.svg.gz'], undefined, 'No separate compressed SVG is created');
          assert(files['document.svg'], 'The original SVG is conserved');
          assert.strictEqual(files['document.pdf.gz'], undefined, 'No compressed PDF is created');
          assert(files['document.pdf'], 'The original PDF is conserved');
      });
});
