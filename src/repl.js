import repl from "repl"

import Engine from './dmx-engine/engine'

const engine = new Engine()
console.log("Engine: ", engine)

function dmxEval(input, context, filename, callback) {
	// engine.updateAll('art1', 0)
	engine.parseLine(input)
	callback(null, input)
}

const replServer = repl.start({
	prompt: "\nZeDMX > ",
	eval: dmxEval
});

replServer.on('exit', () => {
  console.log('Must exit. Bye!');
  // engine.updateAll('art1', 0)
  process.exit();
});

// replServer.on('line', (l) => {
//   console.log('Lined!', l);
// });
