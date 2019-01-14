import { EventEmitter } from 'events'
import fs from 'fs'

import Animation from './animation'
import Cue from './que'
import DMXEngine from './dmx'
import { parseCue } from './parser'
import profiles from './profiles'
import Store from './store'

export default class Engine extends EventEmitter {
	constructor() {
		super()
		this.profiles = profiles  // TODO load only profiles used in show
		this.dmx = new DMXEngine()
		// this.parseLine = parser(this) // replaced by parseCue

		this.config	= JSON.parse(fs.readFileSync('config/dmx.json', 'utf8'))
		for(const out in this.config.outputs) {
			this.dmx.patchOutput(out, this.config.outputs[out])
		}

		this.cueStore = new Store(`config/shows/${this.config.lastShow}/presets.json`, 'cues')
		this.config.cues = this.cueStore.list()

		this.targets = {
			pgm: new Cue(this, 'pgm'),
			blind: new Cue(this, 'blind'),
			live: new Cue(this, 'live') // Do we really need this?
		}
	}

	saveProgrammerAsCue(name) {

	}

	addCue(cue, callback) {
		this.cueStore.add(cue, callback)
	}

	removeCue(cue, callback) {
		this.cueStore.remove(cue, callback)
	}

	updateCue(cue, callback) {
		this.cueStore.update(cue, callback)
	}

	createAnimation(to, duration, easing) {
		return new Animation(this).add(to, duration, easing)
	}

	valueOf(channel) {
		return this.dms.data[channel]
	}

	release(what, target = 'pgm') {
		this.targets[target].release(what)
		this.emit("released", what, target)
	}

	exec(what, target = 'pgm') {
		let u = typeof what === 'string' ? parseCue(what) : what 
		if(typeof u === 'undefined') {
			this.emit('warn', 'Unable to execute', what)
			return
		} else if(typeof u === 'string') {
			// parsed into cue id
			let q = this.cueStore.find(u)
			if(q===null) {
				this.emit('warn', 'No such cue: ' + u)
				return
			} else {
				u = q
			}
		} else if(u.confirm) {
			this.emit('question', {
				text: 'Confirm ' + u.id + '?', 
				onOk: { 
					event: 'execute', 
					params: u.id + '!'
				}
			})
			return
		} 
		if(u.values) {
			this.update(u.values)
		} else {
			this.update(u)
		}
		this.targets[target].include(u)
		this.emit('executed', what, target)
	}

	update(u) {
		// console.log("e.u", u)
		var direct = {}
		for (var c in u) {
			if(typeof u[c] === 'object') {
				// TODO start all animations at once
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


