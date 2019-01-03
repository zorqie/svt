import React from 'react'

import { Button, Icon, Input } from 'semantic-ui-react'

export default class ChannelSlider extends React.Component {	
	handleWheel = e => {
		// console.log("W", e.deltaX, e.deltaY, e.deltaZ)
		const { inc, dec } = this.props
		if(e.deltaY < 0) 
			inc(e)
		else 
			dec(e)
	}
	render() {
		const { value, inc, dec } = this.props
		return (
			<Button.Group compact>
				<Button name="dec" basic compact inverted icon="caret left" onMouseDown={dec} />
				<Button basic compact inverted onWheel={this.handleWheel} style={{width: '4em', textAlign: 'right'}}>{value}</Button>
				<Button name="inc" basic compact inverted icon="caret right" onMouseDown={inc} />
			</Button.Group>
		)
	}

}