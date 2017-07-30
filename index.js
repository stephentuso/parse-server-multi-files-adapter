const Subsume = require('subsume-limited')

class MultiFilesAdapter {
  constructor (options) {
    this._subsume = new Subsume(options.id)
    this._adapters = options.adapters
    this._defaultAdapter = options.defaultAdapter
  }

  createFile (filename, data, contentType) {
    return this._getAdapter(filename).createFile(filename, data, contentType)
  }

  deleteFile (filename) {
    return this._getAdapter(filename).deleteFile(filename)
  }

  getFileData (filename) {
    return this._getAdapter(filename).getFileData(filename)
  }

  getFileLocation (config, filename) {
    return this._getAdapter(filename).getFileLocation(config, filename)
  }

  _getAdapter (filename) {
    const key = this._subsume.parse(filename).data || this._defaultAdapter
    return this._adapters[key]
  }
}

module.exports = MultiFilesAdapter
