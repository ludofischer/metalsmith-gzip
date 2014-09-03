# metalsmith-gzip

A [Metalsmith](http://metalsmith.io) plugin that lets you create gzipped versions of your build files. This is useful if you are hosting your website on Amazon S3, where it is not possible to set up compression on the server.

## Usage

`metalsmith-gzip` will produce a gzipped version of all files in your build whose extension matches the following regular expression

   /\.[html|css|js|json|xml|svg|txt]/

This list is loosely based on the [HTML5 Boilerplate server configuration](https://github.com/h5bp/server-configs-apache).

You will then need to set up an upload script yourself that puts the gzipped versions of the files on S3 or whatever hosting provider you prefer, and take care that the files are served with the correct Content-encoding.

 At the moment, `metalsmith-gzip` does not take any configuration options. 

## Acknowledgements

The functionality was inspired by the [Middleman gzip extension](http://middlemanapp.com/advanced/file-size-optimization/). 
