const widget = (state, action) => {
  switch (action.type) {
    case 'ADD_WIDGET':
      return action.payload
    case 'MOVE_WIDGET':
      if (state.id !== action.id) {
        return state
      }
      return {
        rectangle: action.rectangle,
        ...state
      }
    default:
      return state
  }
}

const widgets = (state = [], action) => {
  switch (action.type) {
    case 'ADD_WIDGET':
      return [
        ...state,
        widget(undefined, action)
      ]
    case 'MOVE_WIDGET':
      return state.map(widgetState =>
        widget(widgetState, action)
      )
    default:
      return state
  }
}

export default widgets
