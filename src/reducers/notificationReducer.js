const notificationReducer = (state = null, action) => {
  switch(action.type) {
  case 'NOTIFY':
    return {
      message: action.message,
      type: action.messageType
    }
  case 'RESET':
    return null
  default:
    return state
  }
}

let timeoutID

export const notifyWith = (notification, messageType) => {
  return async (dispatch) => {
    dispatch({
      type: 'NOTIFY',
      message: notification,
      messageType
    })

    if (timeoutID) {
      clearTimeout(timeoutID)
    }

    timeoutID = setTimeout(() => {
      dispatch({
        type: 'RESET'
      })
    }, 5000)
  }
}

export default notificationReducer