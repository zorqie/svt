let count=0, seq=0

const clean = obj => 
	Object.keys(obj)
		.filter(k => typeof obj[k]!=='undefined')
		.reduce( (res, key) => (res[key] = obj[key], res), {} )

export default class Que {
	channels = {}
	chq = {}
	cues = {}
	heads = {}
	constructor(engine, name) {
		this.engine = engine
		this.id = name || 'q' + count++
	}

	select(query) {
		if(typeof query === 'string') {
			const { stores } = this.engine
			// 
			const cue = stores.cues.find(query)
			if(cue) {
				this.cues = {...this.cues, [cue.id]: cue}
				return this
			}
			const head = stores.heads.find(query)
			if(head) {
				this.heads = {...this.heads, [head.id]: head}
			}
		}
		console.log("Selected", query)
	}

	release(what) {
		if(what) {
			if(what.values) {
				console.log("\n\n\n\n\nRELEASE Cue", what)
				this.releaseCue(what)
				// if(!!this.cues[what.id]) {
				// 	this.cues[what.id] = undefined
				// 	for(let ch in what.values) {
				// 		const old = this.channels[ch]
				// 		if(old === what.values[ch]) {
				// 			this.channels[ch] = undefined
				// 		} else {
				// 			const { to, fade, delay } = what.values[ch]
				// 			if(old && to===old.to && fade===old.fade && delay===old.delay) {
				// 				this.channels[ch] = undefined
				// 			}
				// 		}
				// 	}
				// }
				
			} else {
				console.log("\n\n\n\n\nRELEASE Channels", what)
			// releases channels regardless of their values
				this.releaseChannels(what)
				
			}
			console.log("%s.released", this.id, this.get())
		}
	}

	releaseCue(what) {
		if(!!this.cues[what.id]) {
			this.cues[what.id] = undefined
			this.releaseChannels(what.values, what)
			// for(let ch in what.values) {
			// 	const old = this.channels[ch]
			// 	if(old === what.values[ch]) {
			// 		this.channels[ch] = undefined
			// 	} else {
			// 		const { to, fade, delay } = what.values[ch]
			// 		if(old && to===old.to && fade===old.fade && delay===old.delay) {
			// 			this.channels[ch] = undefined
			// 		}
			// 	}
			// }
		}
	}

	releaseChannels(rel, cue = {}) {
		// for(let ch in r) {
		// 	// console.log("channels[ch] === what[ch]", this.channels[ch] , what[ch], this.channels[ch] === what[ch])
		// 	// if(this.channels[ch] !== undefined) {
		// 		this.channels[ch] = undefined
		// 	// }
		// }
		for(let ch in rel) {
			const old = this.channels[ch]
			if(old === rel[ch]) {
				this.channels[ch] = undefined
				if(this.chq[ch] && cue.id === this.chq[ch].id) {
					this.chq[ch] = undefined
				}
			} else {
				const { to, fade, delay } = rel[ch]
				if(old && to===old.to && fade===old.fade && delay===old.delay) {
					this.channels[ch] = undefined
					if(this.chq[ch] && cue.id === this.chq[ch].id) {
						this.chq[ch] = undefined
					}
				}
			}
		}


	}

	include(what) {
		if(what) {
			if(what.values) {
				for(let ch in what.values) {
					if(this.chq[ch]!==undefined && this.chq[ch].id !== what.id) {
						this.cues[this.chq[ch].id] = undefined // no longer included but values remain, unless overridden
					}
					this.channels[ch] = what.values[ch]
					this.chq[ch] = what
				}
				this.cues[what.id] = what
			} else {
				this.channels = {...this.channels, ...what}
			}
		}
		console.log("%s.included", this.id, this.get())
	}

	update() {
		// update que in store
	}

	getChannels() { return this.channels }

	get() {
		const newCue = {
          id: this.id,
          seq: seq++,
          cues: clean(this.cues),
          values: clean(this.channels)
        }
        return newCue
	}

	set(s) {
		for(h in this.heads) {

		}
	}
}
/*
{
	release(what),
	name(name),
	select(query), 
		// query: 
		// {grid: 'cues'} or {cue: 'q4'} or {head: '1'} or {group: 'g1'} or 
		// {99: 255, 100: {to: 255, fade: 1.3, delay: 0.5}}
	inc(query), // same as select
	set(what),
	remove(),
	update(newItem),
	execute(engine)

	// select({cue: 'Fade 2s'}).save()
	// select({head: '21'}).set({color: red, shutter: 'open'}).name('Red spot').save()
*/