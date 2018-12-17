module.exports = {
	'monoprice-par-575': {
		channels: [
			'dimmer', 
			'red', 
			'green', 
			'blue', 
			'white',
			'strobe', 
			'ctrl', 
		],
		ranges: {
			'ctrl': {
				'type': 'option',
				'options': [
					{'value':   0, 'label': 'Black Out'},
					{'value':   1, 'label': 'Dimmer 1'},
					{'value':  16, 'label': 'Dimmer 2'},
					{'value':  32, 'label': 'Red'},
					{'value':  48, 'label': 'Green'},
					{'value':  64, 'label': 'Blue'},
					{'value':  80, 'label': 'Purple'},
					{'value':  96, 'label': 'Yellow'},
					{'value': 112, 'label': 'Cyan'},
					{'value': 128, 'label': 'White'},
					{'value': 144, 'label': 'Color change'},
					{'value': 160, 'label': 'Color flow'},
					{'value': 176, 'label': 'Color dream'},
					{'value': 192, 'label': 'Multi flow'},
					{'value': 208, 'label': 'Dream flow'},
					{'value': 224, 'label': 'Two color flow'},
					{'value': 240, 'label': 'Sound activity'}		
				]
			},
			'dimmer': {
				'type': 'slider',
				'min': 0,
				'max': 255
			}
		}
	},
	'monoprice-par-hex': {
		channels: [
			'dimmer', 
			'red', 
			'green', 
			'blue', 
			'amber',
			'white',
			'uv',
			'strobe', 
			'program',
			'program_speed',
			'dimmer_mode' 
		],
		ranges: {
			'ctrl': {
				'type': 'option',
				'options': [
					{'value':   0, 'label': 'Black Out'},
					{'value':   1, 'label': 'Dimmer 1'},
					{'value':  16, 'label': 'Dimmer 2'},
					{'value':  32, 'label': 'Red'},
					{'value':  48, 'label': 'Green'},
					{'value':  64, 'label': 'Blue'},
					{'value':  80, 'label': 'Purple'},
					{'value':  96, 'label': 'Yellow'},
					{'value': 112, 'label': 'Cyan'},
					{'value': 128, 'label': 'White'},
					{'value': 144, 'label': 'Color change'},
					{'value': 160, 'label': 'Color flow'},
					{'value': 176, 'label': 'Color dream'},
					{'value': 192, 'label': 'Multi flow'},
					{'value': 208, 'label': 'Dream flow'},
					{'value': 224, 'label': 'Two color flow'},
					{'value': 240, 'label': 'Sound activity'}		
				]
			},
			'dimmer': {
				'type': 'slider',
				'min': 0,
				'max': 255
			}
		}
	},
}