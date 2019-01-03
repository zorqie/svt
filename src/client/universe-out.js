import React from 'react'

const sixteen = [...Array(16).keys()]

const Channel = ({patched, value}) => {
	return (
		<td className={patched ? 'patched ' + patched : ''}>
			{value || '0'}
		</td>
	)
}

export default class UniverseOut extends React.Component {	
	constructor({socket, offset = 0}) { 
		super()
		this.offset = offset
		// this.state = {dmx: {}}
		this.socket = socket
	}
	// componentDidMount() {
		// this.socket.on('init', this.init)
	// 	this.socket.on('update', this.receiveUpdate)
	// }
	// componentWillUnmount() {
		// this.socket.removeListener('init', this.init)
	// 	this.socket.removeListener('update', this.receiveUpdate)
	// }

	// receiveUpdate = u => {
	// 	const dmx = this.state.dmx
	// 	for(var i in u) {
	// 		dmx[i] = u[i] 
	// 	}
	// 	this.setState({dmx})
	// }
	
	renderChannel = (i, j, value) => {
		const { patched } = this.props
		const p = patched || {}
		return (<td key={1+i*16+j} className={p ? 'patched ' + p[1+i*16+j] : ''}>
					{value || '0'}
				</td>)
	}
	render() {
		const { dmx } = this.props
		return (
			<table>
				<caption>Universe</caption>
				<tbody>
				{sixteen.map(i =>
					<tr key={i}>
						<th key={1+i*16}>{1+i*16}</th>
						{sixteen.map(j =>
							this.renderChannel(i, j, dmx[1+i*16+j])
						)}
					</tr>
				)}
				</tbody>
			</table>
		)
	}
}