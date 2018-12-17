import dgram from 'dgram'

class ArtNet {
	constructor(engine, options) {
		this.engine = engine

		options = options || {}

		this.header      = Buffer.from([65, 114, 116, 45, 78, 101, 116, 0, 0, 80, 0, 14])
		this.sequence    = Buffer.from([0])
		this.physical    = Buffer.from([0])
		this.universe_id = Buffer.from([0x00, 0x00])
		this.length      = Buffer.from([0x02, 0x00])

		this.sleepTime = 24

		this.universe_id.writeInt16LE(options.universe || 0, 0)
		this.host = options.host || '127.0.0.1'
		this.port = options.port || 6454
		this.universeStart = options.start || 1
		this.universeEnd = options.end || this.universeStart+511

		this.dev = dgram.createSocket('udp4')
		this.dev.bind(() =>
			this.dev.setBroadcast(true)
		)
		this.start()
	}

	send_universe() {
		var pkg = Buffer.concat([
			this.header,
			this.sequence,
			this.physical,
			this.universe_id,
			this.length,
			this.engine.data.slice(this.universeStart, this.universeEnd)
		])

		this.dev.send(pkg, 0, pkg.length, this.port, this.host)
	}

	start() {
		this.timeout = setInterval(this.send_universe.bind(this), this.sleepTime)
	}

	stop() {
		clearInterval(this.timeout)
	}

	close(cb) {
		this.stop()
		cb(null)
	}
}
// ArtNet.prototype.update = function(u) {
// 	for (var c in u) {
// 		this.universe[c] = u[c]
// 	}
// }

// ArtNet.prototype.updateAll = function(v) {
// 	for (var i = 1; i <= 512; i++) {
// 		this.universe[i] = v
// 	}
// }

// ArtNet.prototype.get = function(c) {
// 	return this.universe[c]
// }

export default ArtNet
