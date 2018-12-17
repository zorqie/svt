import Engine from '../src/dmx-engine/engine.js'

const e = new Engine()
e.dmx.on('update', u => console.log("Updated", e.dmx.data))
e.dmx.on('updateAll', u => console.log("Updated", e.dmx.data))
e.update({"98": 233, "99": 40, "101": 145})
// e.updateAll(33)