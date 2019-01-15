import { EventEmitter } from 'events'
import fs from 'fs'

export default class Store extends EventEmitter {

	constructor(path, key = 'items', idPrefix = '') {
		super()
		this.path = path
		this.key = key
		this.idPrefix = idPrefix
		this.items = this.read()
	}

	add(item, callback) {
		const { items } = this
		console.log("ITemized", items)
		const { id, ...others } = item
		const newItem = {id: this.idPrefix+items.length, ...others}
		this.items = [...items, newItem]
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

	find(query) {
		for(let i = 0, l = this.items.length; i < l; i++) {
			const item = this.items[i]
			if(item && (query === item.id || query === item.name || query === item.label)) {
				// console.log("Found", item)
				return item
			}
		}
		return null
	}

	read() {
		const { path } = this
		const file = JSON.parse(fs.readFileSync(path, 'utf8'))
		return file[this.key]
 	}

	write(callback) {
		const { path, items } = this
		fs.writeFile(path, JSON.stringify({[this.key]: this.items}, null, '\t'), callback)
	}
}