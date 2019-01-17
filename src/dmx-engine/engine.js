import { EventEmitter } from 'events'
import fs from 'fs'

import Animation from './animation'
import Cue from './que'
import DMXEngine from './dmx'
import { parseCue } from './parser'
import profiles from './profiles'
import Store from './store'

const sections = [
	{id: "cues",    prefix: 'q'},
	{id: "heads",   prefix: '' },
	{id: "groups",  prefix: 'g'},
	{id: "grids",   prefix: '' },
	{id: "presets", prefix: 'p'},
]

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

		this.stores = {}
		for(let s in sections) {
			const sec = sections[s]
			const store = new Store(`config/shows/${this.config.lastShow}/${sec.id}.json`, sec.id, sec.prefix)
			this.stores[sec.id] = store
			this.config[sec.id] = store.list()
		}

		this.targets = {
			pgm: new Cue(this, 'pgm'),
			blind: new Cue(this, 'blind'),
			live: new Cue(this, 'live') // Do we really need this?
		}
	}

	saveProgrammerAsCue(name) {

	}

	addCue(cue, callback) {
		if(cue && cue.values) {
			this.stores.cues.add(cue, callback)
		} else {
			this.stores.cues.add(this.targets.pgm.get(), callback)
		}
	}

	removeCue(cue, callback) {
		this.stores.cues.remove(cue, callback)
	}

	updateCue(old, callback) {
		const { cues, values } = this.targets.pgm.get()
		const updated = {
			id: old.id, 
			cues: {...old.cues, ...cues},
			values: {...old.values, ...values}
		}
		console.log("Updating", updated)
		this.stores.cues.update(cue, callback)
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
			let q = this.stores.cues.find(u)
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


