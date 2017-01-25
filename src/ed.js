import App from './components/app'

import React from 'react'
import ReactDOM from 'react-dom'


export default App

export function mountApp (container, props) {
  if (!container) {
    throw new Error('Missing container')
  }
  if (!props) {
    throw new Error('Missing props')
  }
  // Setup main DOM structure
  const app = React.createElement(App, props)
  ReactDOM.render(app, container)
}

export function unmountApp (container) {
  ReactDOM.unmountComponentAtNode(container)
}
