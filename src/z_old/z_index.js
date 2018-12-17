const fs       = require('fs')
const http     = require('http')
const body     = require('body-parser')
const express  = require('express')
const socketio = require('socket.io')
const program  = require('commander')

const engine 	= require('./engine')

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

	app.get('/', function(req, res) {
		res.sendFile(__dirname + '/public/index.html')
	})
	app.get('/style.css', function(req, res) {
		res.sendFile(__dirname + '/public/style.css')
	})

	app.get('/config', function(req, res) {
		const response = {"devices": engine.devices, "universes": {}}
		Object.keys(engine.config.universes).forEach(function(key) {
			response.universes[key] = engine.config.universes[key].devices
		})

		res.json(response)
	})

	app.get('/state/:universe', function(req, res) {
		if(!(req.params.universe in engine.universes)) {
			res.status(404).json({"error": "universe not found"})
			return
		}

		res.json({"state": engine.universeToObject(req.params.universe)})
	})

	app.post('/state/:universe', function(req, res) {
		if(!(req.params.universe in engine.universes)) {
			res.status(404).json({"error": "universe not found"})
			return
		}

		engine.update(req.params.universe, req.body)
		res.json({"state": engine.universeToObject(req.params.universe)})
	})

	app.post('/console', function(req, res) {
		engine.parseLine(req.body.command)
		res.json({"state": engine.universeToObject('art1')})
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
		socket.emit('init', {'devices': engine.devices, 'setup': engine.config})

		socket.on('request_refresh', function() {
			for(const universe in config.universes) {
				socket.emit('update', universe, engine.universeToObject(universe))
			}
		})

		socket.on('update', function(universe, update) {
			engine.update(universe, update)
		})

		engine.on('update', function(universe, update) {
			socket.emit('update', universe, update)
		})
	})

console.log("ZeDMX listening on ", listen_port);