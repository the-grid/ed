import App from './components/app'

import React from 'react'
import ReactDOM from 'react-dom'


export default App

export function mountApp (container, props) {
  let mounted
  if (!container) {
    throw new Error('Missing container')
  }
  if (!props) {
    throw new Error('Missing props')
  }
  if (!props.ref) {
    // HACK might be async in future React
    props.ref = function (m) {
      mounted = m
    }
  }
  // Setup main DOM structure
  const app = React.createElement(App, props)
  ReactDOM.render(app, container)
  return mounted
}

export function unmountApp (container) {
  ReactDOM.unmountComponentAtNode(container)
}
