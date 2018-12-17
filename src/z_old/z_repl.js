const repl = require("repl")

const engine = require('./engine')
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
function dmxEval(input, context, filename, callback) {
	// engine.updateAll('art1', 0)
	engine.parseLine(input)
	callback(null, input)
	/*
	const res = re.exec(input)
	// console.log("CONTEXT: ", context)
	console.log('GOT: ', res)
	const [ , sel, cmd, opt] = res
	if(cmd === '?') {
		callback(new repl.Recoverable('Confirm or Esc'))
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
				console.log("Che", channel, "@", v)
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
		callback(null, input)
	} else {
		callback(null, 'Done.')
	}
	*/
}


const replServer = repl.start({
	prompt: "\nZeDMX > ",
	eval: dmxEval
});

replServer.on('exit', () => {
  console.log('Must exit. Bye!');
  engine.updateAll('art1', 0)
  process.exit();
});

// replServer.on('line', (l) => {
//   console.log('Lined!', l);
// });
