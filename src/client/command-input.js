import React from 'react'
import request from 'request'
import { Form, Input } from 'semantic-ui-react'

export default class CommandInput extends React.Component {
	constructor() {
		super()
		this.state = {
			command: ''
		}
	}
	handleChange = (e, { name, value }) => {
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
			<Form onSubmit={this.submit}>
				<Input
					icon="chevron right"
					iconPosition='left'
					fluid
					name='command'
					value={command}
					onChange={this.handleChange}
				/>
			</Form>
		)
	}
}