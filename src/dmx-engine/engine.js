import { EventEmitter } from 'events'
import fs from 'fs'

import Animation from './animation'
import DMX from './dmx'
import parser from './parser'
import profiles from './profiles'

export default class Engine extends EventEmitter {
	constructor() {
		super()
		this.profiles = profiles
		this.dmx = new DMX()
		this.parseLine = parser(this)
		this.config	= JSON.parse(fs.readFileSync('config/dmx.json', 'utf8'))
		for(const out in this.config.outputs) {
			this.dmx.patchOutput(out, this.config.outputs[out])
		}
		// console.log("Constructed Engine.", this)
	}

	createAnimation(to, duration, easing) {
		return new Animation(this).add(to, duration, easing)
	}

	valueOf(channel) {
		return this.dms.data[channel]
	}

	update(u) {
		this.dmx.update(u)
	}

}