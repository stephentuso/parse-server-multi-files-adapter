const Subsume = require('subsume')

function MultiFilesAdapter (options) {
  this._subsume = new Subsume(options.id)
  this._adapters = options.adapters
  this._defaultAdapter = options.defaultAdapter
}

MultiFilesAdapter.prototype.createFile = function (filename, data, contentType) {
  return this._getAdapter(filename).createFile(filename, data, contentType)
}

MultiFilesAdapter.prototype.deleteFile = function (filename) {
  return this._getAdapter(filename).deleteFile(filename)
}

MultiFilesAdapter.prototype.getFileData = function (filename) {
  return this._getAdapter(filename).getFileData(filename)
}

MultiFilesAdapter.prototype.getFileLocation = function (config, filename) {
  return this._getAdapter(filename).getFileLocation(config, filename)
}

MultiFilesAdapter.prototype._getAdapter = function (filename) {
  const key = this._subsume.parse(filename).data || this._defaultAdapter
  return this._adapters[key]
}

module.exports = MultiFilesAdapter
