import React from 'react'
import request from 'request'

export default class CommandInput extends React.Component {
	constructor() {
		super()
		this.state = {
			command: ''
		}
	}
	handleChange = e => {
		const { name, value } = e.target
		this.setState({command: value})
	}
	submit = e => {
		e.preventDefault()
		const { command } = this.state
		request.post('http://localhost:8080/console', {form: { command }})
		this.setState({command: ''})
	}
	render() {
		const { command } = this.state
		return (
			<form onSubmit={this.submit} className='command'> 
				<input
					name='command'
					value={command}
					onChange={this.handleChange}
				/>
			</form>
		)
	}
}