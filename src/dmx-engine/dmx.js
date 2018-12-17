import { EventEmitter } from 'events'

import drivers from './drivers'

const MAX_UNIVERSES = 8
const BUFFER_SIZE = 1 + MAX_UNIVERSES * 512

class DMXEngine extends EventEmitter {

	constructor(options) {
		super()
		this.options = options || {}
		// this.universes = {}
		this.data = Buffer.alloc(BUFFER_SIZE, 0)
		this.drivers   = drivers
		console.log("Drivers: ", drivers)
		this.outputs = {}
		// this.patchOutput("art1", {driver:'artnet', host: "192.168.1.42"})
	}

	patchOutput(name, options) {
		this.outputs[name] = new drivers[options.driver](this, options)
	}

	update(u) {
		for (var c in u) {
			this.data[c] = u[c]
		}
		this.emit('update', u) // TODO potentially large buffer
	}

	updateAll(value, from = 1, to = BUFFER_SIZE) {
		for (var i = from; i <= to; i++) {
			this.data[i] = value
		}
		this.emit('updateAll', {value, from, to})
	}
}
/*
DMX.devices   = require('./devices')
DMX.Animation = require('./anim')


DMX.prototype.addUniverse = function(name, driver, device_id, options) {
	return this.universes[name] = new this.drivers[driver](device_id, options)
}

DMX.prototype.update = function(universe, channels) {
	this.universes[universe].update(channels)
	this.emit('update', universe, channels)
}

DMX.prototype.updateAll = function(universe, value) {
	this.universes[universe].updateAll(value)
	this.emit('updateAll', universe, value)
}

DMX.prototype.universeToObject = function(universe) {
	var universe = this.universes[universe]
	var u = {}
	for(var i = 0; i < 512; i++) {
		u[i] = universe.get(i)
	}
	return u
}
*/
export default DMXEngine