// Payload: {id, type, initialRectangle}
export const addWidget = function (payload) {
  return {
    type: 'ADD_WIDGET',
    payload
  }
}

export const moveWidget = function (id, rectangle) {
  return {
    type: 'MOVE_WIDGET',
    id,
    rectangle
  }
}
