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
	constructor({offset = 0}) { 
		super()
		this.offset = offset

		console.log("UOut", this)
	}
	render() {
		const { patched, dmx } = this.props
		const p = patched || {}
		return (
			<table>
				<caption>Universe</caption>
				<tbody>
				{sixteen.map(i =>
					<tr key={i}>
						<th key={1+i*16}>{1+i*16}</th>
						{sixteen.map(j =>
							<Channel 
								key={i+j} 
								patched={p[1+i*16+j]} 
								value={dmx[1+i*16+j]} 
							/>
						)}
					</tr>
				)}
				</tbody>
			</table>
		)
	}
}