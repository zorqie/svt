import { ease } from './easing.js'
const resolution = 25

class Animation {

	constructor(engine) {
		this.engine = engine
		this.fx_stack = []
		this.interval = null
	}

	add(to, duration = resolution, easing = 'linear') {
		this.fx_stack.push({to, duration, easing})
		return this
	}


	delay(duration) {
		return this.add({}, duration)
	}

	stop() {
		if(this.interval) {
			clearInterval(this.interval)
		}
		this.fx_stack = []
	}

	async run(onFinish) {
		// console.log("Running", this)
		var config = {}
		var t = 0
		var d = 0
		var e, a

		var fx_stack = this.fx_stack;
		var dmx = this.engine.dmx

		const ani_setup = function() {
			a = fx_stack.shift()
			t = 0
			d = a.duration
			e = ease[a.easing]
			config = {}
			for(var k in a.to) {
				config[k] = {
					'start': dmx.data[k],
					'end':   a.to[k]
				}
			}
		}

		const ani_step = function() {
			var new_vals = {}
			for(var k in config) {
				new_vals[k] = Math.round(config[k].start + e(t, 0, 1, d) * (config[k].end - config[k].start))
			}
			t = t + resolution
			dmx.update(new_vals)
			if(t > d) {
				if(fx_stack.length > 0) {
					ani_setup()
				} else {
					clearInterval(iid)
					if(onFinish) onFinish()
				}
			}
		}

		ani_setup()
		var iid = this.interval = setInterval(ani_step, resolution)
	}

}
export default Animation
