const fs     = require('fs')

const DMX 	 = require('dmx')
const A 	 = DMX.Animation
const heads  = require('./personalities')
const parser = require('./parser')

const config	= JSON.parse(fs.readFileSync('config/dmx.json', 'utf8'))
const dmx = new DMX()
dmx.config = config //TODO?

dmx.fixtures = {}
dmx.parseLine = parser(dmx)


for(const universe in config.universes) {
	console.log("UNiversing", universe)
	dmx.addUniverse(
		universe,
		config.universes[universe].output.driver,
		config.universes[universe].output.device,
		config.universes[universe].output.options
	)
	for(const d in config.universes[universe].devices) {
		const device = config.universes[universe].devices[d]
		dmx.fixtures[device.id] = device
	}
}

for(const profile in heads) {
	console.log("PROFILE: ", profile)
	dmx.devices[profile] = heads[profile]
}

module.exports = dmx