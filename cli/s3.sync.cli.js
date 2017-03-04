'use strict';

var http = require('http');
var path = require('path');
var async = require('async');
var fs = require('fs');

// helpers
var mkdirSync = function(path) {
  try {
    fs.mkdirSync(path);
  } catch (e) {
    if (e.code != 'EEXIST') throw e;
  }
};
var mkdirpSync = function(dirpath) {
  var parts = dirpath.split(path.sep);
  for (var i = 1; i <= parts.length; i++) {
    mkdirSync(path.join.apply(null, parts.slice(0, i)));
  }
};

// sitemap files root dir on s3
var s3Url = 'http://tjwlcdn.com/cms/sitemap';

// directory where files get downloaded
var downloadDir = path.join(__dirname, '../../client/sitemap');

if (!fs.existsSync(downloadDir)) {
  mkdirpSync(downloadDir);
}

// throw an error if dir does not exist or does not have write permission
fs.accessSync(downloadDir, fs.W_OK);

// files to be downloaded from s3
var filesToDownload = [
  {
    s3Path: s3Url + '/www.tajawal.com' + '/sitemap.xml',
    localPath: path.join(downloadDir, 'www.tajawal.com.sitemap.xml')
  },
  {
    s3Path: s3Url + '/www.tajawal.sa' + '/sitemap.xml',
    localPath: path.join(downloadDir, 'www.tajawal.sa.sitemap.xml')
  },
  {
    s3Path: s3Url + '/www.tajawal.ae' + '/sitemap.xml',
    localPath: path.join(downloadDir, 'www.tajawal.ae.sitemap.xml')
  }
];

// Download files asyncronously from s3
async.forEach(filesToDownload, function(file, cb) {
  var localFile = fs.createWriteStream(file.localPath);
  http.get(file.s3Path, function(response) {
    response.pipe(localFile);

    localFile.on('finish', function() {
      console.log("Downloaded File: " + file.s3Path);
      localFile.close(cb);
    });
  }).on('error', function(err) {
    console.log("Failed to Download File: " + file.s3Path);
    console.log(err);
    cb();
  });
}, function(err, results) {
  console.log("Downloading Completed!!!")
});
