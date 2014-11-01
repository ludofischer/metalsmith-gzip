# metalsmith-gzip [![Build Status](https://travis-ci.org/ludovicofischer/metalsmith-gzip.svg?branch=master)](https://travis-ci.org/ludovicofischer/metalsmith-gzip)

A [Metalsmith](http://metalsmith.io) plugin that creates gzipped copies of your site's content. This is useful to host a website on Amazon S3, where it is impossible compress files on the fly in the server.

## Installation

```
$ npm install metalsmith-gzip
```

## Usage

```javascript
var Metalsmith = require('metalsmith');
var compress = require('metalsmith-gzip');

var metalsmith = new Metalsmith(__dirname)
  .use(compress());

```

metalsmith-gzip will gzip a file if the extension matches this regular expression:

```javascript
/\.[html|css|js|json|xml|svg|txt]/
```

The choice of files to compress is loosely based on the [HTML5 Boilerplate server configuration](https://github.com/h5bp/server-configs-apache).

### Customization

To customize the files metalsmith-gzip compresses pass an options object, where the `src` property is a pattern [multimatch](https://github.com/sindresorhus/multimatch) understands.

```javascript
var metalsmith = new Metalsmith(__dirname)
  .use(compress({src: ['**/*.js', '**/*.css']})); // only compresses JavaScript and CSS

```

### Uploading to the server

You need create a script to upload the gzipped versions of the files to your preferred hosting provider yourself. Take care to serve the files with the correct Content-Encoding.

## Acknowledgements

This plugin was inspired by the [Middleman gzip extension](http://middlemanapp.com/advanced/file-size-optimization/). 
