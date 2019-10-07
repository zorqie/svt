let ccount = 0

const fillRange = (start, end) => {
  return Array(end - start + 1).fill().map((item, index) => 1*start + index);
}

const rxRange = /([hgq]?)(\d+)\s*\.{2}\s*(\d+)/
const parseSelection = input => {
	if(input.indexOf('..') > -1) {
		const [,typ,min,max] = rxRange.exec(input)
		console.log("Min..max: ", min, max, ", type:", typ)
		return {
			channels: fillRange(min, max)
		}

	} else {

		const num = parseInt(input)
		if(!isNaN(num)) {
			return {
				channels: [num]
			}
		} else {
			return {}
		}
	}
}

const reo = /([^\/\*]+)(?:\/([0-9.]+))?(?:\*(\d+))?/
const parseFade = input => {
	const res = reo.exec(input)
	const [all, value, fade, group] = res
	if(fade)  {
		return { value, fade, group }
	} else {
		return 1 * input
	}
}

const parseOperand = input => {	
	const vals = input.split(/\s+/)
	if(vals.length > 1) {
		return vals.filter(e => ''!==e).map(e => parseFade(e))
	} else {
		return parseFade(input)
	}
}

const rxLine = /(?:(.*)([=@!?]))?(.*)/

const rxKeywords = /(heads|h|groups|g|cues|q|channels|c)/
const parseLine = input => {
	const [left, right] = input.split(/\s*=\s*/)
	const res = rxLine.exec(left)
	const [ , sel, cmd, opt] = res
	console.log("Parsed: ", sel, cmd, opt)
	let command = {
		id: 'cmd',
		seq: ccount++,
		as: right,
		input,
		sel,
		cmd,
		opt,
	}
	if(cmd === '?') {
		console.log("Confirm?", sel)
		command.exec = sel
		command.confirm = true

	} else if(cmd === '=') {
		console.log("assign: ", opt, "to", sel)
	} else if(cmd === '@') {
		const { channels } = parseSelection(sel)
		console.log("Channels:", channels)
		if(channels) {
			const v = parseOperand(opt)
			const b = {}
			if (Array.isArray(v)) {
				const vlen = v.length
				let vi = 0
				command.values = channels.reduce((acc, el) => {acc[el] = parseValue(v[vi++]); vi %= vlen; return acc}, {})
			} else {
				command.values = channels.reduce((acc, el) => {acc[el] = parseValue(v); return acc}, {})
			}
		}
	} else if(cmd === '!') {
		// execute
		command.exec = sel
	} else {
		// view
		command.view = opt
	}
	console.log("Queing", command)
	return command
}

const parseValue = v => typeof v === 'number' ? v : { to: v.value, fade: v.fade, options: v.options }

export { parseLine }
