import React from 'react'
import { render } from 'react-dom'
import io from 'socket.io-client'

import 'semantic-ui-css/semantic.min.css'

import Desk from './desk'
import UniverseOut from './universe-out'

const socket = io()

render(<Desk socket={socket} />, document.getElementById('app'))