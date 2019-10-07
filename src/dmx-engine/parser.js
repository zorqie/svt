let ccount= 0

const parseSelection = input => {
	const sel = {}
	const num = parseInt(input)
	if(!isNaN(num)) {
		return {
			channel: num
		}
	} else {
		return sel
	}
}

const reo = /([^\/\*]+)(?:\/([0-9.]+))?(?:\*(\d+))?/
const parseOperand = input => {
	const res = reo.exec(input)
	const [all, value, fade, group] = res
	if(fade)  {
		// console.log("Oper", res)
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

const rx = /(sel|rel|inc|)/
const re = /(?:(.*)([@!?`]))?(.*)/
const parseCue = input => {
	const res = re.exec(input)
	const [ , sel, cmd, opt] = res
	console.log("Parsed: ", sel, cmd, opt)
	let cue = {
		id: 'cmd',
		seq: ccount++,
		values: {}
	}
	if(cmd === '?') {
		console.log("Confirm?", sel)
		cue = { 
			id: sel,
			command: input, 
			confirm: true
		}
	} else if(cmd === '`') {
		console.log("View: ", opt)
	} else if(cmd === '@') {
		const { channel } = parseSelection(sel)
		if(channel) {
			const v = parseOperand(opt)
			const b = {}
			if(typeof v === 'number') {
				b[channel] = v
				// console.log("Ch", channel, "@", v)
			} else if (Array.isArray(v)) {
				for(let i=0; i<v.length; i++) {
					b[channel+i] = v[i]
				}
				// console.log("Chs", channel, "@", v)
			} else {
				const { value, fade, options } = v
				// console.log("Fading", v)
				b[channel] = { to: value, fade, options }
			}
			cue.values = b
		}
	} else {
		cue = sel
	}
	console.log("Cueing", cue)
	return cue
}

export { parseCue }
