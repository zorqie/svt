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
				'options': [
					{'min':   0, "max":  31, 'label': 'OFF'},
					{'min':  32, "max":  63, 'label': 'Pulse Down'},
					{'min':  64, "max":  95, 'label': 'Pulse Up'},
					{'min':  96, "max": 127, 'label': 'Pulse'},
					{'min': 128, "max": 164, 'label': 'Fade'},
					{'min': 165, "max": 191, 'label': 'Auto'},
					{'min': 192, "max": 223, 'label': '4Color'},
					{'min': 224, "max": 255, 'label': 'Multi'}
				]
			},
			"strobe": {
				"options": [
					{"min":  0, "max":  14, "label": "OFF"},
					{"min": 15, "max": 255, "label": "Strobing", "speed": "asc"}
				]
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
			'program': {
				'options': [
					{'min':   0, "max":  31, 'label': 'OFF'},
					{'min':  32, "max":  63, 'label': 'Pulse Down'},
					{'min':  64, "max":  95, 'label': 'Pulse Up'},
					{'min':  96, "max": 127, 'label': 'Pulse'},
					{'min': 128, "max": 164, 'label': 'Fade'},
					{'min': 165, "max": 191, 'label': 'Auto'},
					{'min': 192, "max": 223, 'label': 'Color flash'},
					{'min': 224, "max": 255, 'label': 'Sound'}
				]
			},
			"strobe": {
				"options": [
					{"min":  0, "max":  14, "label": "OFF"},
					{"min": 15, "max": 255, "label": "Strobing", "speed": "asc"}
				]
			},
			'dimmer_mode': {
				"options": [
					{"min":   0, "max":   5, "label": "Device"},
					{"min":   6, "max":  55, "label": "Mode 0"},
					{"min":  56, "max": 105, "label": "Mode 1"},
					{"min": 106, "max": 155, "label": "Mode 2"},
					{"min": 156, "max": 205, "label": "Mode 3"},
					{"min": 206, "max": 255, "label": "Mode 4"}
				]
			}
		}
	},
}