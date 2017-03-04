# Welcome

## Table of contents
  1. [General documentation](#general-documentation)
  1. [Quick install](#quick-install)
  1. [Pre requisits](#pre-requisits)
  1. [Install deps](#instll-deps)
  1. [Task automation](#task-automation)

## General documentation

[Find the general docs, wikis, code styleguides where](https://github.com/tajawal/www-server/wiki)


## Quick Install

If you want a shallow clone (the leatest 10 commits) you can always do:

```javascript
  git clone --depth 10 git@github.com:tajawal/www-server.git www
```

#### Prerequisites

- [homebrew](http://brew.sh/)
- [nvm](http://dev.topheman.com/install-nvm-with-homebrew-to-use-multiple-versions-of-node-and-iojs-easily/) (*is the preferred way to manage different versions of node*)
- [node](https://github.com/creationix/nvm#usage) > v5
- [mongodb](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/#install-mongodb-community-edition-with-homebrew)

  **Global npm pacakages required**

- [gulp](http://gulpjs.com/)


#### Install dependencies

  `$ npm install`


#### Run development

Create a copy of file `.env.dist` rename to `.env` and initilize the values.

Run `gulp`

- *default* `gulp`
  - start express server using `nodemon`

##### Bundling

```javascript
$ gulp bundle
```
