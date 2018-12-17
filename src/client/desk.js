import React from 'react'

import UniverseOut from './universe-out'
import CommandInput from './command-input'
import ChannelSlider from './channel-slider'

const dmx = val => val > 255 ? 255 : val < 0 ? 0 : val

export default class Desk extends React.Component {
	constructor({socket}) {
		super()
		this.socket = socket
		this.state = {
			inited: false,
			dmx: {}
		}
	}
	componentDidMount() {
		this.socket.on('init', this.init)
		this.socket.on('update', this.receiveUpdate)
	}
	componentWillUnmount() {
		this.socket.removeListener('init', this.init)
	}

	receiveUpdate = u => {
		this.setState({dmx: {...this.state.dmx, ...u}})
	}

	init = msg => {
		const { profiles, setup } = msg
		const patched = {}
		for(let d in setup.devices) {
			const { address, type } = setup.devices[d]
			const profile = profiles[type]
			for(let c in profile.channels) {
				patched[address + 1*c] = profile.channels[c]
			}
			patched[address] += ' from'
		}
		this.setState({inited: true, patched, profiles, ...setup })
		console.log("thus", this)

	}

	getOne(channel) {
		if (Array.isArray(channel)) {
			const val = this.state.dmx[channel[0]]
			var same = true
			for(var c of channel) {
				if(this.state.dmx[c] != val) {
					same = false;
					break;
				}
			}
			return same ? val : '///'
		} else {
			return this.state.dmx[channel]
		}
	}

	getAll(channel) {
		if (Array.isArray(channel)) {

		} else {
			return [this.state.dmx[channel]]
		}
	}

	inc(channel, delta, e) {
		const d = e && e.shiftKey ? 10 : 1
		if (Array.isArray(channel)) {
			const u = {}
			for(var c=0; c < channel.length; c++) {
				const oldVal = 1*this.state.dmx[channel[c]]
				const newVal = dmx(oldVal + d * delta)
				if(oldVal != newVal) {
					u[channel[c]] = newVal
				}
			}
			this.socket.emit('update', u)
		} else {
			const oldVal = 1*this.state.dmx[channel]
			var newVal = dmx(oldVal + d * delta)
			if(oldVal != newVal) {
				const u = {}
				u[channel] = newVal
				this.socket.emit('update', u)
			}
		} 
	}

	renderSlider = channel => <ChannelSlider 
		key={channel}
		value={this.getOne(channel) || 0} 
		inc={this.inc.bind(this, channel, 1)} 
		dec={this.inc.bind(this, channel, -1)}
	/>

	render() {
		const { dmx, patched, profiles, devices } = this.state
		return (
			<div>
				<h1>Ze DMX Desk</h1>
				<UniverseOut 
					dmx={dmx} 
					patched={patched}
				/>
				<CommandInput />
				{patched && Object.keys(patched).map(ch => patched[ch].indexOf('dimmer ') >= 0 ? this.renderSlider(ch) : '')}
				<h2>ALL</h2>
				{this.renderSlider(["98", '206', '217', "228"])}
			</div>
		)
	}
}