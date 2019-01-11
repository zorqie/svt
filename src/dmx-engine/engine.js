import { EventEmitter } from 'events'
import fs from 'fs'

import Animation from './animation'
import Cue from './cue'
import DMXEngine from './dmx'
import { parseCue, parser } from './parser'
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

		this.programCue = new Cue('programCue')
		this.blindCue = new Cue('blindCue')
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

	release(what, target = 'live') {
		const cue = target==='blindCue' ? this.blindCue : this.programCue
		cue.release(what)
		this.emit("released", what, target)
	}

	exec(what, target = 'live') {
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
		if(target === 'blindCue') {
			this.blindCue.include(u)
		} else {
			// if(typeof what === 'string') {
			// 	this.parseLine(what)
			// } else if(what.values) {
			// 	this.update(what.values)
			// }
			if(u.values) {
				this.update(u.values)
			} else {
				this.update(u)
			}
			this.programCue.include(u)
		}
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