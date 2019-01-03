import { EventEmitter } from 'events'
import fs from 'fs'

import Animation from './animation'
import DMXEngine from './dmx'
import parser from './parser'
import profiles from './profiles'

export default class Engine extends EventEmitter {
	constructor() {
		super()
		this.profiles = profiles  // TODO load only profiles used in show
		this.dmx = new DMXEngine()
		this.parseLine = parser(this)

		this.config	= JSON.parse(fs.readFileSync('config/dmx.json', 'utf8'))
		const show = JSON.parse(fs.readFileSync(`config/shows/${this.config.lastShow}/presets.json`, 'utf8'))
		if(show.presets) {
			this.config.presets = show.presets
		} 
		console.log("CUES: ", this.config.presets)
		for(const out in this.config.outputs) {
			this.dmx.patchOutput(out, this.config.outputs[out])
		}
		// console.log("Constructed Engine.", this)
	}

	addCue(cue, callback) {
		let { lastShow, presets } = this.config
		presets = [...presets, cue]
		fs.writeFile(`config/shows/${lastShow}/presets.json`, JSON.stringify({presets}, null, '\t'), callback)
		this.config.presets = presets
	}
	removeCue(cue, callback) {
		const { lastShow, presets } = this.config
		this.config.presets = presets.filter(p => p === null || p.id !== cue.id)
		fs.writeFile(`config/shows/${lastShow}/presets.json`, JSON.stringify({presets: this.config.presets}, null, '\t'), callback)
		
	}
	updateCue(cue, callback) {
		const { lastShow, presets } = this.config
		// this.config.presets = presets.filter(p => p === null || p.id !== cue.id).concat(cue)
		for(let i = 0; i < this.config.presets.length; i++) {
			const p = this.config.presets[i]
			if(p && p.id === cue.id) {
				this.config.presets[i] = cue
			}
		}
		fs.writeFile(`config/shows/${lastShow}/presets.json`, JSON.stringify({presets: this.config.presets}, null, '\t'), callback)
	}

	createAnimation(to, duration, easing) {
		return new Animation(this).add(to, duration, easing)
	}

	valueOf(channel) {
		return this.dms.data[channel]
	}

	update(u) {
		console.log("u", u)
		var direct = {}
		for (var c in u) {
			if(typeof u[c] === 'object') {
				const {to, delay, fade} = u[c]
				const a = new Animation(this)
				a.add({[c]:to}, fade*1000)
				setImmediate(() => a.run())
			} else {
				direct[c] = u[c]
			}

		}
		this.dmx.update(direct)
	}

}