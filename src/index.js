const fs       = require('fs')
const http     = require('http')
const body     = require('body-parser')
const cors     = require('cors')
const compress = require('compression')
// const favicon = require('serve-favicon');
const express  = require('express')
const socketio = require('socket.io')
// const program  = require('commander')

const Engine 	= require('./dmx-engine/engine').default

const engine = new Engine()

const config	= JSON.parse(fs.readFileSync('config/server.json', 'utf8'))


const app    = express()
const server = http.createServer(app)
const io     = socketio.listen(server)

const listen_port = config.server.listen_port || 8080
const listen_host = config.server.listen_host || '::'

server.listen(listen_port, listen_host, null, function() {
	if(config.server.uid && config.server.gid) {
		try {
			process.setuid(config.server.uid)
			process.setgid(config.server.gid)
		} catch (err) {
			console.log(err)
			process.exit(1)
		}
	}
})

app.use(cors())
app.use(body.json())
app.use(body.urlencoded({ extended: false }));


app.use('/', express.static(__dirname + '/public'));
// app.get('/', function(req, res) {
// 	res.sendFile(__dirname + '/public/index.html')
// })
// app.get('/style.css', function(req, res) {
// 	res.sendFile(__dirname + '/public/style.css')
// })

	app.get('/config', function(req, res) {
		const response = {"devices": engine.config.devices, "dmx": engine.dmx.data.slice(1)}
		// Object.keys(engine.config.universes).forEach(function(key) {
		// 	response.universes[key] = engine.config.universes[key].devices
		// })

		res.json(response)
	})

	app.get('/state', function(req, res) {
		res.json({"state": engine.dmx.data.slice(1).data})
		console.log("Stating...", res)
	})

	app.post('/state', function(req, res) {
		engine.update(req.body)
		res.json({"state": engine.dmx.data.slice(1).data})
	})

	app.post('/console', function(req, res) {
		console.log("COMMAND", req.body)
		engine.parseLine(req.body.command)
		res.json({"state": engine.dmx.data.slice(1)})
	})

const cueEmitter = (cue, result) => socket.emit('cue', cue, result)

	io.sockets.on('connection', function(socket) {
		socket.emit('init', {'profiles': engine.profiles, 'setup': engine.config, 'dmx': engine.dmx.data})

		socket.on('request_refresh', function() {
			socket.emit('update', engine.dmx.data.slice(1))
		})

		socket.on('update', function(update) {
			engine.update(update)
		})


		engine.dmx.on('update', function(update) {
			socket.emit('update', update)
		})

		socket.on('cue', function(cue, action) {
			switch (action) {
				case 'add':
					engine.addCue(cue, cueEmitter)
					break
				case 'update': 
					engine.updateCue(cue, cueEmitter)
					break
				case 'remove':
					engine.removeCue(cue, cueEmitter)
					break
				default:
					//execute

				
			}
		})

		socket.on('add_cue', function(cue) {
			engine.addCue(cue, () => socket.emit('cue_added', cue))
		})
		socket.on('update_cue', function(cue) {
			engine.updateCue(cue, () => socket.emit('cue_updated', cue))
		})
		socket.on('remove_cue', function(cue) {
			engine.removeCue(cue, () => socket.emit('cue_removed', cue))
		})

		socket.on('patch', function(patch) {
			engine.patch(patch)
		}) 
		engine.on('patch', function(patch) {
			socket.emit('patch', patch)
		})
	})

console.log("ZeDMX listening on ", listen_port);