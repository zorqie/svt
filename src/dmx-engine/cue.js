let cueCount = 0

export default class Cue {
	channels = {}
	cues = {}
	constructor(id) {
		this.id = id
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
	}

	update(u) {
		for(let ch in u) {
			this.channels[ch] = u[ch]
		}
		console.log("%s.channels", this.id, this.channels)
	}

	getChannels() { return this.channels }

	get() {
		const newCue = {
          id: this.id,
          seq: cueCount++,
          values: this.channels
        }
        return newCue
	}
}