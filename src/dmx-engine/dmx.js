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

export default DMXEngine