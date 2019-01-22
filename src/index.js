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
	console.log("Posted COMMAND", req.body)
	engine.exec(req.body.command)
	res.json({"state": engine.dmx.data.slice(1)})
})


io.sockets.on('connection', function(socket) {

	socket.emit('init', {
		'profiles': engine.profiles, 
		'setup': engine.config, 
		'dmx': engine.dmx.data
	})
	engine.on('config', function(key) {
		//TODO Send only changes
		socket.emit('init', {
			'profiles': engine.profiles, 
			'setup': engine.config, 
			'dmx': engine.dmx.data
		})
	})

	socket.on('request_refresh', function() {
		socket.emit('update', engine.dmx.data.slice(1))
	})

	socket.on('get', function(what) {
		let state = engine.targets[what]
		if(state && typeof state.get === 'function') {
			state = state.get()
		} 
		socket.emit('state', state) 
	})

	socket.on('update', function(update) {
		engine.update(update)
	})

	engine.dmx.on('update', function(update) {
		socket.emit('update', update)
	})

	engine.on('warn', function(message, ...args) {
		socket.emit('warn', message, ...args)
	})

	socket.on('cue', function(cue, action) {
		const cueEmitter = (result) => {
			console.log(action, "cue:", cue, ", result:", result)
			socket.emit('cue', cue, action, result)
		}
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
				//do nothing
		}
	})

	socket.on('execute', function(item, cue) {
		engine.exec(item, cue)
	})
	// TODO Choose one exec or 'ute
	socket.on('exec', function(item, cue) {
		engine.exec(item, cue)
	})
	engine.on('executed', function(item, cue) {
		socket.emit('executed', item, cue)
	})

	socket.on('release', function(item, cue) {
		engine.release(item, cue)
	})
	engine.on('released', function(item, cue) {
		socket.emit('released', item, cue)
	})

	engine.on('question', function(msg) {
		socket.emit('question', msg)
	})

	socket.on('patch', function(patch) {
		engine.patch(patch)
	})
	engine.on('patched', function(patch) {
		socket.emit('patched', patch)
	})

	socket.on('cmd', function(input) {
		console.log("C:\\>", input)
	})
})

console.log("ZeDMX listening on ", listen_port);