const fs       = require('fs')
const http     = require('http')
const body     = require('body-parser')
const compress = require('compression');
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

	app.post('/animation/:universe', function(req, res) {
		try {
			const universe = engine.universes[req.params.universe]

			// preserve old states
			const old = engine.universeToObject(req.params.universe)

			const animation = new engine.Animation()
			for(const step in req.body) {
				animation.add(
					req.body[step].to,
					req.body[step].duration || 0,
					req.body[step].options  || {}
				)
			}
			animation.add(old, 0)
			animation.run(universe)
			res.json({"success": true})
		} catch(e) {
			console.log(e)
			res.json({"error": String(e)})
		}
	})

	io.sockets.on('connection', function(socket) {
		socket.emit('init', {'profiles': engine.profiles, 'setup': engine.config})

		socket.on('request_refresh', function() {
			socket.emit('update', engine.dmx.data.slice(1))
		})

		socket.on('update', function(update) {
			engine.update(update)
		})

		engine.dmx.on('update', function(update) {
			socket.emit('update', update)
		})
	})

console.log("ZeDMX listening on ", listen_port);