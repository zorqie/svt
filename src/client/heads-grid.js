import React from 'react'

import { Button } from 'semantic-ui-react'

const SIZE = 8
const eight = [...Array(SIZE).keys()]

const GridItem = ({i, items}) => 
	<Button as='td' basic inverted >
		{items && items[i] ? items[i].name || items[i].label : '\u00A0'}
	</Button>

export default class HeadsGrid extends React.Component {
	constructor() {
		super()
	}
	onClick = e => {
		const {target} = e
		const c = target.cellIndex
		const r = target.parentNode.rowIndex
		const { handleClick, items } = this.props
		const item = items[SIZE*r+c]
		handleClick(item)
		console.log("Clack", c, r)
	}
	render() {
		const { caption, items } = this.props 

		return (
			<table className="grid8" onClick={this.onClick}>
				<caption>{caption}</caption>
				<tbody>
					{eight.map(r =>
						<tr key={r}>
						{eight.map(i => {
							const item = items && items[SIZE*r+i] || {}
							return (<GridItem key={SIZE*r+i} i={SIZE*r+i} items={items} />)
						}
						)}
						</tr>
					)}
				</tbody>
			</table>
		)
	}
}