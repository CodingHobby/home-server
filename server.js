const express = require('express'),
	serveIndex = require('serve-index'),
	path = require('path'),
	ip = require('ip')

module.exports = class homeServer {
	constructor(dir) {
		this.path = dir || '.'
		this.app = express()
		this.app.use('/', express.static(path.join(__dirname, this.path)), serveIndex(path.join(__dirname, this.path), { icons: true }))
	}

	start() {
		this.app.listen('8080', () => console.log(`Server running on http://${ip.address()}:8080`))
	}
}