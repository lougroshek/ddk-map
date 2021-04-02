import './index.css'

import React from 'react'
import { render } from 'react-dom'

import { Explorer } from './modules/ddk'

// For testing props that will be passed in from Gatsby,
// where they are editable by the CMS.
const lang = 'en_US'
import langSet from './cms/lang.json'

render(
  <Explorer lang={lang} langSet={langSet} />,
  document.querySelector('#explorer'),
)
