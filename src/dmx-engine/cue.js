let cueCount = 0

export default class Cue {
	channels = {}
	cues = {}
	constructor(id) {
		this.id = id
	}


	release(what) {
		if(what) {
			if(what.values) {
				if(!!this.cues[what.id]) {
					this.cues[what.id] = undefined
					for(let ch in what.values) {
						const old = this.channels[ch]
						if(old === what.values[ch]) {
							this.channels[ch] = undefined
						} else {
							const { to, fade, delay } = what.values[ch]
							if(old && to===old.to && fade===old.fade && delay===old.delay) {
								this.channels[ch] = undefined
							}
						}
					}
				}
				
			} else {
				console.log("\n\n\n\n\nRELEASE", what)
			// releases channels regardless of their values
				for(let ch in what) {
					// console.log("channels[ch] === what[ch]", this.channels[ch] , what[ch], this.channels[ch] === what[ch])
					// if(this.channels[ch] !== undefined) {
						this.channels[ch] = undefined
					// }
				}
				
			}
			console.log("%s.released", this.id, this)
		}
	}

	include(what) {
		if(what) {
			if(what.values) {
				this.update(what.values)
				this.cues[what.id] = what
			} else {
				this.channels = {...this.channels, ...what}
			}
		}
		console.log("%s.included", this.id, this)
	}

	update(u) {
		for(let ch in u) {
			this.channels[ch] = u[ch]
		}
		// console.log("%s.channels", this.id, this.channels)
	}

	getChannels() { return this.channels }

	get() {
		const newCue = {
          id: this.id,
          seq: cueCount++,
          includes: Object.keys(this.cues).filter(k => typeof this.cues[k]!=='undefined').reduce( (res, key) => (res[key] = this.cues[key], res), {} ),
          values: Object.keys(this.channels).filter(k => typeof this.channels[k]!=='undefined').reduce( (res, key) => (res[key] = this.channels[key], res), {} )
        }
        return newCue
	}
}