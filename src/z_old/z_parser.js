const Animation = require('dmx').Animation

parseSelection = input => {
	const num = parseInt(input)
	if(!isNaN(num)) {
		return {
			channel: num
		}
	} else {
		return {}
	}
}

const reo = /([^\/\*]+)(?:\/([0-9.]+))?(?:\*(\d+))?/
parseOperand = input => {
	const res = reo.exec(input)
	const [all, value, fade, group] = res
	if(fade)  {
		console.log("Oper", res)
		return { value, fade, group }
	}
	const vals = input.split(/\s+/)
	if(vals.length > 1) {
		return vals.filter(e => ''!==e && !isNaN(e)).map(e => parseInt(e))
	}
	const val = parseInt(input)
	if(!isNaN(val)) {
		return val
	}
}

const u = 'art1' // FIXME 

const re = /(?:(.*)([@!?]))?(.*)/
const parser = (engine) => (input) => {
	const res = re.exec(input)
	const [ , sel, cmd, opt] = res
	if(cmd === '?') {
		console.log("Confirm?", sel)
	} else if(cmd === '@') {
		const { channel } = parseSelection(sel)
		if(channel) {
			const v = parseOperand(opt)
			const b = {}
			if(typeof v === 'number') {
				b[channel] = v
				engine.update(u, b)
				console.log("Ch", channel, "@", v)
			} else if (Array.isArray(v)) {
				for(let i=0; i<v.length; i++) {
					b[channel+i] = v[i]
				}
				engine.update(u, b)
				console.log("Chs", channel, "@", v)
			} else {
				const { value, fade, options } = v
				console.log("Fading", v)
				const animation = new Animation()
				const to = {}
				to[channel] = value
				animation.add(to, fade * 1000, options || {})
				animation.run(engine.universes[u])
			}
		}
	} else {

	}
}

module.exports = parser