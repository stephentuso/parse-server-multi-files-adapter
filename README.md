# parse-server-multi-files-adapter [![npm version](https://img.shields.io/npm/v/parse-server-multi-files-adapter.svg?style=flat)](https://www.npmjs.com/package/parse-server-multi-files-adapter)

Allows multiple file adapters to be used at the same time by specifying the adapter in the filename.

## Installation

```bash
yarn add parse-server-multi-files-adapter
```
or
```bash
npm install --save parse-server-multi-files-adapter
```

## Usage

### Server

For now, must be passed as an instance to the parse-server constructor:

```javascript
const MultiFilesAdapter = require('parse-server-multi-files-adapter')
const FSFilesAdapter = require('parse-server-fs-adapter')
const S3Adapter = require('parse-server-s3-adapter')
const GCSAdapter = require('parse-server-gcs-adapter')

const multiAdapter = new MultiFilesAdapter({
  // Delimiter used to retrieve adapter key
  // Never change this
  id: 'unique', 
  
  // Dictionary of file adapters
  adapters: {
    local: new FSFilesAdapter(),
    s3: new S3Adapter({
      // options...
    }),
    gcs1: new GCSAdapter({
      // options...
    }),
    gcs2: new GCSAdapter({
      // options...
    })
  },
  
  // The key of the file adapter to use if none specified
  // Never change this
  defaultAdapter: 's3'
})

const api = new ParseServer({
  appId: 'app_id',
  masterKey: 'master_key',
  filesAdapter: multiAdapter
})
```

### Client

The adapter key (corresponding to a key in the `adapters` object above) must be embedded in the filename.
This uses [subsume](https://github.com/sindresorhus/subsume) to parse the filename and determine the adapter key.
If writing a JS app you could do something like this to help create files:

```javascript
// Utils
const Subsume = require('subsume')

const subsume = new Subsume('unique') // same id that was passed to constructor on server

function composeFileName (adapterKey, filename) {
  return subsume.compose(adapterKey) + filename
}

function getOriginalFileName (filename) {
  return subsume.parse(filename).rest
}

function createParseFile (adapterKey, filename, data, type) {
  return new Parse.File(composeFileName(adapterKey, filename), data, type)
}

// Usage
const file = createParseFile('local', 'foobar.txt', { base64: "TG9yZW0gSXBzdW0gRG9sb3I=" })

file.save()
    .then(function () {
      const foo = new Parse.Object('Foo')
      foo.set('file', file)
      return foo.save()
    })
    .then(function () {
      console.log('Saved')
    })
```
