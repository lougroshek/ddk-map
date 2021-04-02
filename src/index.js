import './index.css'

import React from 'react'
import { render } from 'react-dom'

import App from './App'
import { Explorer } from './modules/ddk'

render(<Explorer />, document.querySelector('#explorer'))
