import { EventEmitter } from 'events'
import fs from 'fs'

export default class Store extends EventEmitter {

	constructor(path, key = 'items') {
		super()
		this.path = path
		this.key = key
		this.items = this.read()
	}

	add(item, callback) {
		let { path, items } = this
		this.items = [...items, item]
		this.write(callback)
		this.emit('added', item)
	}

	remove(item, callback) {
		const { path, items } = this
		this.items = items.filter(p => p === null || p.id !== item.id)
		this.write(callback)
		this.emit('removed', item)
	}

	update(item, callback) {
		const { path, items } = this
		for(let i = 0; i < this.items.length; i++) {
			const p = this.items[i]
			if(p && p.id === item.id) {
				this.items[i] = item
				break
			}
		}
		this.write(callback)
		this.emit('updated', item)
	}

	list() {
		return this.items
	}

	read() {
		const { path } = this
		const file = JSON.parse(fs.readFileSync(path, 'utf8'))
		return file[this.key]
 	}

	write(callback) {
		const { path, items } = this
		fs.writeFile(path, JSON.stringify({[this.items]: this.items}, null, '\t'), callback)
	}
}