import React from 'react'
import { render } from 'react-dom'
import io from 'socket.io-client'

import Desk from './desk'

const socket = io()

render(<Desk socket={socket} />, document.getElementById('app'))