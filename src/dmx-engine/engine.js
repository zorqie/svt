import { EventEmitter } from 'events'
import fs from 'fs'

import Animation from './animation'
import Cue from './que'
import DMXEngine from './dmx'
// import { parseCue } from './parser'
import { parseLine } from './nparser'
import profiles from './profiles'
import Store from './store'

const sections = [
	{id: "cues",    prefix: 'q'},
	{id: "heads",   prefix: '' },
	{id: "groups",  prefix: 'g'},
	{id: "grids",   prefix: '' },
	{id: "presets", prefix: 'p'},
]

const targets = ['live', 'pgm', 'blind']

const matches = (a, b) => typeof a === 'string' && typeof b === 'string' && a.toUpperCase() === b.toUpperCase()


export default class Engine extends EventEmitter {
	constructor() {
		super()
		this.profiles = profiles  // TODO load only profiles used in show
		this.dmx = new DMXEngine()

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
			store.on('added', this.storeModified.bind(this))
			store.on('updated', this.storeModified.bind(this))
			store.on('removed', this.storeModified.bind(this))
		}
		/*this.targets = {
			pgm:   new Cue(this, 'pgm'),
			blind: new Cue(this, 'blind'),
			live:  new Cue(this, 'live')
		}*/
		this.targets = targets.reduce((all, t) => ({...all, [t]:new Cue(this, t)}), {})
	}

	storeModified(item, storeId) {
		this.config[storeId] = this.stores[storeId].list()
		this.emit('config', storeId)
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
			label: old.label,
			cues: {...old.cues, ...cues},
			values: {...old.values, ...values}
		}
		console.log("Updating", updated)
		this.stores.cues.update(updated, callback)
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
		const command = typeof what === 'string' ? parseLine(what) : what 
		if(command.view) {
			const { view } = command
			if(view) {
				if(view==='engine') {
					console.log("Engine:", this)
				} else if(targets.includes(view)) {
					console.log("Target:", this.targets[view].get())
					this.emit('view', view, this.targets[view].get())
				} else {
					const found = sections
						.filter(s=>s.id!=='grids')
						.map(s => this.stores[s.id].list().filter(e => e && e.label && ( matches(e.label, view) || matches(e.id, view) )))
					// TODO we need to know the type of thing we found, perhaps inject type:s.id
					console.log("\nFOUND", [].concat(...found))
					this.emit('info', view, found)
				}
			}
			return
		} else if(command.exec) {
			// parsed into cue id
			let q = this.stores.cues.find(command.exec)
			if(q===null) {
				this.emit('warn', 'No such cue: ' + command.exec)
				return
			} else {
				command.values = q.values
			}

		} else if(command.confirm) {
			this.emit('question', {
				text: 'Confirm ' + command.exec + '?', 
				onOk: { 
					event: 'execute', 
					params: command.exec + '!'
				}
			})
			return
		} 
		if(command.values) {
			this.update(command.values)
		} else {
			this.update(command)
		}
		this.targets[target].include(command)
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


