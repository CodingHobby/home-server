const express = require('express'),
	serveIndex = require('serve-index'),
	path = require('path'),
	ip = require('ip'),
	net = require('net'),
	dns = require('dns')

/**
 * Gets domain name for device with certain ip
 * @param {String} ip ip of device
 * @param {lookupCallback} cb callback to run on device name
 */
function reverseLookup(ip, cb) {
	let domain
	dns.reverse(ip, function (err, domains) {
		cb(domains ? domains[0] : undefined)
	})
}

/**
 * Scan network for running servers
 * @param {scanCallback} cb Callback to exectute on hosts with open ports
 */
function scan(cb) {
	for (let ipN = 1; ipN < 254; ipN++) {
		let host = `${ip.address().split('.').slice(0, 3).join('.')}.${ipN}`
		let s = new net.Socket()
		s.setTimeout(2000, () => s.destroy())
		s.connect(8080, host, () => cb(host))
		s.on('error', function (e) {
			s.destroy()
		})
	}
}

module.exports.homeServer = class homeServer {
	/**
	 * Creates new server instance
	 * @param {String} dir directory of files to serve
	 */
	constructor(dir) {
		console.log(process.cwd())
		this.path = dir || '.'
		this.app = express()
		this.app.use('/', express.static(path.join(process.cwd(), '..', this.path)), serveIndex(path.join(process.cwd(), '..', this.path), { icons: true }))
	}

	/**
	 * Start server
	 * @param {Number|string} port port to start server on
	 */
	start(port) {
		this.app.listen(port, () => console.log(`Server running on http://${ip.address()}:${port}`))
	}
}

module.exports.utils = {scan, reverseLookup}

/**
 * @callback scanCallback
 * @param {String} host ip of found device
 */
/**
 * @callback lookupCallback
 * @param {String} domain domain name of device
 */