# metalsmith-gzip

A [Metalsmith](http://metalsmith.io) plugin that lets you create gzipped versions of your build files. This is useful if you are hosting your website on Amazon S3, where it is not possible to set up compression on the server.

## Installation

  $ npm install metalsmith-gzip

## Usage

```javascript
var Metalsmith = require('metalsmith');
var compress = require('metalsmith-gzip');

var metalsmith = new Metalsmith(__dirname)
  .use(compress());

```

`metalsmith-gzip` will produce a gzipped version of all files in your build whose extension matches the following regular expression

```javascript
/\.[html|css|js|json|xml|svg|txt]/
```

The choice of files to compress is loosely based on the [HTML5 Boilerplate server configuration](https://github.com/h5bp/server-configs-apache).

You will then need to set up a script yourself to upload the gzipped versions of the files to your preferred hosting provider. Take care that the files are served with the correct Content-encoding.

 At the moment, `metalsmith-gzip` does not take any configuration options. 

## Acknowledgements

The functionality was inspired by the [Middleman gzip extension](http://middlemanapp.com/advanced/file-size-optimization/). 
