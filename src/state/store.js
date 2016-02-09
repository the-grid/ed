import { createStore } from 'redux'
import reducers from './reducers'

export default function configureStore (initialState = []) {
  const store = createStore(reducers, initialState,
    // Can use https://github.com/zalmoxisus/redux-devtools-extension
    window.devToolsExtension ? window.devToolsExtension() : undefined
  )
  return store
}
